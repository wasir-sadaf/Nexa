import OrdersPage from "./pages/shared/OrdersPage";
import CustomersPage from "./pages/shared/CustomersPage";
import ConversationsPage from "./pages/shared/ConversationsPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import CustomerChat from "./pages/customer/CustomerChat";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import TicketsPage from "./pages/shared/TicketsPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route element={<DashboardLayout />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/agent" element={<AgentDashboard />} />
                        <Route path="/chat" element={<CustomerChat />} />

                        {/* 👇 Add the new routes 👇 */}
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/tickets" element={<TicketsPage />} />

                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/history" element={<ConversationsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;