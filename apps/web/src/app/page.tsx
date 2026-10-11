import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, Building2, Bot, FileText, 
  Target, TrendingUp, Shield, Users, 
  ArrowRight, CheckCircle, Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2" aria-label="Smart Interview Ecosystem Home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-xl text-slate-950">SmartInterview</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">How It Works</Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">Testimonials</Link>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">Login</Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-end pt-16 pb-20 md:pb-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        {/* Background atmosphere */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%230ea5e9%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-center" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 w-full pb-20 md:pb-32">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 animate-in stagger-1" style={{ borderColor: 'rgb(14 165 233)', color: 'rgb(14 165 233)' }}>
              <Sparkles className="w-3 h-3 mr-1" /> New: AI Mock Interviews with HeyGen Avatar
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tighter leading-none text-slate-950 mb-6 animate-in stagger-2 text-balance">
              Where Preparation
              <br />
              <span className="gradient-text">Meets Opportunity</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-[65ch] mb-8 animate-in stagger-3 leading-relaxed">
              AI-powered placement platform with intelligent resume screening, adaptive assessments, 
              and realistic mock interviews. Join 10,000+ students cracking their dream placements.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in stagger-4">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto group">
                  Start Your Journey Free
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6 animate-in stagger-5">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle className="w-5 h-5 text-sky-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle className="w-5 h-5 text-sky-500" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-slate-950 mb-4">
              Everything You Need to Ace Your Placement
            </h2>
            <p className="text-slate-600 text-lg">
              From resume building to final interview, our AI-powered platform guides you through every step.
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Feature 1 - Wide */}
            <Card className="md:col-span-2 lg:col-span-2 p-0 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Bot className="w-6 h-6 text-sky-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 mb-2">AI Resume Screening & Matching</h3>
                    <p className="text-slate-600 mb-4">
                      Upload your resume and get instant AI-powered matching against job requirements. 
                      Receive detailed feedback on missing skills, keywords, and actionable improvement recommendations.
                    </p>
                    <Link href="#" className="text-sm font-medium text-sky-600 hover:underline flex items-center gap-1">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Feature 2 - Wide */}
            <Card className="md:col-span-2 lg:col-span-2 p-0 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 mb-2">Adaptive Aptitude & Technical Tests</h3>
                    <p className="text-slate-600 mb-4">
                      Practice with unlimited adaptive tests covering quantitative aptitude, logical reasoning, 
                      verbal ability, and domain-specific technical questions. Real-time scoring and topic-wise analysis.
                    </p>
                    <Link href="#" className="text-sm font-medium text-sky-600 hover:underline flex items-center gap-1">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Feature 3 */}
            <Card className="p-6 group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Target className="w-5 h-5 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Realistic AI Mock Interviews</h3>
              <p className="text-slate-600 text-sm">
                Practice with HeyGen-powered AI avatar interviewer. Voice-based, context-aware questions 
                that adapt to your answers — just like a real interview.
              </p>
            </Card>
            
            {/* Feature 4 */}
            <Card className="p-6 group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Personalized Preparation Roadmap</h3>
              <p className="text-slate-600 text-sm">
                Get a 4-week customized study plan based on your interview performance. 
                Focused tasks, curated resources, and progress tracking.
              </p>
            </Card>
            
            {/* Feature 5 */}
            <Card className="p-6 group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Shield className="w-5 h-5 text-rose-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Secure & Privacy-First</h3>
              <p className="text-slate-600 text-sm">
                Your data is encrypted and protected with row-level security. 
                Resume, academic data, and interview recordings accessible only to authorized users.
              </p>
            </Card>
            
            {/* Feature 6 */}
            <Card className="p-6 group hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Users className="w-5 h-5 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">TPO & Admin Analytics</h3>
              <p className="text-slate-600 text-sm">
                Comprehensive dashboards for placement officers. Track applications, 
                screening stats, test performance, and placement progress in real-time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 lg:py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-slate-950 mb-4">
              Your Path to Placement Success
            </h2>
            <p className="text-slate-600 text-lg">
              A streamlined 4-step process designed to maximize your chances of landing your dream role.
            </p>
          </div>
          
          <div className="space-y-12 md:space-y-16">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="lg:order-2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-600/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-sky-500/50" />
                  </div>
                </div>
              </div>
              <div className="lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-display font-bold text-sky-500/20">01</span>
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">Build Your Profile</h3>
                </div>
                <p className="text-slate-600 text-lg mb-6">
                  Create your comprehensive profile with academic details, skills, projects, and certifications. 
                  Upload your resume for AI parsing and instant keyword extraction.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Academic details, CGPA, department, graduation year
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Technical skills with proficiency levels
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Projects, internships, certifications showcase
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    AI-powered resume parsing & keyword extraction
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-display font-bold text-sky-500/20">02</span>
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">Apply & Get Matched</h3>
                </div>
                <p className="text-slate-600 text-lg mb-6">
                  Browse placement drives from top companies. Our AI matches your profile against 
                  requirements and gives you a compatibility score with specific improvement feedback.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Browse drives with filters (CTC, location, role, skills)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    AI resume-JD matching with semantic similarity
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Configurable threshold (default 50%) set by TPO
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    1-2 re-screen attempts with improvement feedback
                  </li>
                </ul>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-emerald-500/50" />
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="lg:order-2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-16 h-16 text-purple-500/50" />
                  </div>
                </div>
              </div>
              <div className="lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-display font-bold text-sky-500/20">03</span>
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">Assessments & AI Interview</h3>
                </div>
                <p className="text-slate-600 text-lg mb-6">
                  Take adaptive aptitude and technical tests. Then face a realistic AI avatar interviewer 
                  that asks contextual questions, evaluates your responses, and provides detailed feedback.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Aptitude: Quant, Logical, Verbal
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Technical: DSA, DBMS, OS, CN, Cloud, ML
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    AI Avatar interview with voice & dynamic follow-ups
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Scores: Communication, Technical, Problem Solving, Relevance
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-display font-bold text-sky-500/20">04</span>
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-950">Feedback, Roadmap & Placement</h3>
                </div>
                <p className="text-slate-600 text-lg mb-6">
                  Receive comprehensive feedback with strengths, weaknesses, and a personalized 
                  4-week roadmap. Shortlisted candidates are forwarded to company placement process.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Detailed feedback report with scores & transcript
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    4-week personalized preparation roadmap
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Curated resources: videos, articles, practice problems
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    Forwarded to company drive upon clearing internal stages
                  </li>
                </ul>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-amber-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-slate-950 mb-4">
              Trusted by Students Across Top Colleges
            </h2>
            <p className="text-slate-600 text-lg">
              See what our community has to say about their placement journey.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* Main Testimonial */}
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <Sparkles className="w-24 h-24 text-sky-500" />
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl font-display font-bold text-sky-500/10">"</span>
              </div>
              <blockquote className="text-2xl md:text-3xl font-display font-medium text-slate-950 leading-tight mb-8">
                "The AI interview felt more real than my actual company interview. 
                The feedback on my system design answers changed how I prepare."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                  PS
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Priya Sharma</p>
                  <p className="text-sm text-slate-500">CSE 2024 • Placed at Microsoft</p>
                </div>
              </div>
            </Card>
            
            {/* Mini Testimonials */}
            <div className="space-y-4">
              <Card className="p-5">
                <p className="text-slate-700 mb-3">"Resume matching saved me weeks of guesswork. I knew exactly which skills to highlight."</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">RK</div>
                  <div>
                    <p className="font-medium text-sm text-slate-950">Rahul Kumar</p>
                    <p className="text-xs text-slate-500">ECE 2024 • Amazon</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-5">
                <p className="text-slate-700 mb-3">"The 4-week roadmap was a game changer. Structured prep instead of random studying."</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">AP</div>
                  <div>
                    <p className="font-medium text-sm text-slate-950">Ananya Patel</p>
                    <p className="text-xs text-slate-500">IT 2024 • Google</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-5">
                <p className="text-slate-700 mb-3">"TPO dashboard analytics helped us identify gaps in student prep early. Placements up 34%."</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">SR</div>
                  <div>
                    <p className="font-medium text-sm text-slate-950">Prof. S. Reddy</p>
                    <p className="text-xs text-slate-500">TPO • NIT Trichy</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%23ffffff%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-center" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-6">
            Ready to Crack Your Dream Placement?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of students who've transformed their placement preparation with AI-powered practice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register?role=tpo">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-400">
                For Colleges & TPOs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-semibold text-xl text-white">SmartInterview</span>
              </Link>
              <p className="text-slate-400 max-w-sm">
                AI-powered placement platform helping students prepare, practice, and succeed in their campus placements.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-sky-400 transition-colors">AI Resume Screening</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Adaptive Assessments</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">AI Mock Interviews</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Personalized Roadmaps</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Analytics Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Smart Interview Ecosystem. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}