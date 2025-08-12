import React from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import { Moon, BarChart3, Lightbulb, User, Eye, LogIn, UserPlus, Clock, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Landing = () => {
  const { startDemo } = useDemo();

  const features = [
    {
      icon: Moon,
      title: 'Sleep Tracking',
      description: 'Log your sleep patterns with detailed bedtime, wake time, and quality ratings'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Statistics',
      description: 'Visualize your sleep trends with comprehensive charts and insights'
    },
    {
      icon: Lightbulb,
      title: 'Personalized Insights',
      description: 'Get tailored recommendations to improve your sleep quality'
    },
    {
      icon: User,
      title: 'Profile Management',
      description: 'Customize your experience with personal preferences and settings'
    }
  ];

  const stats = [
    { label: 'Average Sleep Quality', value: '8.2/10', icon: Star },
    { label: 'Optimal Sleep Duration', value: '7.5h', icon: Clock },
    { label: 'Sleep Consistency', value: '85%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-accent/10 rounded-full">
                <Moon className="h-16 w-16 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-primary-dark mb-6">
              Track Your Sleep,
              <br />
              <span className="text-accent">Transform Your Life</span>
            </h1>
            <p className="text-xl text-background-dark/70 mb-8 max-w-3xl mx-auto">
              Monitor your sleep patterns, analyze trends, and get personalized insights to improve your rest and overall well-being.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth/signup"
                className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg font-medium"
              >
                <UserPlus className="h-5 w-5" />
                <span>Get Started Free</span>
              </Link>
              
              <button
                onClick={startDemo}
                className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg font-medium"
              >
                <Eye className="h-5 w-5" />
                <span>Try Demo</span>
              </button>
              
              <Link
                to="/auth/signin"
                className="text-accent hover:text-accent/80 font-medium flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              Everything You Need for Better Sleep
            </h2>
            <p className="text-lg text-background-dark/70 max-w-2xl mx-auto">
              Comprehensive sleep tracking tools designed to help you understand and improve your sleep patterns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-background-dark/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              See Your Progress
            </h2>
            <p className="text-lg text-background-dark/70">
              Track meaningful metrics that matter for your sleep health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-primary-dark mb-2">
                    {stat.value}
                  </div>
                  <div className="text-background-dark/70">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Improve Your Sleep?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of users who have transformed their sleep habits with our comprehensive tracking platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/signup"
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Start Your Journey</span>
            </Link>
            
            <button
              onClick={startDemo}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="h-5 w-5" />
              <span>Explore Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;