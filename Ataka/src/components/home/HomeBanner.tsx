
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "New Telugu Releases",
    description: "Discover the latest Telugu literature from renowned authors",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    link: "/new-arrivals"
  },
  {
    id: 2,
    title: "Classic Telugu Literature",
    description: "Explore timeless classics from legendary Telugu authors",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    link: "/categories/classics"
  },
  {
    id: 3,
    title: "Special Discounts",
    description: "Up to 40% off on selected Telugu books this week",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    link: "/sale"
  }
];

const HomeBanner = () => {
  return (
    <div className="w-full mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[200px] md:h-[400px] w-full overflow-hidden rounded-lg">
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="text-white px-6 md:px-12 max-w-md">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold mb-2 md:mb-4">{banner.title}</h2>
                    <p className="text-sm md:text-base mb-4 md:mb-6 text-gray-100">{banner.description}</p>
                    <Button asChild variant="outline" className="border-white text-white hover:bg-white/20">
                      <Link to={banner.link}>Explore Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default HomeBanner;
