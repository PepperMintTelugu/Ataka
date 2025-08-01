import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Shield,
  AlertTriangle,
} from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Truck className="w-8 h-8 text-brand-600" />
          <h1 className="text-3xl font-bold">Shipping & Delivery Policy</h1>
        </div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-gray-700">
          We're committed to delivering your Telugu books safely and promptly to
          your doorstep.
        </p>
        <p className="telugu-text text-gray-600 mt-2">
          మేము మీ తెలుగు పుస్తకాలను సురక్షితంగా మరియు వేగంగా మీ ఇంటి వద్దకు
          చేరవేయడానికి కట్టుబడి ఉన్నాము.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">
                We Deliver Throughout India
              </h4>
              <p className="text-green-700 mt-2">
                TeluguBooks delivers to all states and union territories across
                India, including remote locations.
              </p>
            </div>

            <h4 className="font-semibold">Coverage Areas:</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800">Metro Cities</h5>
                <p className="text-sm text-blue-700">
                  Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune,
                  Ahmedabad
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800">Tier 2 Cities</h5>
                <p className="text-sm text-blue-700">
                  Visakhapatnam, Vijayawada, Guntur, Warangal, and 500+ other
                  cities
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800">Rural Areas</h5>
                <p className="text-sm text-blue-700">
                  Villages and remote locations with postal connectivity
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Some remote locations may require
                additional 2-3 days for delivery. We'll inform you during
                checkout if your area requires extended delivery time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delivery Timeframes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Standard Delivery Times:</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-green-800">Metro Cities</h5>
                  <p className="text-sm text-green-700">
                    Major metropolitan areas
                  </p>
                </div>
                <span className="font-bold text-green-800">
                  2-4 Business Days
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-blue-800">Tier 2 Cities</h5>
                  <p className="text-sm text-blue-700">
                    State capitals and major cities
                  </p>
                </div>
                <span className="font-bold text-blue-800">
                  4-6 Business Days
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-orange-800">Other Cities</h5>
                  <p className="text-sm text-orange-700">
                    District headquarters and towns
                  </p>
                </div>
                <span className="font-bold text-orange-800">
                  5-7 Business Days
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-red-800">Remote Areas</h5>
                  <p className="text-sm text-red-700">
                    Villages and remote locations
                  </p>
                </div>
                <span className="font-bold text-red-800">
                  7-10 Business Days
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">
                Business Days Explanation:
              </h4>
              <p className="text-blue-700 text-sm mt-2">
                Business days are Monday through Saturday, excluding Sundays and
                national holidays. Orders placed on Sunday or holidays will be
                processed the next business day.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 text-xl">
                FREE SHIPPING on orders above ₹299!
              </h4>
              <p className="text-green-700 mt-2">
                Enjoy free delivery across India when your order value exceeds
                ₹299.
              </p>
            </div>

            <h4 className="font-semibold">
              Shipping Charges for orders below ₹299:
            </h4>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h5 className="font-medium text-lg mb-2">All Areas in India</h5>
              <p className="text-3xl font-bold text-brand-600">₹29</p>
              <p className="text-sm text-gray-600 mt-2">
                Flat shipping rate for orders below ₹299
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Covers all locations - Metro cities, towns, and villages
              </p>
            </div>

            <h4 className="font-semibold">Special Shipping Options:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Express Delivery:</strong> Available in select metro
                cities (₹100 extra, 1-2 days)
              </li>
              <li>
                <strong>Weekend Delivery:</strong> Available in major cities
                (₹50 extra)
              </li>
              <li>
                <strong>Gift Wrapping:</strong> Free service for orders above
                ₹299
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Processing Timeline:</h4>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">1</span>
                </div>
                <div>
                  <h5 className="font-medium">Order Confirmation</h5>
                  <p className="text-sm text-gray-600">
                    Within 30 minutes of placing order
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">2</span>
                </div>
                <div>
                  <h5 className="font-medium">Payment Verification</h5>
                  <p className="text-sm text-gray-600">
                    1-2 hours for online payments, immediate for COD
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">3</span>
                </div>
                <div>
                  <h5 className="font-medium">Packaging & Dispatch</h5>
                  <p className="text-sm text-gray-600">
                    Within 24 hours of payment confirmation
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">4</span>
                </div>
                <div>
                  <h5 className="font-medium">Tracking Information</h5>
                  <p className="text-sm text-gray-600">
                    SMS and email with tracking details
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">
                Order Cut-off Times:
              </h4>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• Orders placed before 2:00 PM: Same day processing</li>
                <li>• Orders placed after 2:00 PM: Next day processing</li>
                <li>• Sunday orders: Processed on Monday</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Packaging & Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Our Commitment to Safe Delivery:</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-800">
                  Protective Packaging
                </h5>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Bubble wrap for fragile books</li>
                  <li>• Waterproof plastic covers</li>
                  <li>• Sturdy cardboard boxes</li>
                  <li>• Cushioning materials</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800">Quality Assurance</h5>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Quality check before packing</li>
                  <li>• Damage-resistant packaging</li>
                  <li>• Branded packaging materials</li>
                  <li>• Eco-friendly materials</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800">
                Damaged Package Policy:
              </h4>
              <p className="text-yellow-700 text-sm mt-2">
                If you receive a damaged package, don't accept the delivery.
                Contact us immediately and we'll arrange for a replacement at no
                extra cost.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Track Your Order:</h4>
            <p>
              Once your order is dispatched, you'll receive tracking information
              via:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>SMS to your registered mobile number</li>
              <li>Email to your registered email address</li>
              <li>Order tracking page on our website</li>
              <li>WhatsApp updates (if opted in)</li>
            </ul>

            <div className="bg-brand-50 p-4 rounded-lg">
              <h4 className="font-semibold text-brand-800">
                Tracking Information Includes:
              </h4>
              <ul className="text-brand-700 text-sm mt-2 space-y-1">
                <li>• Order dispatch confirmation</li>
                <li>• Current location of package</li>
                <li>• Expected delivery date</li>
                <li>• Delivery attempt notifications</li>
                <li>• Successful delivery confirmation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Our Trusted Shipping Partners:</h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <h5 className="font-medium">ShipRocket</h5>
                <p className="text-sm text-gray-600">
                  Primary logistics partner
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <h5 className="font-medium">India Post</h5>
                <p className="text-sm text-gray-600">For remote locations</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <h5 className="font-medium">Delhivery</h5>
                <p className="text-sm text-gray-600">Express delivery option</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              We work with multiple courier partners to ensure reliable delivery
              across all locations in India.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delivery Issues & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Common Delivery Issues:</h4>

            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <h5 className="font-medium text-red-800">
                  Package Not Delivered
                </h5>
                <p className="text-sm text-red-700">
                  Contact us within 24 hours if your package doesn't arrive on
                  the expected date
                </p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <h5 className="font-medium text-orange-800">Wrong Address</h5>
                <p className="text-sm text-orange-700">
                  Address changes are possible before dispatch. Additional
                  charges may apply for redirecting packages
                </p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <h5 className="font-medium text-yellow-800">
                  Delayed Delivery
                </h5>
                <p className="text-sm text-yellow-700">
                  We'll provide updates and compensation for delays beyond our
                  committed timeframes
                </p>
              </div>
            </div>

            <h4 className="font-semibold">Customer Support for Delivery:</h4>
            <div className="bg-brand-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> delivery@telugubooks.org
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>WhatsApp:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 8:00 PM IST
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash on Delivery (COD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">COD Available</h4>
              <p className="text-green-700">
                Pay cash when your books are delivered to your doorstep.
                Available across India.
              </p>
            </div>

            <h4 className="font-semibold">COD Terms:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Available for orders up to ₹5,000</li>
              <li>No additional COD handling charges</li>
              <li>Exact change preferred (courier may not carry change)</li>
              <li>Payment in Indian Rupees only</li>
              <li>Valid government ID required for high-value orders</li>
            </ul>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> COD orders are subject to verification.
                Orders may be cancelled if we cannot verify the delivery address
                or contact information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">
                Currently Not Available
              </h4>
              <p className="text-red-700">
                We currently deliver only within India. International shipping
                will be available soon.
              </p>
            </div>

            <p>
              If you're interested in international delivery, please contact us
              at international@telugubooks.org to join our waiting list.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
