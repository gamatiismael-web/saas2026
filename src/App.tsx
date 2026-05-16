import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Audit } from './pages/Audit';
import { AuditResults } from './pages/AuditResults';

import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { AuthCallback } from './pages/auth/AuthCallback';
import { ResetPassword } from './pages/auth/ResetPassword';

import { Dashboard } from './pages/dashboard/Dashboard';
import { Analytics } from './pages/dashboard/Analytics';
import { SeoRankings } from './pages/dashboard/SeoRankings';
import { Reporting } from './pages/dashboard/Reporting';
import { DesignImprovements } from './pages/dashboard/DesignImprovements';
import { Performance } from './pages/dashboard/Performance';
import { Project } from './pages/dashboard/Project';
import { Billing } from './pages/dashboard/Billing';
import { Settings } from './pages/dashboard/Settings';
import { Messages } from './pages/dashboard/Messages';

import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/audit/results/:id" element={<AuditResults />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seo"
            element={
              <ProtectedRoute>
                <SeoRankings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reporting"
            element={
              <ProtectedRoute>
                <Reporting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/design"
            element={
              <ProtectedRoute>
                <DesignImprovements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/project"
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
