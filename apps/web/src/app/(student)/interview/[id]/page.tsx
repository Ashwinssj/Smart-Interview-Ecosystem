"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Mic, MicOff, X, Volume2, VolumeX, 
  Timer, MessageSquare, CheckCircle, 
  AlertCircle, Loader2, ArrowRight,
  Building2, Briefcase, Bot, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

// HeyGen Streaming Avatar types
interface StreamingAvatar {
  mount: (element: HTMLElement) => void;
  unmount: () => void;
  speak: (options: { text: string }) => void;
  muteMicrophone: (muted: boolean) => void;
  on: (event: string, callback: (data: any) => void) => void;
  close: () => void;
}

declare global {
  interface Window {
    StreamingAvatar: new (options: { token: string; sessionId: string; avatarId: string }) => StreamingAvatar;
  }
}

interface InterviewSession {
  sessionId: string;
  token: string;
  interviewId: string;
  driveContext: {
    company: string;
    role: string;
    requiredSkills: string[];
  };
  studentContext: {
    name: string;
    resumeSummary: string;
  };
}

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [transcript, setTranscript] = useState<Array<{speaker: 'interviewer' | 'candidate'; text: string; category?: string; timestamp: number}>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize HeyGen session
  useEffect(() => {
    const initSession = async () => {
      try {
        // In production, call your Supabase Edge Function
        // const { data } = await supabase.functions.invoke('heygen-create-session', { 
        //   body: { driveId: "...", studentId: "..." } 
        // });
        
        // Mock session for development
        const mockSession: InterviewSession = {
          sessionId: "mock-session-" + Date.now(),
          token: "mock-token",
          interviewId: interviewId || "mock-interview-" + Date.now(),
          driveContext: {
            company: "Microsoft",
            role: "SDE Intern",
            requiredSkills: ["JavaScript", "React", "Node.js", "System Design", "DSA"]
          },
          studentContext: {
            name: "Priya Sharma",
            resumeSummary: "B.Tech CSE from NIT Trichy. Skills: JavaScript, React, Node.js, MongoDB. Internship at TechCorp as Full Stack Developer. Key Project: E-commerce platform with 10k+ users."
          }
        };
        
        setSession(mockSession);
        initializeAvatar(mockSession);
      } catch (err) {
        setError("Failed to initialize interview session");
        console.error(err);
      }
    };
    
    initSession();
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [interviewId]);

  const initializeAvatar = (sessionData: InterviewSession) => {
    if (!containerRef.current) return;
    
    // In production, load HeyGen SDK dynamically
    // const { StreamingAvatar } = await import('@heygen/streaming-avatar');
    
    // Mock avatar for development
    const mockAvatar = {
      mount: (el: HTMLElement) => {
        el.innerHTML = `
          <div class="w-full h-full flex flex-col items-center justify-center bg-slate-900 relative">
            <div class="w-48 h-48 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center animate-pulse">
              <Bot className="w-24 h-24 text-white/50" />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sky-400 font-medium">AI Interviewer</p>
              <p className="text-slate-400 text-sm">Listening...</p>
            </div>
          </div>
        `;
      },
      unmount: () => {},
      speak: (options: { text: string }) => {
        addTranscript('interviewer', options.text, 'general');
      },
      muteMicrophone: () => {},
      on: (event: string, callback: (data: any) => void) => {
        // Simulate events
        if (event === 'avatar_start_talking') {
          setTimeout(() => callback({ text: getNextQuestion(), category: 'technical' }), 2000);
        }
        if (event === 'user_transcript') {
          // Simulate user speaking
        }
        if (event === 'session_end') {
          setTimeout(() => callback(), 30000);
        }
      },
      close: () => {}
    };
    
    avatarRef.current = mockAvatar;
    mockAvatar.mount(containerRef.current);
    setConnectionStatus('connected');
    
    // Set up event listeners
    mockAvatar.on('avatar_start_talking', (data) => {
      setCurrentQuestion(data.text);
      setQuestionCount(prev => prev + 1);
      addTranscript('interviewer', data.text, data.category);
    });
    
    mockAvatar.on('user_transcript', (data) => {
      if (data.is_final) {
        addTranscript('candidate', data.text);
      }
    });
    
    mockAvatar.on('session_end', async () => {
      setConnectionStatus('disconnected');
      await completeInterview();
    });
    
    mockAvatar.on('error', (err: any) => {
      setError(err.message);
    });
  };

  const addTranscript = (speaker: 'interviewer' | 'candidate', text: string, category?: string) => {
    setTranscript(prev => [...prev, { speaker, text, category, timestamp: Date.now() }]);
    // Auto-scroll
    setTimeout(() => {
      transcriptRef.current?.scrollTop = transcriptRef.current.scrollHeight;
    }, 100);
  };

  const getNextQuestion = () => {
    const questions = [
      "Tell me about yourself and why you're interested in this SDE Intern role at Microsoft.",
      "Walk me through a challenging technical problem you solved recently. What was your approach?",
      "How would you design a scalable notification system for a social media platform?",
      "Explain the difference between SQL and NoSQL databases. When would you choose each?",
      "Describe a time you had a disagreement with a team member. How did you handle it?",
      "What's your experience with React and state management? Have you used Redux or Context API?",
      "How do you optimize frontend performance? Walk me through your process.",
      "Tell me about your internship project. What was the biggest technical challenge?",
      "How do you stay updated with new technologies? Give me a recent example.",
      "Do you have any questions for me about the role or the team?"
    ];
    return questions[questionCount] || "Thank you for your time. The interview is now complete.";
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    avatarRef.current?.muteMicrophone(!isMuted);
  };

  const endInterview = () => {
    avatarRef.current?.close();
    completeInterview();
  };

  const completeInterview = async () => {
    setIsComplete(true);
    // In production, call API to generate feedback
    // const res = await fetch(`/api/interviews/${session?.interviewId}/complete`, { method: 'POST' });
    // const feedbackData = await res.json();
    // setFeedback(feedbackData);
    
    // Mock feedback
    setTimeout(() => {
      setFeedback({
        overallScore: 87,
        communicationScore: 92,
        technicalScore: 85,
        problemSolvingScore: 88,
        relevanceScore: 82,
        strengths: [
          "Clear communication with good structure",
          "Strong problem-solving approach",
          "Good technical depth in React/Node.js"
        ],
        weaknesses: [
          "Could elaborate more on system design trade-offs",
          "Some answers were brief - provide more context"
        ],
        recommendations: [
          "Practice system design questions with scalability focus",
          "Prepare 2-3 detailed project stories using STAR method",
          "Review database sharding and caching strategies"
        ],
        detailedFeedback: "Priya demonstrated strong technical fundamentals and clear communication. Her React/Node.js knowledge is solid. For improvement, focus on expanding system design answers with specific trade-offs and providing more detailed project narratives."
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-sky-500" />
          <p className="text-slate-400">Initializing AI Interview...</p>
        </div>
      </div>
    );
  }

  if (isComplete && feedback) {
    return (
      <InterviewFeedback 
        feedback={feedback} 
        driveContext={session.driveContext}
        studentName={session.studentContext.name}
        onRestart={() => router.push(`/student/dashboard`)}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm font-medium">{session.driveContext.company} • {session.driveContext.role}</p>
              <p className="text-xs text-slate-400">AI Mock Interview</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl">
              <Timer className="w-4 h-4 text-sky-400" />
              <span className="font-mono tabular-nums text-lg">{formatTime(timeRemaining)}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span className="font-mono tabular-nums">{questionCount} / {totalQuestions}</span>
            </div>
            
            <Button variant="destructive" size="sm" onClick={endInterview} className="gap-2">
              <X className="w-4 h-4" />
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Main Interview Area */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Left Progress Indicator */}
        <div className="hidden lg:flex flex-col items-center gap-3 py-8 px-4 border-r border-slate-800">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Progress</span>
          <div className="flex flex-col gap-3">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div key={i} className={cn(
                "w-2 h-2 rounded-full transition-all",
                i < questionCount ? "bg-sky-500" : 
                i === questionCount ? "bg-sky-500/50 animate-pulse" : 
                "bg-slate-700"
              )} />
            ))}
          </div>
        </div>

        {/* Center - Avatar & Transcript */}
        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Avatar Container */}
          <div className="relative flex-1 flex items-center justify-center p-8">
            <div 
              ref={containerRef} 
              className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-slate-900"
            />
            
            {/* Current Question Overlay */}
            {currentQuestion && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 animate-in">
                <div className="bg-slate-950/95 backdrop-blur rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-sky-500 text-sky-400">
                      <Bot className="w-3 h-3 mr-1" /> Interviewer
                    </Badge>
                    {questionCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Question {questionCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-white leading-relaxed">{currentQuestion}</p>
                </div>
              </div>
            )}

            {/* Listening Indicator */}
            {isListening && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-in">
                <div className="bg-sky-500/20 border border-sky-500/30 rounded-full px-6 py-3 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: '0ms'}} />
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: '100ms'}} />
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: '200ms'}} />
                  </div>
                  <span className="text-sky-400 font-medium">Listening...</span>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Panel */}
          <div className="h-64 md:h-72 bg-slate-950/50 backdrop-blur border-t border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Live Transcript</h4>
              <Badge variant="outline" className="border-sky-500 text-sky-400 text-xs">
                {transcript.length} messages
              </Badge>
            </div>
            <div 
              ref={transcriptRef} 
              className="h-full overflow-y-auto p-3 space-y-3"
            >
              {transcript.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <p className="text-sm">Transcript will appear here...</p>
                </div>
              ) : (
                transcript.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3 animate-in",
                    msg.speaker === 'candidate' ? 'flex-row-reverse' : 'flex-row'
                  )}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium",
                      msg.speaker === 'interviewer' 
                        ? 'bg-sky-500/20 text-sky-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    )}>
                      {msg.speaker === 'interviewer' ? <Bot className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                      msg.speaker === 'interviewer'
                        ? 'bg-slate-800/50 text-white'
                        : 'bg-sky-500/20 text-white'
                    )}>
                      {msg.category && (
                        <span className="text-xs text-sky-400/70 uppercase tracking-wider mb-1 block">
                          {msg.category}
                        </span>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="hidden lg:flex flex-col items-center gap-4 py-8 px-4 border-l border-slate-800 bg-slate-950/50">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Microphone</p>
            <button
              onClick={toggleMute}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                isMuted 
                  ? "bg-red-500/20 border border-red-500/30 text-red-400" 
                  : "bg-sky-500/20 border border-sky-500/30 text-sky-400 animate-pulse"
              )}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <p className={cn("text-xs mt-1", isMuted ? "text-red-400" : "text-sky-400")}>
              {isMuted ? "Muted" : "Live"}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Status</p>
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              connectionStatus === 'connected' ? "bg-emerald-500/20 text-emerald-400" :
              connectionStatus === 'connecting' ? "bg-amber-500/20 text-amber-400 animate-pulse" :
              "bg-red-500/20 text-red-400"
            )}>
              {connectionStatus === 'connected' && <CheckCircle className="w-6 h-6" />}
              {connectionStatus === 'connecting' && <Loader2 className="w-6 h-6 animate-spin" />}
              {connectionStatus === 'disconnected' && <AlertCircle className="w-6 h-6" />}
            </div>
            <p className={cn("text-xs mt-1 capitalize", connectionStatus === 'connected' ? "text-emerald-400" : "text-slate-500")}>
              {connectionStatus}
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Controls (Mobile) */}
      <div className="lg:hidden border-t border-slate-800 p-4 bg-slate-950/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMute}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              isMuted ? "bg-red-500/20 text-red-400" : "bg-sky-500/20 text-sky-400"
            )}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div className="flex-1 px-4 text-center">
            <p className="text-xs text-slate-500">Question {questionCount} of {totalQuestions}</p>
            <p className="font-mono tabular-nums">{formatTime(timeRemaining)}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={endInterview}>
            End
          </Button>
        </div>
      </div>
    </div>
  );
}

function InterviewFeedback({ 
  feedback, 
  driveContext, 
  studentName,
  onRestart
}: { 
  feedback: any; 
  driveContext: any; 
  studentName: string;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-slate-950 mb-2">Interview Complete!</h1>
          <p className="text-slate-600">Great job, {studentName}. Here's your detailed feedback.</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle 
                        cx="64" cy="64" r="58" 
                        fill="none" stroke="#e2e8f0" strokeWidth="8"
                      />
                      <circle 
                        cx="64" cy="64" r="58" 
                        fill="none" stroke="#0ea5e9" strokeWidth="8"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 * (1 - feedback.overallScore / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-950">{feedback.overallScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-950">Overall Score</p>
                    <p className="text-slate-500">{driveContext.company} • {driveContext.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Communication" score={feedback.communicationScore} color="sky" />
                <ScoreCard label="Technical" score={feedback.technicalScore} color="purple" />
                <ScoreCard label="Problem Solving" score={feedback.problemSolvingScore} color="emerald" />
                <ScoreCard label="Relevance" score={feedback.relevanceScore} color="amber" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback Tabs */}
        <Tabs defaultValue="strengths" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="details">Full Report</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths">
            <div className="space-y-3">
              {feedback.strengths.map((strength: string, i: number) => (
                <Card key={i} className="border-emerald-200">
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{strength}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weaknesses">
            <div className="space-y-3">
              {feedback.weaknesses.map((weakness: string, i: number) => (
                <Card key={i} className="border-amber-200">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{weakness}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-3">
              {feedback.recommendations.map((rec: string, i: number) => (
                <Card key={i} className="border-sky-200">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Target className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{rec}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{feedback.detailedFeedback}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" onClick={onRestart} className="w-full sm:w-auto">
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="text-center p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={cn("text-2xl font-bold", `text-${color}-600`)}>{score}</p>
      <div className="w-full h-2 bg-slate-200 rounded-full mt-2">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", `bg-${color}-500`)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}