
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for cannot be found.</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page might have been moved, deleted, or never existed.
        Let's get you back to exploring Telugu literature.
      </p>
      <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary-light">
        Return to Homepage
      </Button>
    </div>
  );
};

export default NotFound;
