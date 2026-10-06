import TicketDetailPage from "./pages/shared/TicketDetailPage";
import ConversationDetailPage from "./pages/shared/ConversationDetailPage";
import OrdersPage from "./pages/shared/OrdersPage";
import CustomersPage from "./pages/shared/CustomersPage";
import ConversationsPage from "./pages/shared/ConversationsPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import UsersPage from "./pages/admin/UsersPage";
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
                        {/* Customer AI Chat */}
                        <Route
                            path="/chat"
                            element={<AiChatPage />}
                        />

                        {/* Tickets */}
                        <Route
                            path="/tickets"
                            element={<TicketsPage />}
                        />

                        <Route
                            path="/tickets/:id"
                            element={<TicketDetailPage />}
                        />

                        {/* Dashboards */}
                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/agent"
                            element={<AgentDashboard />}
                        />

                        {/* Agents */}
                        <Route
                            path="/users"
                            element={<UsersPage />}
                        />

                        {/* Orders */}
                        <Route
                            path="/orders"
                            element={<OrdersPage />}
                        />

                        {/* Customers */}
                        <Route
                            path="/customers"
                            element={<CustomersPage />}
                        />

                        {/* Conversation History */}
                        <Route
                            path="/history"
                            element={<ConversationsPage />}
                        />

                        <Route
                            path="/history/:id"
                            element={<ConversationDetailPage />}
                        />
                    </Route>

                    {/* Fallback */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;