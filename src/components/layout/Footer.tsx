import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
                className="text-xl font-bold text-white"
              >
                Value<span className="text-blue-500">-</span>Connection
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Simple website performance tracking helping small businesses understand and grow their online presence.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">Website Design</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">SEO Optimisation</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Ongoing Management</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Performance Monitoring</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:gamati.ismael@gmail.com" className="hover:text-white transition-colors">
                  gamati.ismael@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:07983485102" className="hover:text-white transition-colors">
                  07983 485102
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-8 pt-8 text-sm text-gray-600 text-center">
          <p>&copy; {new Date().getFullYear()} Value-Connection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
