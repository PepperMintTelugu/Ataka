import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, BookOpen, Bell } from "lucide-react";

interface NewsletterSectionProps {
  settings?: {
    backgroundColor?: string;
    title?: string;
    titleTelugu?: string;
    description?: string;
    descriptionTelugu?: string;
    benefits?: string[];
    benefitsTelugu?: string[];
  };
}

export default function NewsletterSection({
  settings = {},
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const defaultSettings = {
    backgroundColor: "bg-gradient-to-br from-indigo-600 to-purple-700",
    title: "Stay Updated with Telugu Literature",
    titleTelugu: "తెలుగు సాహిత్యంతో అప్‌డేట్‌గ��� ఉండండి",
    description:
      "Subscribe to our newsletter and get the latest updates on new book releases, author interviews, and exclusive offers.",
    descriptionTelugu:
      "మా వార్తాలేఖకు సబ్‌స్క్రైబ్ చేయండి మరియు కొత్త పుస్తక విడుదలలు, రచయిత ఇంటర్వ్యూలు మరియు ప్రత్యేక ఆఫర్లపై తాజా అప్‌డేట్‌లను పొందండి.",
    benefits: [
      "Latest book releases and reviews",
      "Exclusive discounts and offers",
      "Author interviews and insights",
      "Literary events and book fairs",
      "Personalized book recommendations",
    ],
    benefitsTelugu: [
      "తాజా పుస్తక విడుదలలు మరియు సమీక్షలు",
      "ప్రత్యేక తగ్గింపులు మరియు ఆఫర్లు",
      "రచయిత ఇంటర్వ్యూలు మరియు అంతర్దృష్టులు",
      "సాహిత్య కార్యక్రమాలు మరియు పుస్తక ప్రదర్శనలు",
      "వ్యక్తిగతీకరించిన పుస్తక సిఫార్సులు",
    ],
  };

  const config = { ...defaultSettings, ...settings };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubscribing(true);

      // Call newsletter subscription API
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Successfully Subscribed! 🎉",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className={`py-16 ${config.backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {config.title}
              </h2>
            </div>
            <p className="text-xl text-indigo-200 telugu-text mb-6">
              {config.titleTelugu}
            </p>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-4">
              {config.description}
            </p>
            <p className="text-base text-indigo-200 telugu-text max-w-2xl mx-auto">
              {config.descriptionTelugu}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                What You'll Get:
              </h3>
              <div className="space-y-3">
                {config.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <p className="text-indigo-100">{benefit}</p>
                      {config.benefitsTelugu &&
                        config.benefitsTelugu[index] && (
                          <p className="text-sm text-indigo-200 telugu-text">
                            {config.benefitsTelugu[index]}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Form */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 border border-white border-opacity-20">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-indigo-200 focus:bg-opacity-30 focus:border-white"
                    disabled={isSubscribing}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3"
                >
                  {isSubscribing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-indigo-200 text-center">
                  By subscribing, you agree to our privacy policy and terms of
                  service. Unsubscribe at any time.
                </p>
              </form>

              {/* Social Proof */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-indigo-200">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm">25,000+ subscribers</span>
                  </div>
                  <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <span className="text-sm">Weekly updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center mt-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
              <p className="text-indigo-100 mb-2">
                Join thousands of Telugu literature enthusiasts
              </p>
              <p className="text-sm text-indigo-200 telugu-text">
                వేలాది మంది తెలుగు సాహిత్య ప్రేమికులతో చేరండి
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
