"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Users, Briefcase, BarChart2, Settings, 
  LogOut, Plus, Search, Filter, ChevronDown,
  MoreHorizontal, Edit, Trash2, Eye, Shield,
  Activity, Database, Server, Bell, Download,
  UserPlus, UserCheck, UserX, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "1", name: "Priya Sharma", email: "priya@student.nit.ac.in", role: "student", college: "NIT Trichy", status: "active", lastActive: "2024-02-10" },
  { id: "2", name: "Rahul Kumar", email: "rahul@student.iitb.ac.in", role: "student", college: "IIT Bombay", status: "active", lastActive: "2024-02-10" },
  { id: "3", name: "Prof. S. Reddy", email: "reddy@nit.ac.in", role: "tpo", college: "NIT Trichy", status: "active", lastActive: "2024-02-09" },
  { id: "4", name: "Dr. A. Patel", email: "patel@iitb.ac.in", role: "tpo", college: "IIT Bombay", status: "inactive", lastActive: "2024-01-20" },
  { id: "5", name: "Admin User", email: "admin@smartinterview.com", role: "admin", college: "System", status: "active", lastActive: "2024-02-10" },
];

const roleConfig = {
  student: { label: "Student", icon: GraduationCap, color: "sky" },
  tpo: { label: "TPO", icon: Building2, color: "emerald" },
  admin: { label: "Admin", icon: Shield, color: "amber" },
};

function RoleBadge({ role }: { role: keyof typeof roleConfig }) {
  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("gap-1.5", `border-${config.color}-500 text-${config.color}-600`)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  pending: { label: "Pending", variant: "warning" as const },
};

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigation = [
    { key: "overview", label: "System Overview", icon: BarChart2 },
    { key: "users", label: "User Management", icon: Users },
    { key: "colleges", label: "Colleges", icon: Building2 },
    { key: "drives", label: "All Drives", icon: Briefcase },
    { key: "skills", label: "Skills Taxonomy", icon: Activity },
    { key: "ai-config", label: "AI Configuration", icon: Server },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "reports", label: "System Reports", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-xl text-slate-950">Admin Portal</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button 
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === item.key 
                    ? "bg-sky-50 text-sky-600" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
            <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Shield className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 lg:hidden">
              <h1 className="text-lg font-semibold text-slate-950">
                {navigation.find(n => n.key === activeTab)?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="hidden lg:flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                      activeTab === item.key 
                        ? "bg-sky-50 text-sky-600" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-slate-200">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-8">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "users" && <UsersTab users={mockUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
              {activeTab === "colleges" && <CollegesTab />}
              {activeTab === "drives" && <AllDrivesTab />}
              {activeTab === "skills" && <SkillsTab />}
              {activeTab === "ai-config" && <AIConfigTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "reports" && <ReportsTab />}
            </div>
          </div>

          <div className="lg:hidden">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "users" && <UsersTab users={mockUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
            {activeTab === "colleges" && <CollegesTab />}
            {activeTab === "drives" && <AllDrivesTab />}
            {activeTab === "skills" && <SkillsTab />}
            {activeTab === "ai-config" && <AIConfigTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "reports" && <ReportsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { title: "Total Users", value: "2,847", icon: Users, trend: "+156 this month", trendColor: "sky" },
    { title: "Students", value: "2,512", icon: GraduationCap, trend: "+142 this month", trendColor: "emerald" },
    { key: "tpos", title: "TPOs", value: "124", icon: Building2, trend: "+8 this month", trendColor: "purple" },
    { key: "admins", title: "Admins", value: "11", icon: Shield, trend: "No change", trendColor: "amber" },
    { key: "drives", title: "Total Drives", value: "47", icon: Briefcase, trend: "+12 this quarter", trendColor: "sky" },
    { key: "activeDrives", title: "Active Drives", value: "23", icon: Activity, trend: "5 new this week", trendColor: "emerald" },
    { key: "applications", title: "Applications", value: "8,934", icon: FileText, trend: "23% increase YoY", trendColor: "purple" },
    { key: "placementRate", title: "Placement Rate", value: "67%", icon: TrendingUp, trend: "+5% vs last year", trendColor: "emerald" },
  ];

  const recentActivity = [
    { icon: UserPlus, color: "emerald", title: "New student registered: Priya Sharma (NIT Trichy)", time: "5 min ago" },
    { icon: UserPlus, color: "sky", title: "New TPO registered: Prof. A. Kumar (IIT Delhi)", time: "12 min ago" },
    { icon: Building2, color: "purple", title: "New college added: BITS Pilani", time: "1 hour ago" },
    { icon: Briefcase, color: "amber", title: "Drive published: Microsoft SDE Intern", time: "2 hours ago" },
    { icon: Shield, color: "red", title: "AI config updated: interview threshold changed to 60%", time: "3 hours ago" },
    { icon: Database, color: "slate", title: "Database backup completed successfully", time: "6 hours ago" },
  ];

  const systemHealth = [
    { name: "API Latency", value: "42ms", status: "healthy", trend: "-5ms" },
    { name: "Database CPU", value: "23%", status: "healthy", trend: "+2%" },
    { name: "Storage Used", value: "1.2 TB / 5 TB", status: "healthy", trend: "+45 GB" },
    { name: "Active Sessions", value: "342", status: "healthy", trend: "+28" },
    { name: "Error Rate", value: "0.02%", status: "healthy", trend: "-0.01%" },
    { name: "HeyGen API", value: "Operational", status: "healthy", trend: "99.9% uptime" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">System Overview</h1>
          <p className="text-slate-600 mt-1">Platform-wide analytics and health monitoring</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-950 tabular-nums">{stat.value}</p>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", `${stat.trendColor}-100 text-${stat.trendColor}-600`)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className={cn("mt-3 text-xs font-medium", `text-${stat.trendColor}-600`)}>{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", item.status === "healthy" ? "bg-emerald-500" : "bg-red-500")} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-slate-950">{item.value}</p>
                    <p className="text-xs text-emerald-600">{item.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", `${activity.color}-100 text-${activity.color}-600`)}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-950 truncate">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionBtn icon={UserPlus} label="Create User" color="sky" />
            <QuickActionBtn icon={Building2} label="Add College" color="emerald" />
            <QuickActionBtn icon={Activity} label="Manage Skills" color="purple" />
            <QuickActionBtn icon={Server} label="AI Settings" color="amber" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab({ users, searchQuery, setSearchQuery, roleFilter, setRoleFilter, statusFilter, setStatusFilter }: any) {
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">User Management</h1>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create User
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tpo">TPO</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-950">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell className="text-slate-600">{user.college}</TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(user.lastActive).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CollegesTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Colleges</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add College
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">College management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AllDrivesTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">All Placement Drives</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Global drive overview coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Skills Taxonomy</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Skills taxonomy management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AIConfigTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">AI Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Global AI Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Resume Screening Threshold</label>
              <div className="flex items-center gap-4">
                <Input type="range" min="0" max="100" defaultValue={50} className="flex-1" />
                <span className="text-lg font-bold text-sky-600 w-16 text-right">50%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum compatibility score to proceed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Re-screen Attempts</label>
              <Select defaultValue="2">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Max Questions</label>
              <Input type="number" defaultValue={15} min="5" max="30" className="w-32" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Time Limit (minutes)</label>
              <Input type="number" defaultValue={30} min="10" max="60" className="w-32" />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-950 mb-4">Model Configuration</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">LLM Model</label>
                <Select defaultValue="gpt-4o">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Embedding Model</label>
                <Select defaultValue="text-embedding-3-large">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                    <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">TTS Voice</label>
                <Select defaultValue="nova">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nova">Nova</SelectItem>
                    <SelectItem value="alloy">Alloy</SelectItem>
                    <SelectItem value="echo">Echo</SelectItem>
                    <SelectItem value="fable">Fable</SelectItem>
                    <SelectItem value="onyx">Onyx</SelectItem>
                    <SelectItem value="shimmer">Shimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-950 mb-4">System Prompts</h3>
            <Tabs defaultValue="interview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="interview">Interview Prompt</TabsTrigger>
                <TabsTrigger value="feedback">Feedback Prompt</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap Prompt</TabsTrigger>
              </TabsList>
              <TabsContent value="interview">
                <Textarea placeholder="Interview system prompt..." className="min-h-[150px] font-mono text-sm" defaultValue="You are an expert technical interviewer conducting a mock interview for a {{role}} position at {{company}}..." />
              </TabsContent>
              <TabsContent value="feedback">
                <Textarea placeholder="Feedback system prompt..." className="min-h-[150px] font-mono text-sm" defaultValue="You are an expert interview evaluator. Analyze the interview transcript and provide scores..." />
              </TabsContent>
              <TabsContent value="roadmap">
                <Textarea placeholder="Roadmap system prompt..." className="min-h-[150px] font-mono text-sm" defaultValue="You are a career coach. Based on the interview weaknesses: {{weaknesses}}, create a 4-week preparation roadmap..." />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">System Notifications</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Send Notification
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Notification management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">System Reports</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReportCard title="User Growth" description="Monthly active users and registration trends" icon={Users} />
        <ReportCard title="Drive Analytics" description="Placement drive performance across colleges" icon={Briefcase} />
        <ReportCard title="Interview Metrics" description="AI interview completion and score distributions" icon={Activity} />
        <ReportCard title="System Performance" description="API latency, error rates, and uptime" icon={Server} />
        <ReportCard title="Placement Outcomes" description="Final placement statistics and trends" icon={TrendingUp} />
        <ReportCard title="Revenue & Billing" description="Subscription and usage analytics" icon={Download} />
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <Card className="hover:shadow-[0_4px_20px_-4px_rgba(15,23,42,0.1)] transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-sky-600" />
        </div>
        <h3 className="font-semibold text-slate-950 mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionBtn({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <Button variant="outline" className="gap-2 justify-start">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
}

// Need to import Textarea
import { Textarea } from "@/components/ui/textarea";