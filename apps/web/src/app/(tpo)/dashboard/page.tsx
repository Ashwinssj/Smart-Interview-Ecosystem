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
  Building2, Briefcase, FileText, Users, TrendingUp, 
  BarChart2, Settings, LogOut, Plus, Search, Filter,
  ChevronDown, MoreHorizontal, Edit, Trash2, Eye,
  ArrowRight, Download, Upload, Calendar, Clock,
  CheckCircle, AlertCircle, XCircle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockDrives = [
  { id: "1", company: "Microsoft", role: "SDE Intern", type: "internship", ctc: "₹45 LPA", deadline: "2024-02-15", status: "published", applications: 142, shortlisted: 45, testsCompleted: 38, interviewsDone: 22, forwarded: 15, placed: 8 },
  { id: "2", company: "Amazon", role: "SDE Intern", type: "internship", ctc: "₹44 LPA", deadline: "2024-02-20", status: "published", applications: 98, shortlisted: 32, testsCompleted: 28, interviewsDone: 18, forwarded: 12, placed: 5 },
  { id: "3", company: "Google", role: "Software Engineering Intern", type: "internship", ctc: "₹50 LPA", deadline: "2024-02-25", status: "published", applications: 205, shortlisted: 56, testsCompleted: 48, interviewsDone: 35, forwarded: 22, placed: 12 },
  { id: "4", company: "Flipkart", role: "Backend Developer", type: "full_time", ctc: "₹38 LPA", deadline: "2024-03-01", status: "draft", applications: 0, shortlisted: 0, testsCompleted: 0, interviewsDone: 0, forwarded: 0, placed: 0 },
  { id: "5", company: "Uber", role: "Frontend Intern", type: "internship", ctc: "₹42 LPA", deadline: "2024-03-10", status: "closed", applications: 67, shortlisted: 21, testsCompleted: 19, interviewsDone: 12, forwarded: 8, placed: 3 },
];

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, color: "slate" },
  published: { label: "Published", variant: "default" as const, color: "sky" },
  closed: { label: "Closed", variant: "warning" as const, color: "amber" },
  completed: { label: "Completed", variant: "success" as const, color: "emerald" },
};

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function TPODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigation = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "drives", label: "Placement Drives", icon: Briefcase },
    { key: "applications", label: "Applications", icon: FileText },
    { key: "tests", label: "Assessments", icon: Building2 },
    { key: "interviews", label: "AI Interviews", icon: Users },
    { key: "reports", label: "Reports", icon: TrendingUp },
    { key: "notifications", label: "Notifications", icon: Settings },
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
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-xl text-slate-950">TPO Portal</span>
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
              <Building2 className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 lg:hidden">
              <h1 className="text-lg font-semibold text-slate-950">
                {navigation.find(n => n.key === activeTab)?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Drive
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
              {activeTab === "drives" && <DrivesTab drives={mockDrives} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
              {activeTab === "applications" && <ApplicationsTab />}
              {activeTab === "tests" && <TestsTab />}
              {activeTab === "interviews" && <InterviewsTab />}
              {activeTab === "reports" && <ReportsTab />}
              {activeTab === "notifications" && <NotificationsTab />}
            </div>
          </div>

          <div className="lg:hidden">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "drives" && <DrivesTab drives={mockDrives} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
            {activeTab === "applications" && <ApplicationsTab />}
            {activeTab === "tests" && <TestsTab />}
            {activeTab === "interviews" && <InterviewsTab />}
            {activeTab === "reports" && <ReportsTab />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { title: "Total Students", value: "1,247", icon: Users, trend: "+23 this month", trendColor: "emerald" },
    { title: "Active Drives", value: "8", icon: Briefcase, trend: "3 new this week", trendColor: "sky" },
    { title: "Applications", value: "512", icon: FileText, trend: "12% increase", trendColor: "purple" },
    { title: "Placed", value: "28", icon: CheckCircle, trend: "5 this week", trendColor: "emerald" },
  ];

  const pipelineData = [
    { stage: "Applied", count: 512, color: "slate" },
    { stage: "Screened", count: 234, color: "sky" },
    { stage: "Tested", count: 167, color: "purple" },
    { stage: "Interviewed", count: 89, color: "amber" },
    { stage: "Forwarded", count: 45, color: "emerald" },
    { stage: "Placed", count: 28, color: "emerald" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">TPO Dashboard</h1>
          <p className="text-slate-600 mt-1">Placement management overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
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

      {/* Pipeline Funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Placement Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData.map((stage, i) => {
                const maxCount = pipelineData[0].count;
                const width = (stage.count / maxCount) * 100;
                return (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-700">{stage.stage}</span>
                      <span className="font-bold text-slate-950 tabular-nums">{stage.count}</span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${width}%`,
                          backgroundColor: `hsl(var(--${stage.color}-500))` 
                        }}
                      />
                    </div>
                    {i < pipelineData.length - 1 && (
                      <div className="text-right text-xs text-slate-500 mt-1">
                        {Math.round((stage.count / pipelineData[i + 1].count) * 100)}% conversion
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem icon={Plus} color="sky" title="New drive created: Microsoft SDE Intern" time="2 hours ago" />
              <ActivityItem icon={CheckCircle} color="emerald" title="15 students shortlisted for Amazon drive" time="5 hours ago" />
              <ActivityItem icon={FileText} color="purple" title="Aptitude test completed for Google drive" time="1 day ago" />
              <ActivityItem icon={Users} color="amber" title="AI interviews started for 12 candidates" time="1 day ago" />
              <ActivityItem icon={Trash2} color="red" title="Flipkart drive moved to draft" time="2 days ago" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionBtn icon={Plus} label="Create Drive" color="sky" />
            <QuickActionBtn icon={Upload} label="Import Students" color="emerald" />
            <QuickActionBtn icon={Building2} label="Schedule Tests" color="purple" />
            <QuickActionBtn icon={Download} label="Generate Report" color="amber" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DrivesTab({ drives, searchQuery, setSearchQuery, statusFilter, setStatusFilter }: any) {
  const filteredDrives = drives.filter((drive: any) => {
    const matchesSearch = drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || drive.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Placement Drives</h1>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Drive
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
                placeholder="Search drives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drives Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">CTC</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Applications</TableHead>
                <TableHead className="hidden xl:table-cell">Shortlisted</TableHead>
                <TableHead className="hidden xl:table-cell">Forwarded</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrives.map((drive: any) => (
                <TableRow key={drive.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-sky-600" />
                      </div>
                      {drive.company}
                    </div>
                  </TableCell>
                  <TableCell>{drive.role}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{drive.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono">{drive.ctc}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-500">
                    {new Date(drive.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell><StatusBadge status={drive.status} /></TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-slate-600">{drive.applications}</TableCell>
                  <TableCell className="hidden xl:table-cell tabular-nums text-slate-600">{drive.shortlisted}</TableCell>
                  <TableCell className="hidden xl:table-cell tabular-nums text-slate-600">{drive.forwarded}</TableCell>
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

function ApplicationsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">Applications</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Applications management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function TestsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Assessments</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Create Test
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Test builder coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function InterviewsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">AI Interviews</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Interview monitoring coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">Reports & Analytics</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Drive Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Detailed analytics for each placement drive</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Individual and cohort-level preparation tracking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Notifications</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Send Notification
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center py-8">Notification center coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityItem({ icon: Icon, color, title, time }: { icon: any; color: string; title: string; time: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", `${color}-100 text-${color}-600`)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-950 truncate">{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
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