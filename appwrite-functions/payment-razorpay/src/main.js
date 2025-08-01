import { Client, Databases, Functions, ID, Query } from 'node-appwrite';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const DATABASE_ID = 'ataka_db';
const COLLECTIONS = {
  BOOKS: 'books',
  ORDERS: 'orders',
  USERS: 'users'
};

export default async ({ req, res, log, error }) => {
  try {
    const { method, path } = req;
    const body = JSON.parse(req.body || '{}');

    // Handle different endpoints
    switch (path) {
      case '/create-order':
        return await createOrder(req, res, log, error, body);
      case '/verify-payment':
        return await verifyPayment(req, res, log, error, body);
      case '/get-config':
        return await getConfig(req, res);
      default:
        return res.json({
          success: false,
          message: 'Endpoint not found'
        }, 404);
    }
  } catch (err) {
    error('Function error:', err);
    return res.json({
      success: false,
      message: 'Internal server error',
      error: err.message
    }, 500);
  }
};

async function createOrder(req, res, log, error, body) {
  try {
    const { amount, currency = 'INR', items, shippingAddress, userId } = body;

    if (!razorpay) {
      return res.json({
        success: false,
        message: 'Payment service not available'
      }, 503);
    }

    // Validate and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        item.bookId
      );

      if (!book) {
        return res.json({
          success: false,
          message: `Book with ID ${item.bookId} not found`
        }, 400);
      }

      if (!book.inStock || book.stockCount < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${book.title}`
        }, 400);
      }

      const itemTotal = book.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        bookId: book.$id,
        quantity: item.quantity,
        price: book.price,
        title: book.title,
        author: book.author,
        image: book.image
      });
    }

    // Verify amount
    if (Math.abs(amount - calculatedTotal) > 0.01) {
      return res.json({
        success: false,
        message: 'Amount mismatch'
      }, 400);
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}_${userId}`,
      notes: {
        userId: userId,
      },
    });

    // Create order in database
    const order = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      ID.unique(),
      {
        orderNumber: `TB${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        userId: userId,
        items: JSON.stringify(orderItems),
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(shippingAddress),
        orderSummary: JSON.stringify({
          subtotal: calculatedTotal,
          shippingCost: 0,
          tax: 0,
          discount: 0,
          total: calculatedTotal
        }),
        paymentDetails: JSON.stringify({
          method: 'razorpay',
          razorpayOrderId: razorpayOrder.id,
          status: 'pending'
        }),
        orderStatus: 'pending',
        timeline: JSON.stringify([{
          status: 'pending',
          message: 'Order created, awaiting payment',
          timestamp: new Date().toISOString()
        }]),
        isGift: false
      }
    );

    log('Order created successfully:', order.$id);

    return res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.$id,
          orderNumber: order.orderNumber,
          total: calculatedTotal
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        },
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (err) {
    error('Create order error:', err);
    return res.json({
      success: false,
      message: 'Failed to create order',
      error: err.message
    }, 500);
  }
}

async function verifyPayment(req, res, log, error, body) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = body;

    // Find order
    const order = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      orderId
    );

    if (!order) {
      return res.json({
        success: false,
        message: 'Order not found'
      }, 404);
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Payment verification failed
      const failedPaymentDetails = JSON.parse(order.paymentDetails);
      failedPaymentDetails.status = 'failed';
      failedPaymentDetails.failureReason = 'Invalid signature';

      const failedTimeline = JSON.parse(order.timeline || '[]');
      failedTimeline.push({
        status: 'failed',
        message: 'Payment verification failed',
        timestamp: new Date().toISOString()
      });

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        orderId,
        {
          paymentDetails: JSON.stringify(failedPaymentDetails),
          timeline: JSON.stringify(failedTimeline)
        }
      );

      return res.json({
        success: false,
        message: 'Payment verification failed'
      }, 400);
    }

    // Payment verified successfully
    const paymentDetails = JSON.parse(order.paymentDetails);
    paymentDetails.status = 'paid';
    paymentDetails.paymentId = razorpay_payment_id;
    paymentDetails.razorpaySignature = razorpay_signature;
    paymentDetails.paidAt = new Date().toISOString();

    const timeline = JSON.parse(order.timeline || '[]');
    timeline.push({
      status: 'confirmed',
      message: 'Payment confirmed, order processing',
      timestamp: new Date().toISOString()
    });

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      orderId,
      {
        paymentDetails: JSON.stringify(paymentDetails),
        orderStatus: 'confirmed',
        timeline: JSON.stringify(timeline)
      }
    );

    // Update book stock
    const items = JSON.parse(order.items);
    for (const item of items) {
      const book = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        item.bookId
      );

      const newStockCount = Math.max(0, book.stockCount - item.quantity);
      const newSalesCount = book.salesCount + item.quantity;

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        item.bookId,
        {
          stockCount: newStockCount,
          salesCount: newSalesCount,
          inStock: newStockCount > 0
        }
      );
    }

    log('Payment verified successfully for order:', orderId);

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        order: {
          id: order.$id,
          orderNumber: order.orderNumber,
          status: 'confirmed',
          total: JSON.parse(order.orderSummary).total,
          paidAt: paymentDetails.paidAt
        }
      }
    });

  } catch (err) {
    error('Payment verification error:', err);
    return res.json({
      success: false,
      message: 'Payment verification failed',
      error: err.message
    }, 500);
  }
}

async function getConfig(req, res) {
  return res.json({
    success: true,
    data: {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    }
  });
}
