import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Lightbulb, Moon, User, LogOut, Settings, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isDemoMode, startDemo, exitDemo } = useDemo();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const authenticatedNavItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      path: '/log',
      label: 'Log Sleep',
      icon: PlusCircle,
    },
    {
      path: '/statistics',
      label: 'Statistics',
      icon: BarChart3,
    },
    {
      path: '/insights',
      label: 'Insights',
      icon: Lightbulb,
    },
  ];

  const demoNavItems = [
    {
      path: '/demo',
      label: 'Dashboard',
      icon: Home,
    },
    {
      path: '/demo/log',
      label: 'Log Sleep',
      icon: PlusCircle,
    },
    {
      path: '/demo/statistics',
      label: 'Statistics',
      icon: BarChart3,
    },
    {
      path: '/demo/insights',
      label: 'Insights',
      icon: Lightbulb,
    },
  ];

  const publicNavItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
    },
  ];

  const navItems = user ? authenticatedNavItems : (isDemoMode ? demoNavItems : publicNavItems);

  return (
    <nav className="nav-header shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Moon className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-white">SleepTracker</span>
            {isDemoMode && (
              <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                Demo Mode
              </span>
            )}
          </Link>

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
                        ? 'bg-accent text-white'
                        : 'text-white/80 hover:bg-primary-700 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu / Auth Links */}
          <div className="hidden md:block relative">
            {isDemoMode ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={exitDemo}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  Exit Demo
                </button>
                <Link
                  to="/auth/signup"
                  className="btn-accent"
                >
                  Sign Up
                </Link>
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name || user?.email}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={startDemo}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                  <span>Try Demo</span>
                </button>
                <Link
                  to="/auth/signin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="btn-accent"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <div className="flex items-center space-x-1">
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
                        ? 'bg-accent text-white'
                        : 'text-white/80 hover:bg-primary-700 hover:text-white'
                    )}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
              
              {/* Mobile User Menu / Auth */}
              {isDemoMode ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={exitDemo}
                    className="p-2 rounded-md text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200 text-xs"
                    title="Exit Demo"
                  >
                    Exit
                  </button>
                  <Link
                    to="/auth/signup"
                    className="p-2 rounded-md bg-accent text-white hover:bg-accent-600 transition-colors duration-200 text-xs"
                    title="Sign Up"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-md text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                    title="User Menu"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  
                  {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-gray-500 truncate">{user?.email}</div>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={startDemo}
                    className="p-2 rounded-md text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200"
                    title="Try Demo"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <Link
                    to="/auth/signin"
                    className="p-2 rounded-md text-white/80 hover:bg-primary-700 hover:text-white transition-colors duration-200 text-xs"
                    title="Sign In"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="p-2 rounded-md bg-accent text-white hover:bg-accent-600 transition-colors duration-200 text-xs"
                    title="Sign Up"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;