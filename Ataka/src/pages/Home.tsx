
import { useEffect } from 'react';
import HomeBanner from '@/components/home/HomeBanner';
import BookGrid from '@/components/books/BookGrid';
import CategorySection from '@/components/home/CategorySection';
import books from '@/data/books';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter books for different sections
  const featuredBooks = books.slice(0, 5);
  const newArrivals = [...books].sort(() => 0.5 - Math.random()).slice(0, 5);
  const bestSellers = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-6">
      <HomeBanner />
      
      <div className="space-y-12 mb-12">
        <BookGrid books={featuredBooks} title="Featured Books" />
        <CategorySection />
        <BookGrid books={newArrivals} title="New Arrivals" />
        <BookGrid books={bestSellers} title="Best Sellers" />
      </div>
    </div>
  );
};

export default Home;
