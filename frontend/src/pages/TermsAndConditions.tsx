import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing and using TeluguBooks website and services, you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
            <p className="telugu-text text-gray-600">
              TeluguBooks వెబ్‌సైట్ మరియు సేవలను యాక్సెస్ చేయడం మరియు ఉపయోగించడం
              ద్వారా, మీరు ఈ ఒప్పందం యొక్క నిబంధనలు మరియు నిబంధనలకు కట్టుబడి
              ఉండాలని అంగీకరిస్తున్నారు.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Services Provided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              TeluguBooks operates an online platform for the sale of Telugu
              books and literature. We provide:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Online book catalog and ordering system</li>
              <li>Secure payment processing</li>
              <li>Book delivery services</li>
              <li>Customer support services</li>
              <li>Author and publisher information</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Account Registration</h4>
            <p>
              To access certain features of our service, you must register for
              an account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>

            <h4 className="font-semibold">Account Security</h4>
            <p>
              You are responsible for safeguarding the password and for all
              activities that occur under your account. You agree to immediately
              notify us of any unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Orders and Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Order Processing</h4>
            <p>
              All orders are subject to acceptance and availability. We reserve
              the right to refuse or cancel any order for any reason, including
              but not limited to product availability, errors in pricing or
              product information, or problems identified by our fraud detection
              systems.
            </p>

            <h4 className="font-semibold">Pricing</h4>
            <p>
              All prices are in Indian Rupees (INR) and include applicable taxes
              unless otherwise stated. Prices are subject to change without
              notice. We strive to ensure that all prices displayed on our
              website are accurate, but errors may occur.
            </p>

            <h4 className="font-semibold">Payment Methods</h4>
            <p>
              We accept various payment methods including credit cards, debit
              cards, net banking, UPI, and digital wallets through our secure
              payment partners. Payment must be completed before order
              processing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Shipping and Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Delivery Areas</h4>
            <p>
              We deliver throughout India. Delivery times may vary based on
              location and product availability. International shipping is
              currently not available.
            </p>

            <h4 className="font-semibold">Delivery Timeframes</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Metro cities: 2-4 business days</li>
              <li>Other cities: 4-7 business days</li>
              <li>Remote areas: 7-10 business days</li>
            </ul>

            <h4 className="font-semibold">Risk of Loss</h4>
            <p>
              Title and risk of loss for products pass to you upon delivery to
              the carrier. We are not responsible for delays in delivery due to
              circumstances beyond our control.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Returns and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Return Policy</h4>
            <p>
              Books may be returned within 7 days of delivery if they are
              damaged, defective, or significantly different from what was
              ordered. Books must be in original condition with all packaging.
            </p>

            <h4 className="font-semibold">Refund Processing</h4>
            <p>
              Approved refunds will be processed within 5-7 business days to the
              original payment method. Shipping charges are non-refundable
              unless the return is due to our error.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All content on this website, including but not limited to text,
              graphics, logos, images, audio clips, digital downloads, data
              compilations, and software, is the property of TeluguBooks or its
              content suppliers and is protected by Indian and international
              copyright laws.
            </p>

            <h4 className="font-semibold">User Content</h4>
            <p>
              By submitting reviews, comments, or other content to our website,
              you grant us a non-exclusive, royalty-free, perpetual, and
              worldwide license to use, reproduce, modify, and distribute such
              content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your information when you use our
              services. By using our services, you agree to the collection and
              use of information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You may not use our service:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                For any unlawful purpose or to solicit others to unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
              <li>To upload viruses or any other type of malicious code</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              In no case shall TeluguBooks, our directors, officers, employees,
              affiliates, agents, contractors, interns, suppliers, service
              providers or licensors be liable for any injury, loss, claim, or
              any direct, indirect, incidental, punitive, special, or
              consequential damages of any kind.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You agree to defend, indemnify, and hold harmless TeluguBooks and
              our subsidiaries, affiliates, and all respective officers, agents,
              partners, and employees, from and against any loss, damage,
              liability, claim, or demand.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms and Conditions are governed by and construed in
              accordance with the laws of India. Any disputes arising under
              these terms shall be subject to the exclusive jurisdiction of the
              courts in Hyderabad, Telangana.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to update, change, or replace any part of
              these Terms and Conditions by posting updates and changes to our
              website. It is your responsibility to check our website
              periodically for changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>14. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Questions about the Terms and Conditions should be sent to us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> legal@telugubooks.org
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Address:</strong> Hyderabad, Telangana, India
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
