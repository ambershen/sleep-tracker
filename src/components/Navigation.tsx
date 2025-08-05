import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Lightbulb, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: Home,
    },
    {
      path: '/log',
      label: 'Log Sleep',
      icon: PlusCircle,
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      path: '/insights',
      label: 'Insights',
      icon: Lightbulb,
    },
  ];

  return (
    <nav className="bg-purple-300 text-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Moon className="h-8 w-8 text-purple-700" />
            <span className="text-xl font-bold">SleepTracker</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-purple-400 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'p-2 rounded-md transition-colors duration-200',
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-purple-400 hover:text-white'
                    )}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;