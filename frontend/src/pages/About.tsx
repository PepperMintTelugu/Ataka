import React from "react";
import { BookOpen, Heart, Users, Award, Target, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 to-telugu-500 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 text-white/90" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About TeluguBooks
            </h1>
            <p className="text-lg lg:text-xl text-white/90 telugu-text mb-4">
              తెలుగు సాహిత్య ప్రేమికుల కోసం ఒక ప్రత్యేక ప్రయత్నం
            </p>
            <p className="text-lg lg:text-xl text-white/90">
              Preserving and promoting Telugu literature for future generations
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                TeluguBooks is more than just an e-commerce platform. We are a
                passionate initiative dedicated to preserving, promoting, and
                making Telugu literature accessible to readers worldwide. Our
                mission is to bridge the gap between classic Telugu literature
                and modern readers while supporting authors and publishers.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-brand-100 hover:border-brand-200 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Accessibility First
                  </h3>
                  <p className="text-gray-600">
                    Making quality Telugu books accessible to everyone at
                    cut-throat prices with no profit margins.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-telugu-100 hover:border-telugu-200 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-telugu-100 to-telugu-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-telugu-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Cultural Preservation
                  </h3>
                  <p className="text-gray-600">
                    Preserving the rich heritage of Telugu literature for future
                    generations to discover and cherish.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Community Building
                  </h3>
                  <p className="text-gray-600">
                    Creating a vibrant community of Telugu literature
                    enthusiasts, readers, and authors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                TeluguBooks was born from a simple observation: despite the rich
                heritage of Telugu literature spanning centuries, many beautiful
                works were becoming increasingly difficult to access. Classic
                novels, poetry collections, devotional texts, and contemporary
                works were scattered across different publishers, often
                available only in limited print runs.
              </p>
              <p className="mb-6">
                As a non-profit initiative, we decided to change this. We
                partnered with publishers, authors, and cultural organizations
                to create a centralized platform where Telugu literature
                enthusiasts could discover, explore, and purchase books at the
                most affordable prices possible.
              </p>
              <p className="mb-6">
                Our commitment goes beyond just selling books. We believe in:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  Offering books at cut-throat prices with zero profit margins
                </li>
                <li>Providing free delivery across India</li>
                <li>Ensuring beautiful, protective packaging for every book</li>
                <li>Supporting both established and emerging Telugu authors</li>
                <li>
                  Making literature accessible to all economic backgrounds
                </li>
              </ul>
              <p>
                Today, we're proud to serve thousands of readers across the
                globe, helping them connect with their cultural roots through
                the power of Telugu literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Content</h3>
                <p className="text-gray-600 text-sm">
                  Curating only the finest Telugu literature from trusted
                  publishers and authors.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Social Impact</h3>
                <p className="text-gray-600 text-sm">
                  Operating as an NGO with a focus on cultural preservation over
                  profit.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600 text-sm">
                  Free delivery and affordable pricing to make books accessible
                  to everyone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Committed to providing the best reading experience with
                  beautiful packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-r from-brand-500 to-telugu-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  10,000+
                </div>
                <div className="text-white/80">Books Available</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  5,000+
                </div>
                <div className="text-white/80">Happy Readers</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
                <div className="text-white/80">Authors Supported</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">₹0</div>
                <div className="text-white/80">Profit Margin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Be part of our journey to preserve and promote Telugu literature.
              Every book you purchase helps us continue this important cultural
              work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
              >
                Explore Books
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-brand-500 text-brand-500 hover:bg-brand-50 font-semibold rounded-lg transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
