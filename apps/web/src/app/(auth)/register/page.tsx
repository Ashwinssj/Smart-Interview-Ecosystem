"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraduationCap, Building2, UserShield, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  role: z.enum(["student", "tpo", "admin"]),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  // Student fields
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  studentId: z.string().min(1, "Student ID is required").optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  academicYear: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().min(2020).max(2035).optional(),
  collegeId: z.string().uuid().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const roleOptions = [
  { value: "student", label: "Student", icon: GraduationCap, description: "Looking for placement opportunities" },
  { value: "tpo", label: "Training & Placement Officer", icon: Building2, description: "Manage drives and student placements" },
  { value: "admin", label: "Administrator", icon: UserShield, description: "System administration and oversight" },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("role") || "student";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultTab as RegisterForm["role"] },
  });

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement Supabase auth + profile creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess("Account created! Please verify your email to continue.");
      setTimeout(() => router.push("/verify-otp"), 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roleOptions.find(r => r.value === activeTab) || roleOptions[0];

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-semibold text-2xl text-slate-950">SmartInterview</span>
          </Link>
          <h1 className="text-3xl font-display font-semibold text-slate-950 mb-2">
            Create your account
          </h1>
          <p className="text-slate-600">
            Join thousands of students preparing for their dream careers
          </p>
        </div>

        {/* Role Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
            {roleOptions.map((role) => (
              <TabsTrigger 
                key={role.value} 
                value={role.value}
                className="gap-2 py-2.5 px-2 justify-center data-[state=active]:shadow-[0_2px_8px_-2px_rgba(14,165,233,0.3)]"
              >
                <role.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{role.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Role Description */}
        <div className="mb-6 p-4 bg-sky-50 border border-sky-100 rounded-xl">
          <div className="flex items-start gap-3">
            <selectedRole.icon className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sky-800">{selectedRole.label}</p>
              <p className="text-sm text-sky-600">{selectedRole.description}</p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="shadow-[0_4px_20px_-4px_rgba(15,23,42,0.1)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm animate-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-sm animate-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              {/* Role is handled by tabs */}
              <input type="hidden" {...registerForm.register("role")} />
              
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register("name")}
                disabled={isLoading}
                required={activeTab === "student" || activeTab === "tpo" || activeTab === "admin"}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@college.edu"
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register("email")}
                autoComplete="email"
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register("password")}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={registerForm.formState.errors.confirmPassword?.message}
                {...registerForm.register("confirmPassword")}
                autoComplete="new-password"
                disabled={isLoading}
              />

              {/* Student-specific fields */}
              {(activeTab === "student") && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700">Student Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Student ID / Roll No."
                      placeholder="CS2024001"
                      error={registerForm.formState.errors.studentId?.message}
                      {...registerForm.register("studentId")}
                      disabled={isLoading}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...registerForm.register("phone")}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Department"
                      placeholder="Computer Science"
                      {...registerForm.register("department")}
                      disabled={isLoading}
                    />
                    <Input
                      label="Academic Year"
                      placeholder="Final Year"
                      {...registerForm.register("academicYear")}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="CGPA"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="8.50"
                      {...registerForm.register("cgpa", { valueAsNumber: true })}
                      disabled={isLoading}
                    />
                    <Input
                      label="Graduation Year"
                      type="number"
                      min="2020"
                      max="2035"
                      placeholder="2024"
                      {...registerForm.register("graduationYear", { valueAsNumber: true })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* TPO/Admin specific fields */}
              {(activeTab === "tpo" || activeTab === "admin") && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700">
                    {activeTab === "tpo" ? "TPO Details" : "Admin Details"}
                  </h4>
                  <Input
                    label="College ID"
                    placeholder="Select your college"
                    error={registerForm.formState.errors.collegeId?.message}
                    {...registerForm.register("collegeId")}
                    disabled={isLoading}
                  />
                  {(activeTab === "tpo") && (
                    <Input
                      label="Department"
                      placeholder="Computer Science"
                      {...registerForm.register("department")}
                      disabled={isLoading}
                    />
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account? 
                <Link 
                  href="/login" 
                  className="text-sky-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features hint */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-slate-600">Email Verification</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-slate-600">Secure & Private</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <GraduationCap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-xs text-slate-600">Student Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}