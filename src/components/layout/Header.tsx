import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
              className="text-2xl font-bold text-white tracking-tight"
            >
              Value<span className="text-blue-500">-</span>Connection
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signup">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Client Login</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-300" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" fullWidth>
                  Sign Up
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" fullWidth>
                  Client Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
