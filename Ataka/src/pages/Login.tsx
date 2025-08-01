
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminDemo, setIsAdminDemo] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Get the intended destination from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      // Check if user is admin and redirect accordingly
      if (user?.email === 'admin@ataka.com') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(form.email, form.password);
      toast({
        title: 'Login successful',
        description: 'Welcome back to ATAKA Bookstore!',
      });
      
      // Navigation happens in the useEffect
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your email and password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useAdminCredentials = () => {
    setForm({
      email: 'admin@ataka.com',
      password: 'admin123'
    });
    setIsAdminDemo(true);
    
    toast({
      title: 'Admin credentials loaded',
      description: 'Click "Sign in" to log in as admin.',
    });
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to ATAKA</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="text-sm text-right">
            <Link to="/forgot-password" className="text-primary hover:text-primary/80">
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className={`w-full ${isAdminDemo ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : (
              <>
                {isAdminDemo && <ShieldCheck className="mr-2 h-4 w-4" />}
                {isAdminDemo ? 'Sign in as Admin' : 'Sign in'}
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Login as Admin for testing */}
        <div className="border-t pt-4 mt-8">
          <p className="text-center text-sm text-gray-500 mb-2">Demo Admin Login</p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={useAdminCredentials}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Use Demo Admin Credentials
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
