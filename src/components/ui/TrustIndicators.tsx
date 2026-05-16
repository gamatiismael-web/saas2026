import { Award, Shield, TrendingUp, Users } from 'lucide-react';

export function TrustIndicators() {
  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-10 h-10 text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">340+</div>
            <div className="text-sm text-gray-600">Businesses Served</div>
          </div>

          <div className="flex flex-col items-center">
            <TrendingUp className="w-10 h-10 text-green-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">£2.4M+</div>
            <div className="text-sm text-gray-600">Revenue Generated</div>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-10 h-10 text-yellow-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">127%</div>
            <div className="text-sm text-gray-600">Avg. Traffic Growth</div>
          </div>

          <div className="flex flex-col items-center">
            <Shield className="w-10 h-10 text-purple-600 mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-6">TRUSTED BY LEADING BUSINESSES</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">TechStart</div>
            <div className="text-2xl font-bold text-gray-400">Riverside</div>
            <div className="text-2xl font-bold text-gray-400">Urban Co.</div>
            <div className="text-2xl font-bold text-gray-400">Thompson & Associates</div>
            <div className="text-2xl font-bold text-gray-400">City Health</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">30-Day Money Back Guarantee</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Google Partner Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
