
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Fiction',
    image: 'https://images.unsplash.com/photo-1479660095429-2cf4e1360472?q=80&w=400&auto=format&fit=crop',
    slug: 'fiction'
  },
  {
    id: '2',
    name: 'Poetry',
    image: 'https://images.unsplash.com/photo-1530906358563-7fd69bfdb082?q=80&w=400&auto=format&fit=crop',
    slug: 'poetry'
  },
  {
    id: '3',
    name: 'Classics',
    image: 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?q=80&w=400&auto=format&fit=crop',
    slug: 'classics'
  },
  {
    id: '4',
    name: 'Children',
    image: 'https://images.unsplash.com/photo-1512199794875-de50c4234ad5?q=80&w=400&auto=format&fit=crop',
    slug: 'children'
  }
];

const CategorySection = () => {
  return (
    <div className="my-12">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <Link 
            to={`/categories/${category.slug}`} 
            key={category.id}
            className="group relative h-40 md:h-64 rounded-lg overflow-hidden"
          >
            <img 
              src={category.image} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <h3 className="text-white font-medium text-lg md:text-xl">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
