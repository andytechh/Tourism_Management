import { useState, useEffect } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Waves, Fish, Anchor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [isMounted, setIsMounted] = useState(false);

  // Use Inertia's useForm for Laravel integration
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => {
      reset(); // Clean up form on unmount
    };
  }, [reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to Laravel's /login route
    post('/login', {
      preserveScroll: true,
      onError: (errors) => {
        console.error('Login errors:', errors);
      }
    });
  };

  // Only render after mount to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <>
    <Head title="Donsol Tourism Management System - Login" />

    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 text-white/10"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Waves className="w-32 h-32" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-20 text-white/10"
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Fish className="w-24 h-24" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/4 text-white/10"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <Anchor className="w-28 h-28" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div
                className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Fish className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Donsol TMS</h1>
              <p className="text-xl text-white">Tourism Management System</p>
            </div>
            
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-4">
                Discover the Whale Shark Capital
              </h2>
              <p className="text-white leading-relaxed">
                Experience the majestic whale sharks of Donsol, Sorsogon. 
                Manage your tours, bookings, and explore the beautiful 
                destinations of the Philippines.
              </p>
            </div>

            <div className="mt-12 flex gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">500+</div>
                <div className="text-sm text-primary/70">Tours Completed</div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">10k+</div>
                <div className="text-sm text-primary/70">Happy Tourists</div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-primary/70">Destinations</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4">
              <Fish className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Donsol TMS
            </h1>
          </div>
      <div className="text-center mb-4">
            <Link 
                href="/" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
            </Link>
            </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-primary transition-colors"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-primary transition-colors"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData('remember', checked as boolean)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-border hover:bg-muted/50 transition-colors"
                disabled
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 border-border hover:bg-muted/50 transition-colors"
                disabled
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
   </>
  );
}