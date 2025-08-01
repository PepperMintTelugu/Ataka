import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, Users, FileText, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-brand-600" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-gray-700">
          At TeluguBooks, we are committed to protecting your privacy and
          ensuring the security of your personal information.
        </p>
        <p className="telugu-text text-gray-600 mt-2">
          TeluguBooks వద్ద, మేము మీ గోప్యతను రక్షించడానికి మరియు మీ వ్యక్తిగత
          సమాచారం యొక్క భద్రతను నిర్ధారించడానికి కట్టుబడి ఉన్నాము.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Personal Information</h4>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Billing and shipping addresses</li>
              <li>
                Payment information (processed securely by our payment partners)
              </li>
              <li>Account preferences and communication settings</li>
              <li>Order history and purchase information</li>
            </ul>

            <h4 className="font-semibold">
              Automatically Collected Information
            </h4>
            <p>
              When you visit our website, we automatically collect certain
              information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address and browser information</li>
              <li>Device type and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website or search terms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Provide customer service and support</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Personalize your shopping experience</li>
              <li>Recommend books based on your interests</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
              <li>Send promotional emails (with your consent)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              3. Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">
              We may share your information with:
            </h4>

            <div className="space-y-3">
              <div>
                <h5 className="font-medium">Service Providers</h5>
                <p className="text-sm text-gray-600">
                  Third-party companies that help us operate our business, such
                  as payment processors, shipping companies, and email service
                  providers.
                </p>
              </div>

              <div>
                <h5 className="font-medium">Legal Requirements</h5>
                <p className="text-sm text-gray-600">
                  When required by law, court order, or government regulation,
                  or to protect our rights and safety.
                </p>
              </div>

              <div>
                <h5 className="font-medium">Business Transfers</h5>
                <p className="text-sm text-gray-600">
                  In connection with a merger, acquisition, or sale of assets,
                  your information may be transferred to the new entity.
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-800">We do NOT:</h5>
              <ul className="list-disc pl-6 text-sm text-green-700 mt-2">
                <li>Sell your personal information to third parties</li>
                <li>
                  Share your information for marketing purposes without consent
                </li>
                <li>
                  Use your payment information for any purpose other than
                  processing orders
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              4. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> While we strive to protect your
                information, no method of transmission over the internet is 100%
                secure. We continuously work to improve our security measures.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Types of Cookies We Use:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Required for website
                functionality
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us analyze site usage
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used for personalized
                advertising (with consent)
              </li>
            </ul>

            <p>
              You can control cookies through your browser settings. However,
              disabling certain cookies may affect website functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You have the following rights regarding your personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium">Access & Portability</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Request a copy of your personal data in a portable format
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium">Correction</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Update or correct inaccurate personal information
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium">Deletion</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Request deletion of your personal data (subject to legal
                  requirements)
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium">Marketing Opt-out</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Unsubscribe from promotional emails at any time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal information only as long as necessary to
              fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Account information: Until account deletion or 3 years of
                inactivity
              </li>
              <li>Order information: 7 years for tax and legal compliance</li>
              <li>
                Payment information: Not stored (handled by payment processors)
              </li>
              <li>Website analytics: Aggregated data retained for 2 years</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Payment Processors</h4>
            <p>
              We use secure, PCI-compliant payment processors including
              Razorpay, Stripe, and other authorized payment gateways. These
              services have their own privacy policies.
            </p>

            <h4 className="font-semibold">Shipping Partners</h4>
            <p>
              We share necessary delivery information with shipping partners
              like ShipRocket and courier services to fulfill your orders.
            </p>

            <h4 className="font-semibold">Analytics Services</h4>
            <p>
              We may use Google Analytics and similar services to understand
              website usage. These services collect anonymized data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our services are not directed to children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries
              other than India. We ensure that such transfers comply with
              applicable data protection laws and include appropriate
              safeguards.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date. For significant changes, we
              may also send you an email notification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              12. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="bg-brand-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> privacy@telugubooks.org
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Address:</strong> Data Protection Officer, TeluguBooks,
                Hyderabad, Telangana, India
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Response Time:</strong> We aim to respond to all
                privacy-related inquiries within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
