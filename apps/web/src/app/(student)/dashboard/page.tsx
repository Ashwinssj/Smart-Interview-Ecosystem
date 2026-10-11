"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Building2, Briefcase, FileText, Bot, 
  Target, TrendingUp, Calendar, Clock, 
  ArrowRight, CheckCircle, AlertCircle,
  BarChart2, Users, Settings, LogOut,
  Menu, X, Bell, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockApplications = [
  { id: "1", company: "Microsoft", role: "SDE Intern", ctc: "₹45 LPA", status: "ai_interview", progress: 4, deadline: "2024-02-15" },
  { id: "2", company: "Amazon", role: "SDE Intern", ctc: "₹44 LPA", status: "shortlisted", progress: 3, deadline: "2024-02-20" },
  { id: "3", company: "Google", role: "Software Engineering Intern", ctc: "₹50 LPA", status: "test", progress: 2, deadline: "2024-02-25" },
  { id: "4", company: "Flipkart", role: "Backend Developer", ctc: "₹38 LPA", status: "resume_screening", progress: 2, deadline: "2024-03-01" },
  { id: "5", company: "Uber", role: "Frontend Intern", ctc: "₹42 LPA", status: "applied", progress: 1, deadline: "2024-03-10" },
];

const mockUpcomingTests = [
  { id: "1", title: "Quantitative Aptitude Test", type: "aptitude", date: "2024-02-10", duration: 60, status: "upcoming" },
  { id: "2", title: "Technical Assessment - DSA", type: "technical", date: "2024-02-12", duration: 90, status: "upcoming" },
];

const mockRoadmap = [
  { week: 1, focus: ["OOP Concepts", "SQL Basics", "Aptitude"], completed: true },
  { week: 2, focus: ["Data Structures", "DBMS", "Technical MCQs"], completed: false },
  { week: 3, focus: ["Resume Polish", "Project Explanations", "HR Prep"], completed: false },
  { week: 4, focus: ["Mock Interviews", "Full Simulation", "Company Research"], completed: false },
];

const statusConfig = {
  open: { label: "Open", variant: "outline" as const, icon: Briefcase },
  applied: { label: "Applied", variant: "secondary" as const, icon: FileText },
  resume_screening: { label: "Resume Screening", variant: "warning" as const, icon: Bot },
  shortlisted: { label: "Shortlisted", variant: "success" as const, icon: CheckCircle },
  test: { label: "Test Scheduled", variant: "info" as const, icon: Target },
  ai_interview: { label: "AI Interview", variant: "default" as const, icon: Bot },
  company_process: { label: "Company Process", variant: "default" as const, icon: Building2 },
  selected: { label: "Selected", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: AlertCircle },
  needs_improvement: { label: "Needs Improvement", variant: "warning" as const, icon: AlertCircle },
};

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

function ProgressStepper({ current, total = 5 }: { current: number; total?: number }) {
  const steps = [
    { key: 1, label: "Applied" },
    { key: 2, label: "Screening" },
    { key: 3, label: "Test" },
    { key: 4, label: "AI Interview" },
    { key: 5, label: "Company" },
  ];
  
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
            index < current 
              ? "bg-sky-500 text-white" 
              : index === current 
                ? "bg-sky-100 text-sky-600 ring-2 ring-sky-500" 
                : "bg-slate-200 text-slate-400"
          )}>
            {index < current ? <CheckCircle className="w-4 h-4" /> : step.key}
          </div>
          <span className={cn("ml-1 text-xs font-medium hidden sm:block", index < current ? "text-sky-600" : "text-slate-400")}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className={cn("w-12 h-0.5 mx-1", index < current ? "bg-sky-500" : "bg-slate-200")} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const navigation = [
    { href: "#", label: "Dashboard", icon: BarChart2, badge: null },
    { href: "#", label: "Placement Drives", icon: Briefcase, badge: "8" },
    { href: "#", label: "My Applications", icon: FileText, badge: "5" },
    { href: "#", label: "Assessments", icon: Target, badge: "2" },
    { href: "#", label: "AI Interviews", icon: Bot, badge: "1" },
    { href: "#", label: "Preparation", icon: TrendingUp, badge: null },
    { href: "#", label: "Profile", icon: Users, badge: null },
    { href: "#", label: "Settings", icon: Settings, badge: null },
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
              <span className="font-display font-semibold text-xl text-slate-950">SmartInterview</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === item.label.toLowerCase().replace(" ", "-") 
                  ? "bg-sky-50 text-sky-600" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-sky-100 text-sky-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Layout */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:hidden">
              <h1 className="text-lg font-semibold text-slate-950">Dashboard</h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-slate-100">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100">
                  <Avatar 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=priya" 
                    fallback="PS" 
                    size="sm" 
                  />
                  <span className="hidden sm:block text-sm font-medium text-slate-700">Priya Sharma</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {/* Dropdown would go here */}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {/* Desktop Sidebar + Content */}
          <div className="hidden lg:flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link key={item.label} href={item.href} className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    activeTab === item.label.toLowerCase().replace(" ", "-") 
                      ? "bg-sky-50 text-sky-600" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-sky-100 text-sky-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
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
              {activeTab === "overview" && (
                <DashboardOverview 
                  applications={mockApplications} 
                  upcomingTests={mockUpcomingTests}
                  roadmap={mockRoadmap}
                />
              )}
              {activeTab === "my-applications" && <ApplicationsTab applications={mockApplications} />}
              {activeTab === "placement-drives" && <DrivesTab />}
              {activeTab === "assessments" && <AssessmentsTab tests={mockUpcomingTests} />}
              {activeTab === "ai-interviews" && <InterviewsTab />}
              {activeTab === "preparation" && <PreparationTab roadmap={mockRoadmap} />}
            </div>
          </div>

          {/* Mobile Content (when sidebar hidden) */}
          <div className="lg:hidden">
            {activeTab === "overview" && (
              <DashboardOverview 
                applications={mockApplications} 
                upcomingTests={mockUpcomingTests}
                roadmap={mockRoadmap}
              />
            )}
            {activeTab === "my-applications" && <ApplicationsTab applications={mockApplications} />}
            {activeTab === "placement-drives" && <DrivesTab />}
            {activeTab === "assessments" && <AssessmentsTab tests={mockUpcomingTests} />}
            {activeTab === "ai-interviews" && <InterviewsTab />}
            {activeTab === "preparation" && <PreparationTab roadmap={mockRoadmap} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({ applications, upcomingTests, roadmap }: { 
  applications: any[]; 
  upcomingTests: any[]; 
  roadmap: any[]; 
}) {
  const activeApp = applications.find(a => a.status === "ai_interview") || applications[0];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">Welcome back, Priya</h1>
          <p className="text-slate-600 mt-1">Here's your placement preparation overview</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Building2 className="w-4 h-4 mr-2" />
            Browse Drives
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </div>
      </div>

      {/* Active Application Card */}
      <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-sky-500 text-sky-600">Active Application</Badge>
                <StatusBadge status={activeApp.status} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{activeApp.role} at {activeApp.company}</h3>
              <p className="text-slate-600 mt-1">{activeApp.ctc} • Deadline: {new Date(activeApp.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
              <ProgressStepper current={activeApp.progress} className="mt-4" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                {activeApp.status === "ai_interview" ? "Continue Interview" : "Prepare Now"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Drives" value="12" icon={Briefcase} trend="+3 this month" trendColor="emerald" />
        <StatCard title="Applications" value="5" icon={FileText} trend="2 pending review" trendColor="sky" />
        <StatCard title="Shortlisted" value="2" icon={CheckCircle} trend="1 in progress" trendColor="emerald" />
        <StatCard title="Interviews Done" value="1" icon={Bot} trend="Feedback ready" trendColor="purple" />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Tests & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Upcoming Assessments</CardTitle>
              <Link href="#" className="text-sm text-sky-600 hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              {upcomingTests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No upcoming tests scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          test.type === "aptitude" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-600"
                        )}>
                          {test.type === "aptitude" ? <Target className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-950">{test.title}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(test.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} • {test.duration} min
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-sky-500 text-sky-600">{test.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <QuickActionCard icon={FileText} label="Upload Resume" href="#" color="sky" />
                <QuickActionCard icon={Target} label="Practice Test" href="#" color="emerald" />
                <QuickActionCard icon={Bot} label="Mock Interview" href="#" color="purple" />
                <QuickActionCard icon={TrendingUp} label="View Roadmap" href="#" color="amber" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Roadmap & Recent Activity */}
        <div className="space-y-6">
          {/* Preparation Roadmap */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">4-Week Roadmap</CardTitle>
              <Link href="#" className="text-sm text-sky-600 hover:underline">View Full Plan</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadmap.map((week) => (
                  <div key={week.week} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0",
                      week.completed ? "bg-emerald-100 text-emerald-600" : "bg-sky-100 text-sky-600"
                    )}>
                      {week.completed ? <CheckCircle className="w-5 h-5" /> : `W${week.week}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-950 truncate">Week {week.week}</p>
                      <p className="text-xs text-slate-500 truncate">{week.focus.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ActivityItem 
                  icon={CheckCircle} 
                  color="emerald" 
                  title="Applied to Microsoft SDE Intern" 
                  time="2 hours ago" 
                />
                <ActivityItem 
                  icon={Bot} 
                  color="sky" 
                  title="Resume screening passed (78%)" 
                  time="1 day ago" 
                />
                <ActivityItem 
                  icon={Target} 
                  color="amber" 
                  title="Completed Aptitude Test - 85%" 
                  time="3 days ago" 
                />
                <ActivityItem 
                  icon={FileText} 
                  color="purple" 
                  title="Uploaded new resume version" 
                  time="5 days ago" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendColor }: { 
  title: string; value: string; icon: any; trend: string; trendColor: string; 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-950 tabular-nums">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", `${trendColor}-100 text-${trendColor}-600`)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <p className={cn("mt-3 text-xs font-medium", `text-${trendColor}-600`)}>{trend}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ icon: Icon, label, href, color }: { 
  icon: any; label: string; href: string; color: string; 
}) {
  return (
    <Link href={href} className={cn(
      "p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors text-center group"
    )}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform", `${color}-100 text-${color}-600`)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-slate-700 group-hover:text-sky-600 transition-colors">{label}</p>
    </Link>
  );
}

function ActivityItem({ icon: Icon, color, title, time }: { 
  icon: any; color: string; title: string; time: string; 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", `${color}-100 text-${color}-600`)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-950 truncate">{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">My Applications</h1>
        <Button variant="outline">
          <Building2 className="w-4 h-4 mr-2" />
          Browse Drives
        </Button>
      </div>
      <div className="space-y-3">
        {applications.map((app) => (
          <Card key={app.id} className="hover:shadow-[0_4px_20px_-4px_rgba(15,23,42,0.1)] transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{app.role}</h3>
                    <p className="text-sm text-slate-500">{app.company} • {app.ctc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressStepper current={app.progress} />
                  <StatusBadge status={app.status} />
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DrivesTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-slate-950">Placement Drives</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Target className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      <div className="text-center py-12 text-slate-500">
        <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg">No drives available at the moment</p>
        <p className="text-sm mt-1">Check back soon for new opportunities</p>
      </div>
    </div>
  );
}

function AssessmentsTab({ tests }: { tests: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">Assessments</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    test.type === "aptitude" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-600"
                  )}>
                    {test.type === "aptitude" ? <Target className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{test.title}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(test.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })} • {test.duration} min
                    </p>
                  </div>
                </div>
                <Button size="sm" variant={test.status === "upcoming" ? "default" : "outline"}>
                  {test.status === "upcoming" ? "Start Test" : "View Result"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InterviewsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">AI Mock Interviews</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-sky-500/50" />
          <h3 className="text-lg font-semibold text-slate-950 mb-2">Ready for your AI Interview?</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Practice with our HeyGen-powered AI avatar interviewer. Get realistic questions, instant feedback, and detailed evaluation.
          </p>
          <Button size="lg" className="w-full max-w-xs">
            Start Mock Interview
            <Bot className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PreparationTab({ roadmap }: { roadmap: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-slate-950">Preparation Roadmap</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmap.map((week) => (
          <Card key={week.week} className={cn(
            week.completed && "ring-2 ring-emerald-500"
          )}>
            <CardHeader className={cn(
              "pb-4",
              week.completed && "bg-emerald-50"
            )}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Week {week.week}</CardTitle>
                {week.completed && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" /> Complete
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {week.focus.map((topic: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className={cn("w-1.5 h-1.5 rounded-full", week.completed ? "bg-emerald-500" : "bg-sky-500")} />
                    {topic}
                  </li>
                ))}
              </ul>
              <Button 
                variant={week.completed ? "outline" : "default"} 
                className="w-full mt-4"
                size="sm"
              >
                {week.completed ? "Review Week" : "Start Week"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}