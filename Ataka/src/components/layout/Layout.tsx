
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNavbar from './MobileNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      <MobileNavbar />
      <Footer />
    </div>
  );
};

export default Layout;
