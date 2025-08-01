import { Client, Databases, Functions, Query, ID } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const functions = new Functions(client);

  const DATABASE_ID = "ataka_db";
  const ORDERS_COLLECTION = "orders";
  const BOOKS_COLLECTION = "books";

  try {
    const { path, method, userId, ...body } = JSON.parse(req.bodyRaw || "{}");

    switch (path) {
      case "/orders":
        if (method === "GET") {
          return await getUserOrders(userId, body);
        } else if (method === "POST") {
          return await createOrder(userId, body);
        }
        break;

      case "/orders/:id":
        if (method === "GET") {
          return await getOrder(body.id, userId);
        } else if (method === "PUT") {
          return await updateOrder(body.id, body, userId);
        }
        break;

      case "/orders/admin":
        if (method === "GET") {
          return await getAllOrders(body);
        }
        break;

      case "/orders/:id/status":
        if (method === "PUT") {
          return await updateOrderStatus(body.id, body.status, body.adminNotes);
        }
        break;

      case "/orders/:id/track":
        if (method === "GET") {
          return await trackOrder(body.id);
        }
        break;

      default:
        return res.json({ success: false, message: "Endpoint not found" }, 404);
    }
  } catch (err) {
    error("Error processing request:", err);
    return res.json({ success: false, message: err.message }, 500);
  }

  async function getUserOrders(userId, filters = {}) {
    try {
      const queries = [Query.equal("userId", userId)];

      if (filters.status) {
        queries.push(Query.equal("orderStatus", filters.status));
      }
      if (filters.limit) {
        queries.push(Query.limit(parseInt(filters.limit)));
      }
      if (filters.offset) {
        queries.push(Query.offset(parseInt(filters.offset)));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
        total: response.total,
      });
    } catch (err) {
      throw new Error(`Failed to fetch user orders: ${err.message}`);
    }
  }

  async function getOrder(orderId, userId) {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
      );

      // Check if user owns this order or is admin
      if (order.userId !== userId && !req.headers["x-admin-access"]) {
        return res.json({ success: false, message: "Unauthorized" }, 403);
      }

      return res.json({ success: true, data: order });
    } catch (err) {
      throw new Error(`Failed to fetch order: ${err.message}`);
    }
  }

  async function createOrder(userId, orderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const order = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        ID.unique(),
        {
          orderNumber,
          userId,
          items: JSON.stringify(orderData.items),
          shippingAddress: JSON.stringify(orderData.shippingAddress),
          billingAddress: JSON.stringify(
            orderData.billingAddress || orderData.shippingAddress,
          ),
          orderSummary: JSON.stringify(orderData.orderSummary),
          paymentDetails: JSON.stringify(orderData.paymentDetails),
          orderStatus: "pending",
          isGift: orderData.isGift || false,
          giftMessage: orderData.giftMessage || "",
          customerNotes: orderData.customerNotes || "",
          timeline: JSON.stringify([
            {
              status: "pending",
              timestamp: new Date().toISOString(),
              message: "Order placed successfully",
            },
          ]),
        },
      );

      // Update book stock counts
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          try {
            const book = await databases.getDocument(
              DATABASE_ID,
              BOOKS_COLLECTION,
              item.bookId,
            );
            await databases.updateDocument(
              DATABASE_ID,
              BOOKS_COLLECTION,
              item.bookId,
              {
                stockCount: Math.max(0, book.stockCount - item.quantity),
                salesCount: book.salesCount + item.quantity,
                inStock: book.stockCount - item.quantity > 0,
              },
            );
          } catch (bookErr) {
            log(`Failed to update book stock for ${item.bookId}:`, bookErr);
          }
        }
      }

      return res.json({ success: true, data: order });
    } catch (err) {
      throw new Error(`Failed to create order: ${err.message}`);
    }
  }

  async function updateOrder(orderId, updateData, userId) {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
      );

      // Check if user owns this order
      if (order.userId !== userId) {
        return res.json({ success: false, message: "Unauthorized" }, 403);
      }

      const updatedOrder = await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
        {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      );

      return res.json({ success: true, data: updatedOrder });
    } catch (err) {
      throw new Error(`Failed to update order: ${err.message}`);
    }
  }

  async function getAllOrders(filters = {}) {
    try {
      const queries = [];

      if (filters.status) {
        queries.push(Query.equal("orderStatus", filters.status));
      }
      if (filters.limit) {
        queries.push(Query.limit(parseInt(filters.limit)));
      }
      if (filters.offset) {
        queries.push(Query.offset(parseInt(filters.offset)));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
        total: response.total,
      });
    } catch (err) {
      throw new Error(`Failed to fetch all orders: ${err.message}`);
    }
  }

  async function updateOrderStatus(orderId, status, adminNotes = "") {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
      );

      // Parse existing timeline
      let timeline = [];
      try {
        timeline = JSON.parse(order.timeline || "[]");
      } catch (e) {
        timeline = [];
      }

      // Add new status to timeline
      timeline.push({
        status,
        timestamp: new Date().toISOString(),
        message: getStatusMessage(status),
        adminNotes,
      });

      const updatedOrder = await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
        {
          orderStatus: status,
          timeline: JSON.stringify(timeline),
          adminNotes: adminNotes || order.adminNotes,
          updatedAt: new Date().toISOString(),
        },
      );

      return res.json({ success: true, data: updatedOrder });
    } catch (err) {
      throw new Error(`Failed to update order status: ${err.message}`);
    }
  }

  async function trackOrder(orderId) {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
      );

      let timeline = [];
      try {
        timeline = JSON.parse(order.timeline || "[]");
      } catch (e) {
        timeline = [];
      }

      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.orderStatus,
          timeline,
          shippingDetails: order.shippingDetails
            ? JSON.parse(order.shippingDetails)
            : null,
        },
      });
    } catch (err) {
      throw new Error(`Failed to track order: ${err.message}`);
    }
  }

  function getStatusMessage(status) {
    const messages = {
      pending: "Order is being processed",
      confirmed: "Order confirmed and being prepared",
      processing: "Order is being prepared for shipment",
      shipped: "Order has been shipped",
      delivered: "Order has been delivered",
      cancelled: "Order has been cancelled",
      refunded: "Order has been refunded",
    };
    return messages[status] || "Status updated";
  }
};
