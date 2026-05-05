import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, ChefHat, Utensils, Flag, Trash2, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/");
    } else {
      fetchAdminData();
    }
  }, [navigate, userInfo]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/reports"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchAdminData(); // Refresh list
      } catch (error: any) {
        alert(error?.response?.data?.message || "Error deleting user");
      }
    }
  };

  const resolveReportHandler = async (id: string) => {
    try {
      await api.put(`/admin/reports/${id}`, { status: "resolved" });
      fetchAdminData(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers || 0, sub: "Registered accounts", color: "text-blue-500" },
    { icon: ChefHat, label: "Active Chefs", value: stats.totalChefs || 0, sub: "Verified creators", color: "text-green-500" },
    { icon: Utensils, label: "Total Recipes", value: stats.totalRecipes || 0, sub: "Published dishes", color: "text-orange-500" },
    { icon: Flag, label: "Pending Reports", value: stats.activeReports || 0, sub: "Requires attention", color: "text-destructive" },
  ];

  // Mock data for charts since backend might not provide timeseries data yet
  const barData = [
    { name: "Breakfast", views: 2400 },
    { name: "Lunch", views: 1800 },
    { name: "Dinner", views: 3200 },
    { name: "Desserts", views: 1500 },
    { name: "Vegan", views: 1100 },
  ];

  const lineData = [
    { month: "Jan", users: 150 },
    { month: "Feb", users: 230 },
    { month: "Mar", users: 340 },
    { month: "Apr", users: 450 },
    { month: "May", users: stats.totalUsers || 500 },
  ];

  if (!userInfo || userInfo.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="admin" />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
           <h1 className="section-title">Admin Dashboard</h1>
           <button onClick={fetchAdminData} className="btn-outline-golden text-sm">Refresh Data</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="stat-card flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground relative z-10">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 relative z-10">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-elevated flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-foreground font-display text-lg">User Directory</h3>
                   <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">{users.length} Users</span>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px]">
                  <table className="w-full text-sm text-left">
                     <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0">
                        <tr>
                           <th className="px-4 py-3 rounded-tl-lg">User</th>
                           <th className="px-4 py-3">Role</th>
                           <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                             <td className="px-4 py-3">
                                <p className="font-medium text-foreground">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                             </td>
                             <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  u.role === 'admin' ? 'bg-destructive/10 text-destructive' : 
                                  u.role === 'chef' ? 'bg-green-100 text-green-700' : 'bg-secondary text-foreground'
                                }`}>
                                   {u.role}
                                </span>
                             </td>
                             <td className="px-4 py-3 text-right">
                                {u.role !== 'admin' && (
                                  <button 
                                    onClick={() => deleteUserHandler(u._id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors inline-flex"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
              </div>

              <div className="card-elevated flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-foreground font-display text-lg">Moderation Queue</h3>
                   <span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-1 rounded">{reports.filter(r => r.status === 'pending').length} Pending</span>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px]">
                  {reports.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                        <CheckCircle2 className="h-12 w-12 mb-2 text-green-500 opacity-50" />
                        <p>All caught up! No reports.</p>
                     </div>
                  ) : (
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0">
                          <tr>
                             <th className="px-4 py-3 rounded-tl-lg">Target</th>
                             <th className="px-4 py-3">Reason</th>
                             <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {reports.map((m) => (
                            <tr key={m._id} className="hover:bg-muted/30 transition-colors">
                               <td className="px-4 py-3">
                                  <p className="font-medium text-foreground capitalize">{m.targetType}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</p>
                               </td>
                               <td className="px-4 py-3 text-muted-foreground">{m.reason}</td>
                               <td className="px-4 py-3 text-right">
                                  {m.status === 'pending' ? (
                                    <button 
                                      onClick={() => resolveReportHandler(m._id)}
                                      className="text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded transition-colors"
                                    >
                                      Resolve
                                    </button>
                                  ) : (
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium flex items-center justify-end gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Resolved
                                    </span>
                                  )}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics */}
            <h2 className="section-title pt-4">Application Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-elevated">
                <h3 className="font-bold text-foreground mb-6 font-display">Popular Categories</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card-elevated">
                <h3 className="font-bold text-foreground mb-6 font-display">User Growth Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
