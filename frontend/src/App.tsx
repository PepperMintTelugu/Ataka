import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { Navigation } from "@/components/Navigation";
import { Cart } from "@/components/Cart";
import { Wishlist } from "@/components/Wishlist";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import IndexCustomizable from "./pages/IndexCustomizable";
import Shop from "./pages/Shop";
import BookDetails from "./pages/BookDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminTheme from "./pages/AdminTheme";
import AdminHomepage from "./pages/AdminHomepage";
import AdminRankings from "./pages/AdminRankings";
import CategoryRankings from "./pages/CategoryRankings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutEnhanced from "./pages/CheckoutEnhanced";
import OrderSuccess from "./pages/OrderSuccess";
import ProductImport from "./pages/ProductImport";
import AuthorBooks from "./pages/AuthorBooks";
import PublisherBooks from "./pages/PublisherBooks";
import AllAuthors from "./pages/AllAuthors";
import AllPublishers from "./pages/AllPublishers";
import AuthorProfile from "./pages/AuthorProfile";
import PublisherProfile from "./pages/PublisherProfile";
import Settings from "./pages/Settings";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AppProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <Cart />
                <Wishlist />

              <main className="flex-1 pb-16 lg:pb-0">
                <Routes>
                  <Route path="/" element={<IndexCustomizable />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/theme" element={<AdminTheme />} />
                  <Route path="/admin/homepage" element={<AdminHomepage />} />
                  <Route path="/admin/rankings" element={<AdminRankings />} />
                  <Route path="/admin/import" element={<ProductImport />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Order Routes */}
                  <Route path="/checkout" element={<CheckoutEnhanced />} />
                  <Route
                    path="/order-success/:orderId"
                    element={<OrderSuccess />}
                  />

                  {/* Authors and Publishers */}
                  <Route path="/authors" element={<AllAuthors />} />
                  <Route path="/author/:authorName" element={<AuthorBooks />} />
                  <Route
                    path="/author-profile/:id"
                    element={<AuthorProfile />}
                  />
                  <Route
                    path="/publisher/:publisherName"
                    element={<PublisherBooks />}
                  />
                  <Route
                    path="/publisher-profile/:id"
                    element={<PublisherProfile />}
                  />
                  <Route path="/publishers" element={<AllPublishers />} />

                  {/* Legacy routes for backward compatibility */}
                  <Route path="/authors/:id" element={<AuthorBooks />} />
                  <Route path="/publishers/:id" element={<PublisherBooks />} />

                  {/* Rankings */}
                  <Route
                    path="/rankings/:category"
                    element={<CategoryRankings />}
                  />

                  {/* Legal Pages */}
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />

                  {/* Placeholder routes for future implementation */}
                  <Route
                    path="/orders"
                    element={
                      <PlaceholderPage
                        title="My Orders"
                        description="Order history coming soon"
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PlaceholderPage
                        title="My Profile"
                        description="User profile management coming soon"
                      />
                    }
                  />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/returns" element={<RefundPolicy />} />
                  <Route
                    path="/faq"
                    element={
                      <PlaceholderPage
                        title="FAQ"
                        description="Frequently asked questions coming soon"
                      />
                    }
                  />
                  <Route
                    path="/track-order"
                    element={
                      <PlaceholderPage
                        title="Track Order"
                        description="ShipRocket tracking coming soon"
                      />
                    }
                  />
                  <Route
                    path="/track-order/:orderId"
                    element={
                      <PlaceholderPage
                        title="Track Order"
                        description="Order tracking coming soon"
                      />
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <PlaceholderPage
                        title="Privacy Policy"
                        description="Privacy policy coming soon"
                      />
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <PlaceholderPage
                        title="Terms of Service"
                        description="Terms and conditions coming soon"
                      />
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PlaceholderPage
                        title="Forgot Password"
                        description="Password reset coming soon"
                      />
                    }
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <MobileBottomNav />
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
          </AdminAuthProvider>
        </AppProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for future pages
function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-telugu-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-telugu-500 rounded-full"></div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Homepage
          </a>
          <div className="text-sm text-gray-500">
            <p>
              This feature will be available in the next phase of development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
