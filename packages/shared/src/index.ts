// Shared types and Zod schemas for Smart Interview Ecosystem

import { z } from 'zod';

// ============================================
// Enums
// ============================================

export const UserRole = z.enum(['student', 'tpo', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

export const ApplicationStatus = z.enum([
  'open',
  'applied',
  'resume_screening',
  'shortlisted',
  'test',
  'ai_interview',
  'company_process',
  'selected',
  'rejected',
  'needs_improvement'
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatus>;

export const TestType = z.enum(['aptitude', 'technical']);
export type TestType = z.infer<typeof TestType>;

export const QuestionType = z.enum(['mcq', 'coding', 'subjective']);
export type QuestionType = z.infer<typeof QuestionType>;

export const InterviewStatus = z.enum(['pending', 'in_progress', 'completed', 'evaluated']);
export type InterviewStatus = z.infer<typeof InterviewStatus>;

export const InterviewCategory = z.enum(['hr', 'technical', 'behavioral', 'project', 'role_specific']);
export type InterviewCategory = z.infer<typeof InterviewCategory>;

export const DriveStatus = z.enum(['draft', 'published', 'closed', 'completed']);
export type DriveStatus = z.infer<typeof DriveStatus>;

export const EmploymentType = z.enum(['full_time', 'internship', 'contract', 'part_time']);
export type EmploymentType = z.infer<typeof EmploymentType>;

export const SkillCategory = z.enum(['programming', 'cloud', 'database', 'framework', 'other']);
export type SkillCategory = z.infer<typeof SkillCategory>;

export const NotificationType = z.enum([
  'test_schedule',
  'interview_schedule',
  'application_status',
  'shortlisting',
  'announcement',
  'resume_feedback',
  'test_result',
  'interview_feedback'
]);
export type NotificationType = z.infer<typeof NotificationType>;

// ============================================
// Base Schemas
// ============================================

export const PaginationParams = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof PaginationParams>;

export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });

// ============================================
// Auth Schemas
// ============================================

export const RegisterSchema = z.object({
  role: UserRole,
  email: z.string().email(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
  // Student fields
  name: z.string().min(2).max(100).optional(),
  studentId: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  department: z.string().max(100).optional(),
  academicYear: z.string().max(20).optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
  // TPO/Admin fields
  collegeId: z.string().uuid().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  type: z.enum(['email', 'phone']).default('email'),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const TokenResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: UserRole,
    isVerified: z.boolean(),
  }),
});

export type TokenResponse = z.infer<typeof TokenResponse>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

// ============================================
// User Schemas
// ============================================

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: UserRole,
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const StudentProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  studentId: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  department: z.string(),
  academicYear: z.string(),
  cgpa: z.number().nullable(),
  graduationYear: z.number().int().nullable(),
  collegeId: z.string().uuid(),
  collegeName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;

export const UpdateStudentProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  department: z.string().max(100).optional(),
  academicYear: z.string().max(20).optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof UpdateStudentProfileSchema>;

export const TpoProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  department: z.string(),
  collegeId: z.string().uuid(),
  collegeName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TpoProfile = z.infer<typeof TpoProfileSchema>;

export const AdminProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  permissions: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminProfile = z.infer<typeof AdminProfileSchema>;

// ============================================
// College Schemas
// ============================================

export const CollegeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  address: z.string().nullable(),
  logoUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type College = z.infer<typeof CollegeSchema>;

export const CreateCollegeSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(20),
  address: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

export type CreateCollegeInput = z.infer<typeof CreateCollegeSchema>;

// ============================================
// Skill Schemas
// ============================================

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: SkillCategory,
  createdAt: z.string().datetime(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const CreateSkillSchema = z.object({
  name: z.string().min(2).max(100),
  category: SkillCategory,
});

export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;

export const StudentSkillSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  skillId: z.string().uuid(),
  skill: SkillSchema.optional(),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
  createdAt: z.string().datetime(),
});

export type StudentSkill = z.infer<typeof StudentSkillSchema>;

export const AddStudentSkillSchema = z.object({
  skillId: z.string().uuid(),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
});

export type AddStudentSkillInput = z.infer<typeof AddStudentSkillSchema>;

// ============================================
// Company Schemas
// ============================================

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logoUrl: z.string().url().nullable(),
  website: z.string().url().nullable(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Company = z.infer<typeof CompanySchema>;

export const CreateCompanySchema = z.object({
  name: z.string().min(2).max(200),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;

// ============================================
// Placement Drive Schemas
// ============================================

export const PlacementDriveSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  company: CompanySchema.optional(),
  tpoId: z.string().uuid(),
  role: z.string(),
  description: z.string(),
  location: z.string(),
  ctc: z.string(),
  employmentType: EmploymentType,
  eligibilityCriteria: z.string(),
  minCgpa: z.number().min(0).max(10),
  eligibleDepartments: z.array(z.string()),
  requiredSkills: z.array(z.string()),
  qualifications: z.string(),
  deadline: z.string().datetime(),
  testSchedule: z.string().datetime().nullable(),
  interviewSchedule: z.string().datetime().nullable(),
  companyLink: z.string().url().nullable(),
  status: DriveStatus,
  resumeScreeningThreshold: z.number().min(0).max(100).default(50),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PlacementDrive = z.infer<typeof PlacementDriveSchema>;

export const CreateDriveSchema = z.object({
  companyId: z.string().uuid(),
  role: z.string().min(2).max(200),
  description: z.string().min(50).max(10000),
  location: z.string().min(2).max(200),
  ctc: z.string().min(1).max(100),
  employmentType: EmploymentType,
  eligibilityCriteria: z.string().min(10).max(5000),
  minCgpa: z.number().min(0).max(10),
  eligibleDepartments: z.array(z.string()).min(1),
  requiredSkills: z.array(z.string()).min(1),
  qualifications: z.string().min(10).max(2000),
  deadline: z.string().datetime(),
  testSchedule: z.string().datetime().optional(),
  interviewSchedule: z.string().datetime().optional(),
  companyLink: z.string().url().optional(),
  resumeScreeningThreshold: z.number().min(0).max(100).default(50),
});

export type CreateDriveInput = z.infer<typeof CreateDriveSchema>;

export const UpdateDriveSchema = CreateDriveSchema.partial();

export type UpdateDriveInput = z.infer<typeof UpdateDriveSchema>;

export const DriveListParams = PaginationParams.extend({
  status: DriveStatus.optional(),
  department: z.string().optional(),
  search: z.string().optional(),
});

export type DriveListParams = z.infer<typeof DriveListParams>;

// ============================================
// Application Schemas
// ============================================

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  driveId: z.string().uuid(),
  drive: PlacementDriveSchema.optional(),
  student: StudentProfileSchema.optional(),
  status: ApplicationStatus,
  resumeVersion: z.number().int().positive(),
  appliedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const ApplyToDriveSchema = z.object({
  driveId: z.string().uuid(),
  resumeId: z.string().uuid().optional(), // If not provided, uses latest
});

export type ApplyToDriveInput = z.infer<typeof ApplyToDriveSchema>;

export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatus,
  notes: z.string().max(1000).optional(),
});

export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>;

export const ApplicationFilters = z.object({
  status: ApplicationStatus.optional(),
  driveId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
}).merge(PaginationParams);

export type ApplicationFilters = z.infer<typeof ApplicationFilters>;

// ============================================
// Resume Schemas
// ============================================

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  driveId: z.string().uuid().nullable(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
  parsedData: z.record(z.unknown()).nullable(),
  version: z.number().int().positive(),
  uploadedAt: z.string().datetime(),
});

export type Resume = z.infer<typeof ResumeSchema>;

export const ResumeParsedDataSchema = z.object({
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number().int().optional(),
    cgpa: z.number().optional(),
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
  })),
  certifications: z.array(z.string()),
  internships: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  keywords: z.array(z.string()),
});

export type ResumeParsedData = z.infer<typeof ResumeParsedDataSchema>;

export const ResumeScoreSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  driveId: z.string().uuid(),
  overallScore: z.number().min(0).max(100),
  skillMatchScore: z.number().min(0).max(100),
  keywordMatchScore: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  screenedAt: z.string().datetime(),
});

export type ResumeScore = z.infer<typeof ResumeScoreSchema>;

export const ResumeScreeningResultSchema = z.object({
  passed: z.boolean(),
  score: ResumeScoreSchema,
  attemptsRemaining: z.number().int().nonnegative(),
  canRescreen: z.boolean(),
});

export type ResumeScreeningResult = z.infer<typeof ResumeScreeningResultSchema>;

// ============================================
// Test Schemas
// ============================================

export const TestSchema = z.object({
  id: z.string().uuid(),
  driveId: z.string().uuid(),
  type: TestType,
  title: z.string(),
  description: z.string().nullable(),
  durationMinutes: z.number().int().positive(),
  passingScore: z.number().min(0).max(100),
  configuredBy: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Test = z.infer<typeof TestSchema>;

export const CreateTestSchema = z.object({
  driveId: z.string().uuid(),
  type: TestType,
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  durationMinutes: z.number().int().positive().max(300),
  passingScore: z.number().min(0).max(100),
});

export type CreateTestInput = z.infer<typeof CreateTestSchema>;

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  testId: z.string().uuid(),
  questionText: z.string(),
  options: z.array(z.string()).nullable(), // null for coding/subjective
  correctAnswer: z.string().nullable(), // null for subjective
  explanation: z.string().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topic: z.string(),
  questionType: QuestionType,
  order: z.number().int().positive(),
  createdAt: z.string().datetime(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const CreateQuestionSchema = z.object({
  testId: z.string().uuid(),
  questionText: z.string().min(10).max(5000),
  options: z.array(z.string()).min(2).max(6).optional(), // required for MCQ
  correctAnswer: z.string().optional(), // required for MCQ/coding
  explanation: z.string().max(2000).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  topic: z.string().min(1).max(100),
  questionType: QuestionType,
  order: z.number().int().positive(),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const BulkCreateQuestionsSchema = z.object({
  testId: z.string().uuid(),
  questions: z.array(CreateQuestionSchema.omit({ testId: true })).min(1).max(100),
});

export type BulkCreateQuestionsInput = z.infer<typeof BulkCreateQuestionsSchema>;

// Student test view (no correct answer/explanation)
export const StudentQuestionSchema = QuestionSchema.omit({
  correctAnswer: true,
  explanation: true,
});

export type StudentQuestion = z.infer<typeof StudentQuestionSchema>;

export const TestAttemptSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  testId: z.string().uuid(),
  test: TestSchema.optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  score: z.number().min(0).max(100).nullable(),
  status: z.enum(['in_progress', 'submitted', 'evaluated', 'expired']),
  timeSpentSeconds: z.number().int().nonnegative().default(0),
});

export type TestAttempt = z.infer<typeof TestAttemptSchema>;

export const StartTestSchema = z.object({
  testId: z.string().uuid(),
});

export type StartTestInput = z.infer<typeof StartTestSchema>;

export const SubmitTestAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedAnswer: z.string(), // For MCQ: option index; for coding: code; for subjective: text
  timeSpentSeconds: z.number().int().positive(),
});

export type SubmitTestAnswerInput = z.infer<typeof SubmitTestAnswerSchema>;

export const SubmitTestSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    selectedAnswer: z.string(),
    timeSpentSeconds: z.number().int().positive(),
  })),
});

export type SubmitTestInput = z.infer<typeof SubmitTestSchema>;

export const TestResultSchema = z.object({
  attempt: TestAttemptSchema,
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    questionText: z.string(),
    selectedAnswer: z.string(),
    correctAnswer: z.string().nullable(),
    isCorrect: z.boolean(),
    explanation: z.string().nullable(),
    timeSpentSeconds: z.number().int().nonnegative(),
  })),
  topicBreakdown: z.record(z.object({
    correct: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    percentage: z.number().min(0).max(100),
  })),
});

export type TestResult = z.infer<typeof TestResultSchema>;

// ============================================
// AI Interview Schemas
// ============================================

export const InterviewSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  driveId: z.string().uuid(),
  drive: PlacementDriveSchema.optional(),
  status: InterviewStatus,
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  overallScore: z.number().min(0).max(100).nullable(),
  transcriptUrl: z.string().url().nullable(),
  recordingUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Interview = z.infer<typeof InterviewSchema>;

export const StartInterviewSchema = z.object({
  driveId: z.string().uuid(),
});

export type StartInterviewInput = z.infer<typeof StartInterviewSchema>;

export const InterviewQuestionSchema = z.object({
  id: z.string().uuid(),
  interviewId: z.string().uuid(),
  questionText: z.string(),
  category: InterviewCategory,
  order: z.number().int().positive(),
  aiGenerated: z.boolean(),
  askedAt: z.string().datetime().nullable(),
});

export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

export const InterviewAnswerSchema = z.object({
  id: z.string().uuid(),
  interviewId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerText: z.string(),
  audioUrl: z.string().url().nullable(),
  evaluation: z.record(z.unknown()).nullable(),
  answeredAt: z.string().datetime().nullable(),
});

export type InterviewAnswer = z.infer<typeof InterviewAnswerSchema>;

export const InterviewFeedbackSchema = z.object({
  id: z.string().uuid(),
  interviewId: z.string().uuid(),
  communicationScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  problemSolvingScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  detailedFeedback: z.string(),
  createdAt: z.string().datetime(),
});

export type InterviewFeedback = z.infer<typeof InterviewFeedbackSchema>;

// WebSocket message types
export const WSMessageType = z.enum([
  'avatar_intro',
  'question',
  'listening',
  'processing',
  'evaluation',
  'complete',
  'error',
]);

export type WSMessageType = z.infer<typeof WSMessageType>;

export const WSMessageSchema = z.object({
  type: WSMessageType,
  payload: z.record(z.unknown()),
});

export type WSMessage = z.infer<typeof WSMessageSchema>;

export const WSQuestionPayloadSchema = z.object({
  questionId: z.string().uuid(),
  questionText: z.string(),
  category: InterviewCategory,
  audioUrl: z.string().url().optional(),
  timeLimitSeconds: z.number().int().positive().optional(),
});

export type WSQuestionPayload = z.infer<typeof WSQuestionPayloadSchema>;

export const WSAnswerPayloadSchema = z.object({
  questionId: z.string().uuid(),
  audioData: z.string(), // base64 encoded audio chunk
  isFinal: z.boolean(),
});

export type WSAnswerPayload = z.infer<typeof WSAnswerPayloadSchema>;

// ============================================
// Roadmap Schemas
// ============================================

export const RoadmapSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  driveId: z.string().uuid().nullable(),
  weekNumber: z.number().int().min(1).max(4),
  focusAreas: z.array(z.string()),
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['study', 'practice', 'mock_interview', 'resume_review']),
    estimatedHours: z.number().positive(),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      type: z.enum(['article', 'video', 'course', 'practice']),
    })),
    completed: z.boolean().default(false),
  })),
  generatedAt: z.string().datetime(),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;

// ============================================
// Notification Schemas
// ============================================

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationType,
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  sentAt: z.string().datetime(),
  relatedEntityType: z.string().nullable(),
  relatedEntityId: z.string().uuid().nullable(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const SendNotificationSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1),
  type: NotificationType,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().uuid().optional(),
  sendEmail: z.boolean().default(false),
});

export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;

// ============================================
// Report Schemas
// ============================================

export const StudentReportSchema = z.object({
  student: StudentProfileSchema,
  resumeScore: ResumeScoreSchema.nullable(),
  aptitudeScore: z.number().min(0).max(100).nullable(),
  technicalScore: z.number().min(0).max(100).nullable(),
  interviewFeedback: InterviewFeedbackSchema.nullable(),
  weaknesses: z.array(z.string()),
  roadmap: RoadmapSchema.nullable(),
});

export type StudentReport = z.infer<typeof StudentReportSchema>;

export const DriveReportSchema = z.object({
  drive: PlacementDriveSchema,
  totalApplicants: z.number().int().nonnegative(),
  eligibleStudents: z.number().int().nonnegative(),
  resumeShortlisted: z.number().int().nonnegative(),
  testParticipants: z.number().int().nonnegative(),
  interviewParticipants: z.number().int().nonnegative(),
  forwardedCandidates: z.number().int().nonnegative(),
  finalSelections: z.number().int().nonnegative(),
  screeningStats: z.object({
    averageScore: z.number(),
    passRate: z.number(),
  }),
});

export type DriveReport = z.infer<typeof DriveReportSchema>;

export const TpoDashboardStatsSchema = z.object({
  totalStudents: z.number().int().nonnegative(),
  activeDrives: z.number().int().nonnegative(),
  totalApplications: z.number().int().nonnegative(),
  resumeShortlisted: z.number().int().nonnegative(),
  testShortlisted: z.number().int().nonnegative(),
  interviewCompleted: z.number().int().nonnegative(),
  forwardedToCompanies: z.number().int().nonnegative(),
  finalPlacements: z.number().int().nonnegative(),
  placementProgress: z.number().min(0).max(100),
});

export type TpoDashboardStats = z.infer<typeof TpoDashboardStatsSchema>;

export const AdminDashboardStatsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  totalStudents: z.number().int().nonnegative(),
  totalTpos: z.number().int().nonnegative(),
  totalAdmins: z.number().int().nonnegative(),
  totalDrives: z.number().int().nonnegative(),
  activeDrives: z.number().int().nonnegative(),
  totalApplications: z.number().int().nonnegative(),
  completedInterviews: z.number().int().nonnegative(),
  placementRate: z.number().min(0).max(100),
  recentActivity: z.array(z.object({
    type: z.string(),
    description: z.string(),
    timestamp: z.string().datetime(),
  })),
});

export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;

// ============================================
// AI Config Schemas
// ============================================

export const AIConfigSchema = z.object({
  id: z.string().uuid(),
  resumeScreeningThreshold: z.number().min(0).max(100).default(50),
  maxRescreenAttempts: z.number().int().min(0).max(5).default(2),
  interviewMaxQuestions: z.number().int().min(5).max(30).default(15),
  interviewTimeLimitMinutes: z.number().int().min(10).max(60).default(30),
  openaiModel: z.string().default('gpt-4o'),
  embeddingModel: z.string().default('text-embedding-3-large'),
  sttModel: z.string().default('whisper-1'),
  ttsModel: z.string().default('tts-1'),
  ttsVoice: z.string().default('nova'),
  systemPromptInterview: z.string(),
  systemPromptFeedback: z.string(),
  systemPromptRoadmap: z.string(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string().uuid(),
});

export type AIConfig = z.infer<typeof AIConfigSchema>;

export const UpdateAIConfigSchema = AIConfigSchema.partial().omit({
  id: true,
  updatedAt: true,
  updatedBy: true,
});

export type UpdateAIConfigInput = z.infer<typeof UpdateAIConfigSchema>;

// ============================================
// Export all schemas as a single object for easy importing
// ============================================

export const schemas = {
  UserRole,
  ApplicationStatus,
  TestType,
  QuestionType,
  InterviewStatus,
  InterviewCategory,
  DriveStatus,
  EmploymentType,
  SkillCategory,
  NotificationType,
  PaginationParams,
  RegisterSchema,
  LoginSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  TokenResponse,
  RefreshTokenSchema,
  UserSchema,
  StudentProfileSchema,
  UpdateStudentProfileSchema,
  TpoProfileSchema,
  AdminProfileSchema,
  CollegeSchema,
  CreateCollegeSchema,
  SkillSchema,
  CreateSkillSchema,
  StudentSkillSchema,
  AddStudentSkillSchema,
  CompanySchema,
  CreateCompanySchema,
  PlacementDriveSchema,
  CreateDriveSchema,
  UpdateDriveSchema,
  DriveListParams,
  ApplicationSchema,
  ApplyToDriveSchema,
  UpdateApplicationStatusSchema,
  ApplicationFilters,
  ResumeSchema,
  ResumeParsedDataSchema,
  ResumeScoreSchema,
  ResumeScreeningResultSchema,
  TestSchema,
  CreateTestSchema,
  QuestionSchema,
  CreateQuestionSchema,
  BulkCreateQuestionsSchema,
  StudentQuestionSchema,
  TestAttemptSchema,
  StartTestSchema,
  SubmitTestAnswerSchema,
  SubmitTestSchema,
  TestResultSchema,
  InterviewSchema,
  StartInterviewSchema,
  InterviewQuestionSchema,
  InterviewAnswerSchema,
  InterviewFeedbackSchema,
  WSMessageType,
  WSMessageSchema,
  WSQuestionPayloadSchema,
  WSAnswerPayloadSchema,
  RoadmapSchema,
  NotificationSchema,
  SendNotificationSchema,
  StudentReportSchema,
  DriveReportSchema,
  TpoDashboardStatsSchema,
  AdminDashboardStatsSchema,
  AIConfigSchema,
  UpdateAIConfigSchema,
};

export type Schemas = typeof schemas;