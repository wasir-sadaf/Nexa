import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
import CustomerChat from "./pages/customer/CustomerChat";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
    return (
        <Router>
            <Routes>
                {/* Standalone Routes (No Sidebar) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Dashboard Routes (Wrapped in Sidebar Layout) */}
                <Route element={<DashboardLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/agent" element={<AgentDashboard />} />

                    {/* 👇 This is the exact line that changed 👇 */}
                    <Route path="/chat" element={<CustomerChat />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;