import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  RotateCcw,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <RotateCcw className="w-8 h-8 text-brand-600" />
          <h1 className="text-3xl font-bold">Return & Refund Policy</h1>
        </div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-gray-700">
          We want you to be completely satisfied with your purchase. Our return
          and refund policy is designed to be fair and transparent.
        </p>
        <p className="telugu-text text-gray-600 mt-2">
          మీ కొనుగోలుతో మీరు పూర్తిగా సంతృప్తి చెందాలని మేము కోరుకుంటున్నాము. మా
          రిటర్న్ మరియు రీఫండ్ పాలసీ న్యాయంగా మరియు పారదర్శకంగా రూపొందించబడింది.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Return Window
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                7-Day Return Policy
              </h4>
              <p className="text-green-700 mt-2">
                You can return books within 7 days of delivery for a full
                refund, provided they meet our return conditions.
              </p>
            </div>

            <h4 className="font-semibold">Important Dates:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Return window starts from the date of delivery</li>
              <li>Return request must be initiated within 7 days</li>
              <li>
                Books must be returned within 14 days of initiating return
                request
              </li>
              <li>
                Refund processing begins after we receive and inspect the
                returned items
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Eligible Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-green-600">
              We accept returns for:
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-medium text-green-800">Damaged Books</h5>
                <p className="text-sm text-green-700">
                  Books damaged during shipping or manufacturing defects
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-medium text-green-800">Wrong Item</h5>
                <p className="text-sm text-green-700">
                  You received a different book than what you ordered
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-medium text-green-800">Defective Books</h5>
                <p className="text-sm text-green-700">
                  Books with missing pages, printing errors, or binding issues
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-medium text-green-800">Quality Issues</h5>
                <p className="text-sm text-green-700">
                  Books significantly different from description
                </p>
              </div>
            </div>

            <h4 className="font-semibold">Return Conditions:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Books must be in original condition</li>
              <li>All original packaging must be included</li>
              <li>Books should not have any markings, highlights, or damage</li>
              <li>Invoice or order confirmation must be provided</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Non-Returnable Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">
                We cannot accept returns for:
              </h4>
              <ul className="list-disc pl-6 text-red-700 mt-2 space-y-1">
                <li>Books returned after 7 days of delivery</li>
                <li>Books with markings, highlights, or writing</li>
                <li>
                  Books with damaged or missing pages (due to customer damage)
                </li>
                <li>Books without original packaging</li>
                <li>Digital downloads or e-books (if applicable)</li>
                <li>Personalized or customized books</li>
                <li>
                  Books purchased with special discounts during clearance sales
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Step-by-Step Return Process:</h4>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">1</span>
                </div>
                <div>
                  <h5 className="font-medium">Initiate Return Request</h5>
                  <p className="text-sm text-gray-600">
                    Contact our customer service or use the return form on your
                    account page
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">2</span>
                </div>
                <div>
                  <h5 className="font-medium">Receive Return Authorization</h5>
                  <p className="text-sm text-gray-600">
                    We'll send you a return authorization number and return
                    shipping label
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">3</span>
                </div>
                <div>
                  <h5 className="font-medium">Package & Ship</h5>
                  <p className="text-sm text-gray-600">
                    Pack the book securely with all original materials and
                    attach the return label
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">4</span>
                </div>
                <div>
                  <h5 className="font-medium">Inspection & Processing</h5>
                  <p className="text-sm text-gray-600">
                    We inspect the returned item and process your refund within
                    3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Refund Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Refund Methods:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Original payment method (preferred)</li>
              <li>Bank transfer (for cash on delivery orders)</li>
              <li>Store credit (if requested)</li>
            </ul>

            <h4 className="font-semibold">Refund Timeline:</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Credit/Debit Cards:</span>
                  <span className="font-medium">5-7 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Net Banking:</span>
                  <span className="font-medium">3-5 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>UPI/Digital Wallets:</span>
                  <span className="font-medium">1-3 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Cash on Delivery:</span>
                  <span className="font-medium">7-10 business days</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Refund timelines may vary depending on
                your bank or payment provider. We initiate refunds promptly
                after approval.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Return Shipping Policy:</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-800">
                  We Pay Return Shipping
                </h5>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Damaged or defective books</li>
                  <li>• Wrong item sent</li>
                  <li>• Our error or quality issues</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-medium text-orange-800">
                  Customer Pays Return Shipping
                </h5>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• Change of mind</li>
                  <li>• Order cancellation after shipping</li>
                  <li>• Personal preference returns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We currently offer refunds rather than direct exchanges. If you'd
              like a different book:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Return the original book following our return process</li>
              <li>Receive your refund</li>
              <li>Place a new order for the desired book</li>
            </ol>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Fast Exchange Option:</strong> For damaged or defective
                books, we can expedite a replacement while processing your
                return simultaneously.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Special Circumstances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Bulk Orders:</h4>
            <p className="text-sm text-gray-600">
              Orders of 10+ books may have extended return windows and special
              handling. Contact our customer service for assistance.
            </p>

            <h4 className="font-semibold">Rare or Out-of-Print Books:</h4>
            <p className="text-sm text-gray-600">
              Due to limited availability, rare books may have different return
              policies. This will be clearly mentioned on the product page.
            </p>

            <h4 className="font-semibold">International Orders:</h4>
            <p className="text-sm text-gray-600">
              Currently, we only serve customers in India. International return
              policies may differ if we expand internationally.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us for Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Need help with a return? Our customer service team is here to
              assist you:
            </p>
            <div className="bg-brand-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> returns@telugubooks.org
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 7:00 PM IST
              </p>
              <p>
                <strong>Address:</strong> Returns Department, TeluguBooks,
                Hyderabad, Telangana, India
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-800">
                When contacting us, please have ready:
              </h5>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Order number</li>
                <li>• Reason for return</li>
                <li>• Photos of damaged items (if applicable)</li>
                <li>• Your contact information</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
