import TicketDetailPage from "./pages/shared/TicketDetailPage";
import OrdersPage from "./pages/shared/OrdersPage";
import CustomersPage from "./pages/shared/CustomersPage";
import ConversationsPage from "./pages/shared/ConversationsPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import TicketsPage from "./pages/shared/TicketsPage";
import AiChatPage from "./pages/shared/AiChatPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route element={<DashboardLayout />}>
                        {/* Core Features */}
                        <Route path="/chat" element={<AiChatPage />} />
                        <Route path="/tickets" element={<TicketsPage />} />
                        <Route path="/tickets/:id" element={<TicketDetailPage />} />

                        {/* Dashboards */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/agent" element={<AgentDashboard />} />

                        {/* Shared Pages */}
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/history" element={<ConversationsPage />} />
                    </Route>

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;