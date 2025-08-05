import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import SleepLog from "@/pages/SleepLog";
import Analytics from "@/pages/Analytics";
import Insights from "@/pages/Insights";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-purple-100/50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<SleepLog />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}
