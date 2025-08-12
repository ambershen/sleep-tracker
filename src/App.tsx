import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import SleepLog from "@/pages/SleepLog";
import Statistics from "@/pages/Statistics";
import Insights from "@/pages/Insights";
import Profile from "@/pages/Profile";
import Landing from "@/pages/Landing";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import EmailVerify from "@/pages/auth/EmailVerify";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DemoProvider>
          <div className="min-h-screen bg-background-light">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Authentication Routes - Only accessible when NOT authenticated */}
            <Route 
              path="/auth/signin" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignIn />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignUp />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/forgot-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/reset-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/verify" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <EmailVerify />
                </ProtectedRoute>
              } 
            />
            
            {/* Home Route - No authentication required */}
            <Route 
              path="/home" 
              element={
                <>
                  <Navigation />
                  <Home />
                </>
              } 
            />
            
            {/* Demo Routes - No authentication required */}
            <Route 
              path="/demo" 
              element={
                <>
                  <Navigation />
                  <Dashboard />
                </>
              } 
            />
            <Route 
              path="/demo/log" 
              element={
                <>
                  <Navigation />
                  <SleepLog />
                </>
              } 
            />
            <Route 
              path="/demo/statistics" 
              element={
                <>
                  <Navigation />
                  <Statistics />
                </>
              } 
            />
            <Route 
              path="/demo/insights" 
              element={
                <>
                  <Navigation />
                  <Insights />
                </>
              } 
            />
            
            {/* Main App Routes - Require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/log" 
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <SleepLog />
                  </>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Statistics />
                  </>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Insights />
                  </>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Profile />
                  </>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" richColors />
          </div>
        </DemoProvider>
      </AuthProvider>
    </Router>
  );
}
