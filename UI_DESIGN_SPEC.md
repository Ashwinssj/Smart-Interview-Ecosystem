# Smart Interview Ecosystem - UI Design Specification & Image Generation Prompts

## Design System Foundation

### Color Palette (Consistent Across All Portals)
```
Primary: #0F172A (Slate-950) - Deep navy for trust/authority
Primary Light: #1E293B (Slate-800)
Accent: #0EA5E9 (Sky-500) - Clean tech blue, not purple
Accent Hover: #0284C7 (Sky-600)
Accent Light: #E0F2FE (Sky-50)
Success: #10B981 (Emerald-500)
Warning: #F59E0B (Amber-500)
Error: #EF4444 (Red-500)
Background: #F8FAFC (Slate-50)
Surface: #FFFFFF
Surface Elevated: #FFFFFF with shadow
Text Primary: #0F172A (Slate-950)
Text Secondary: #475569 (Slate-600)
Text Muted: #94A3B8 (Slate-400)
Border: #E2E8F0 (Slate-200)
Border Strong: #CBD5E1 (Slate-300)
```

### Typography
- **Display/Headlines**: `Cabinet Grotesk` or `Satoshi` - `text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none font-semibold`
- **Section Titles**: `text-2xl md:text-3xl tracking-tight font-semibold`
- **Body**: `text-base leading-relaxed text-slate-600 max-w-[65ch]`
- **UI Labels**: `text-sm font-medium text-slate-700`
- **Mono**: `JetBrains Mono` for data/numbers

### Spacing System
- Section gap: `py-20 md:py-28 lg:py-32`
- Container: `max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8`
- Card padding: `p-6 md:p-8`
- Radius: `rounded-2xl` (cards), `rounded-xl` (buttons), `rounded-full` (pills)

### Shadows
- Subtle: `shadow-[0_1px_3px_rgba(15,23,42,0.08)]`
- Card: `shadow-[0_4px_20px_-4px_rgba(15,23,42,0.1)]`
- Elevated: `shadow-[0_20px_40px_-15px_rgba(15,23,42,0.15)]`

---

## PORTAL 1: PUBLIC LANDING PAGE (6 Sections)

### Section 1 of 6: Hero - "Centered Low Over Full-Bleed Atmosphere"
**Composition Anchor**: Bottom-left text over background image
**Background Mode**: Full-bleed cinematic image with dark tonal overlay
**Hero Scale**: Giant Statement
**Narrative Spine**: "Stage/Spotlight" - student stepping into confidence

**Visual Description**:
Wide horizontal frame (21:9). Deep navy-to-slate gradient background with subtle atmospheric photo of a modern university campus/library bleeding through at 15% opacity - blurred, tonal, not distracting. Bottom-left quadrant: Strong headline in Cabinet Grotesk, 5-6 words max: "Where Preparation Meets Opportunity". Sub-headline in 2 lines max, slate-300: "AI-powered placement platform. Real interviews. Real feedback. Real results." Single primary CTA: Sky-500 pill button "Start Your Journey" with subtle inner glow. Top-right: Minimal nav - logo left, "For Students", "For Colleges", "Login" right. No clutter. Generous negative space.

**Image Generation Prompt**:
```
Professional website hero section design, 21:9 aspect ratio, deep slate-950 background with subtle atmospheric university campus photography bleeding through at low opacity, tonal dark overlay. Bottom-left composition: bold headline "Where Preparation Meets Opportunity" in premium Cabinet Grotesk typography, tracking-tight, white color. Sub-headline in slate-300, readable. Single sky-blue primary CTA button with subtle inner border highlight. Clean minimal navigation top bar. Generous negative space, premium editorial feel, high contrast, cinematic lighting. No purple gradients, no AI blobs, no floating orbs. Implementation-ready UI reference.
```

---

### Section 2 of 6: Trust Bar - "Institutional Credibility"
**Composition Anchor**: Centered horizontal strip
**Background Mode**: Solid surface with subtle texture
**Signature Component**: Infinite Brand Marquee Strip (slow, dignified)

**Visual Description**:
Clean horizontal band. Slate-50 background with barely visible dotted grid pattern. Row of 6-8 college/company logos in monotone slate-600, evenly spaced, infinite slow marquee animation implied. Above: tiny label "TRUSTED BY" in uppercase, tracking-widest, text-xs, slate-400. Below: subtle divider line. Breathing room top/bottom.

**Image Generation Prompt**:
```
Clean trust bar section for website, horizontal 16:9, slate-50 background with subtle dotted grid texture. Centered "TRUSTED BY" label in uppercase micro typography, slate-400. Row of 8 institutional logos (universities/companies) in monotone slate-600, evenly spaced, implying slow marquee motion. Minimal divider line below. Generous vertical padding. Premium, authoritative, not cluttered. Implementation-ready reference.
```

---

### Section 3 of 6: How It Works - "Asymmetric Editorial Steps"
**Composition Anchor**: Off-grid editorial offset (alternating)
**Background Mode**: Alternating solid / editorial side-image
**Signature Component**: Off-Grid Editorial Layout

**Visual Description**:
Three-step flow, each step alternating layout. Step 1: Left - large step number "01" in Monument-style compressed type, slate-200, behind headline "Build Your Profile". Right - editorial photo of student on laptop, 4:3 crop, rounded-2xl. Step 2: Inverted - image left (resume document close-up), content right: "AI Resume Matching". Step 3: Image right (AI avatar interview), content left: "Mock Interviews & Feedback". Each step has 3-line description, slate-600. Sky-500 accent line under each headline. Generous gaps between steps.

**Image Generation Prompt**:
```
Three-step "How It Works" section, horizontal 16:9, alternating asymmetric editorial layout. Step 1: left content (large compressed "01" numeral slate-200, headline "Build Your Profile", 3-line description), right editorial photo student on laptop 4:3 rounded-2xl. Step 2: inverted - left resume document close-up, right content "AI Resume Matching". Step 3: right AI avatar interview scene, left content "Mock Interviews & Feedback". Sky-blue accent lines under headlines. Slate-50/white alternating backgrounds. Generous spacing, premium editorial rhythm. Implementation-ready.
```

---

### Section 4 of 6: Features - "Pristine Gapless Bento Grid"
**Composition Anchor**: Centered grid
**Background Mode**: Solid surface
**Signature Component**: Pristine Gapless Bento Grid

**Visual Description**:
4-column bento grid (2 rows), mathematically clean, no accidental gaps. Top row: 2 wide cards (2-col span each). Bottom row: 4 equal cards. Cards: white surface, slate-200 border, rounded-2xl, p-8. Top-left: "AI Resume Screening" - icon + headline + 2-line desc + "Learn more" underline link. Top-right: "Adaptive Assessments". Bottom row icons: "Voice Interviews", "Personalized Roadmaps", "Analytics Dashboard", "Mobile Ready". Subtle hover state implied on one card (slight elevation, sky-50 border). Labels below cards, not inside.

**Image Generation Prompt**:
```
Pristine gapless bento grid features section, horizontal 16:9, white background. 4-column CSS grid, 2 rows. Top row: 2 wide cards spanning 2 columns each. Bottom row: 4 equal cards. Cards: white surface, slate-200 hairline border, rounded-2xl, generous padding. Clean icons (phosphor style), headlines, 2-line descriptions, underline link CTAs. Labels positioned below cards externally. One card showing subtle hover elevation with sky-blue border accent. Mathematical precision, gallery-like presentation. No shadows clutter. Implementation-ready.
```

---

### Section 5 of 6: Testimonials - "Split Quote Wall"
**Composition Anchor**: Split screen (60/40)
**Background Mode**: Editorial side-image
**Signature Component**: Split Testimonial Quote Wall

**Visual Description**:
Left 60%: Large testimonial card, white, rounded-2xl, p-10. Quote in Cabinet Grotesk, text-2xl, slate-900. "The AI interview felt more real than my actual company interview. The feedback on my system design answers changed how I prepare." - Priya Sharma, CSE 2024, placed at Microsoft. Avatar: creative photo placeholder (not generic egg). Right 40%: Vertical stack of 3 mini-cards, each with 1-line quote + name/role, slate-100 background, rounded-xl. Subtle navigation dots implied.

**Image Generation Prompt**:
```
Testimonial section, horizontal 16:9, split 60/40 editorial layout. Left: large white testimonial card rounded-2xl, generous padding. Premium quote in Cabinet Grotesk text-2xl slate-900: "The AI interview felt more real than my actual company interview. The feedback on my system design answers changed how I prepare." Attribution: "Priya Sharma, CSE 2024, placed at Microsoft" with creative photo avatar (not generic). Right: vertical stack of 3 compact slate-100 cards rounded-xl, each with 1-line quote + name. Subtle pagination dots. Clean, credible, not carousel-cluttered. Implementation-ready.
```

---

### Section 6 of 6: CTA + Footer - "Mini Minimalist Close"
**Composition Anchor**: Stacked center
**Background Mode**: Bold color field (Slate-950)
**Hero Scale**: Mini Minimalist

**Visual Description**:
Slate-950 background. Centered stack: Tiny logo, headline "Ready to crack your dream placement?" in white, tracking-tight. Sub-text slate-400, 1 line. Primary CTA: Sky-500 pill "Get Started Free". Secondary: Ghost outline "For Colleges" side-by-side with 16px gap. Below: 60px gap, footer - 4-column link groups, slate-400 text, logo bottom center. Clean, decisive, no noise.

**Image Generation Prompt**:
```
Final CTA + footer section, horizontal 16:9, mini minimalist. Slate-950 background. Centered stack: tiny logo, white headline "Ready to crack your dream placement?" tracking-tight. Slate-400 sub-text. Two CTAs side-by-side: sky-500 primary pill "Get Started Free", ghost outline "For Colleges". Generous gap to 4-column footer links slate-400. Logo bottom center. Decisive, clean, confident restraint. No clutter. Implementation-ready.
```

---

## PORTAL 2: STUDENT DASHBOARD (Key Screens)

### Screen A: Student Dashboard - "Mission Control"
**Composition Anchor**: Asymmetric bento (70/30 split)
**Background Mode**: Solid surface with subtle grid
**Visual Density**: Daily App Mode (VISUAL_DENSITY: 5)

**Visual Description**:
Left 70%: Three-row bento. Row 1: Wide "Active Application" card - company logo, role, CTC, status badge (sky-500 "AI Interview Scheduled"), progress stepper (4/5 steps complete), "Prepare Now" CTA. Row 2: Two cards side-by-side - "Upcoming Test" (aptitude, timer icon, date) + "Resume Score" (78% with circular progress, sky-500). Row 3: "Preparation Roadmap" - Week 1-4 pills, current week highlighted. Right 30%: Vertical stack - "Quick Actions" (Upload Resume, Practice Test, Mock Interview), "Recent Activity" feed (3 items), "Placement Stats" (3 metrics: 12 drives, 5 applied, 2 shortlisted).

**Image Generation Prompt**:
```
Student dashboard "mission control", horizontal 16:9, asymmetric 70/30 bento layout. Slate-50 background with subtle grid. Left 70%: three-row bento grid. Row 1: wide card "Active Application" - company logo, role, CTC, sky-blue status badge "AI Interview Scheduled", 4-step progress stepper (step 4 active), sky-blue CTA "Prepare Now". Row 2: two cards - "Upcoming Test" with timer/date, "Resume Score 78%" with circular progress ring sky-blue. Row 3: "Preparation Roadmap" - 4 week pills, week 2 highlighted sky-blue. Right 30%: vertical stack - "Quick Actions" icon buttons, "Recent Activity" 3-line feed, "Placement Stats" 3 metrics. Clean slate-950 text, sky-blue accent. Implementation-ready SaaS dashboard.
```

---

### Screen B: Placement Drives Listing - "Editorial Card Gallery"
**Composition Anchor**: Gallery-led visual cadence
**Background Mode**: Solid surface
**Signature Component**: Diagonal Staggered Square Masonry (adapted for cards)

**Visual Description**:
Top bar: Search + filters (Department, CTC Range, Type) - clean, aligned right. Grid of drive cards, 3-col desktop, staggered vertical rhythm (not uniform). Each card: white, rounded-2xl, border slate-200, p-6. Top: company logo + "NEW" badge. Headline: role + company. Meta row: location • CTC • deadline. Tags: required skills (3 max, +N). Progress bar: applications/positions. Footer: "View Details" underline link. Hover: subtle elevation, sky-50 border. Empty state: centered illustration + "No drives match your filters".

**Image Generation Prompt**:
```
Placement drives listing page, horizontal 16:9. Top bar: search input + filter pills (Department, CTC, Type) aligned right. Main area: 3-column staggered masonry grid of drive cards. Cards: white, rounded-2xl, slate-200 border, generous padding. Company logo + "NEW" badge. Role + company headline. Meta: location • CTC • deadline. Skill tags (3 max). Progress bar applications/positions. "View Details" underline link. One card showing hover state (subtle elevation, sky-blue border). Clean typography, sky-blue accent. Staggered vertical rhythm, not uniform rows. Implementation-ready.
```

---

### Screen C: AI Mock Interview Interface - "Cinematic Stage"
**Composition Anchor**: Image-as-canvas with text overlaid
**Background Mode**: Full-bleed cinematic with tonal overlay
**Hero Scale**: Giant Statement (for the interview viewport)
**MOTION_INTENSITY**: 8 (perpetual micro-interactions)

**Visual Description**:
Full viewport (simulated 16:9). Dark mode (slate-950). Center: AI Avatar - stylized abstract human form, sky-blue gradient mesh, subtle breathing animation implied. Bottom-center safe area: Transcript scrolling up - interviewer question in slate-300, student answer in white. Bottom-most: Audio visualization bar (sky-blue frequency bars) + "Listening..." label. Top-right: Timer (12:34), question counter (3/10). Top-left: Drive context (company • role). Left edge: Vertical progress dots (3 filled, 7 empty). Right edge: "End Interview" ghost button. Immersive, focused, no chrome.

**Image Generation Prompt**:
```
AI mock interview interface, cinematic full-viewport 16:9, dark mode slate-950. Center: stylized AI avatar - abstract human form with sky-blue gradient mesh, subtle breathing pulse implied. Bottom-center overlay safe area: transcript conversation - interviewer question slate-300, student answer white. Bottom audio visualization: sky-blue frequency bars animating, "Listening..." label. Top-right: timer 12:34, question 3/10. Top-left: context "Microsoft • SDE Intern". Left edge: vertical progress dots (3 filled sky-blue, 7 empty slate-700). Right edge: ghost "End Interview" button. Immersive, focused, premium. No generic dashboard chrome. Implementation-ready.
```

---

### Screen D: Interview Feedback - "Artifact/Dossier"
**Composition Anchor**: Off-grid editorial
**Background Mode**: Quiet textured paper feel
**Narrative Spine**: "Archive/Dossier" - indexed, authoritative

**Visual Description**:
Left 2/3: Feedback report. Header: Overall score large (87) in Monument compressed, sky-blue. 4 metric bars horizontal: Communication 92, Technical 85, Problem Solving 88, Relevance 82 - each with thin sky-blue bar. Tabs: Strengths | Weaknesses | Recommendations. Strengths open: 3 cards with check icons, clean descriptions. Right 1/3: Roadmap preview - "Your 4-Week Plan", Week 1-4 cards with focus areas, checkable tasks. Bottom: "Download Report" + "Start Week 1" CTAs.

**Image Generation Prompt**:
```
Interview feedback report, horizontal 16:9, off-grid editorial dossier layout. Left 2/3: white card paper texture subtle. Large overall score "87" Monument compressed sky-blue. 4 horizontal metric bars: Communication 92, Technical 85, Problem Solving 88, Relevance 82 with thin sky-blue fills. Tabs: Strengths | Weaknesses | Recommendations. Strengths panel: 3 clean items with check icons. Right 1/3: "Your 4-Week Plan" - Week 1-4 cards with focus areas, checkable tasks. Bottom CTAs: "Download Report" (sky-blue), "Start Week 1" (outline). Authoritative, archival, clean. Implementation-ready.
```

---

## PORTAL 3: TPO DASHBOARD (Key Screens)

### Screen E: TPO Dashboard - "Command Center"
**Composition Anchor**: Swiss grid discipline
**Background Mode**: Solid surface
**Visual Density**: Cockpit Mode (VISUAL_DENSITY: 8) - packed but clean

**Visual Description**:
Top: 5 metric cards in single row - Total Students (1,247), Active Drives (8), Applications (342), Shortlisted (89), Placed (23). Numbers: JetBrains Mono, text-3xl, slate-950. Labels: text-sm, slate-500. Below: 2-col layout. Left 65%: "Drive Pipeline" - horizontal funnel chart (Applied → Screened → Tested → Interviewed → Forwarded → Placed) with numbers at each stage, sky-blue flow. Right 35%: "Recent Activity" feed (6 items) + "Quick Actions" (Create Drive, Send Notification, Generate Report). Clean lines, minimal cards, border-t separators.

**Image Generation Prompt**:
```
TPO dashboard command center, horizontal 16:9, Swiss grid discipline, cockpit density. Top row: 5 metric cards border-separated, numbers JetBrains Mono text-3xl slate-950: 1,247 Students, 8 Active Drives, 342 Applications, 89 Shortlisted, 23 Placed. Below: 2-col 65/35. Left: "Drive Pipeline" horizontal funnel - Applied 342 → Screened 156 → Tested 112 → Interviewed 89 → Forwarded 45 → Placed 23, sky-blue flow lines. Right: "Recent Activity" 6-line feed + "Quick Actions" icon buttons. Clean slate-200 dividers, no card shadows, monospace numbers. Sky-blue accent. Implementation-ready.
```

---

### Screen F: Drive Management - "Data Table Mastery"
**Composition Anchor**: Left-aligned content, right-aligned actions
**Background Mode**: Solid surface

**Visual Description**:
Toolbar: "Create Drive" primary (sky-blue) + "Export" ghost + search. Table: columns - Company (logo + name), Role, Type, CTC, Deadline, Status (badge), Applications, Actions. 6 rows visible. Row hover: slate-50. Status badges: Published (sky-blue), Draft (slate), Closed (amber), Completed (emerald). Actions: View (underline), Edit (icon), Delete (icon, slate-400). Pagination bottom. Clean, dense, scannable.

**Image Generation Prompt**:
```
Drive management table, horizontal 16:9, data-dense clean. Toolbar: sky-blue "Create Drive" primary, ghost "Export", search right. Table: columns Company (logo+name), Role, Type, CTC, Deadline, Status badge, Applications, Actions. 6 data rows. Row hover slate-50. Status badges: Published sky-blue, Draft slate, Closed amber, Completed emerald. Actions: View underline, Edit icon, Delete icon slate-400. Pagination bottom. JetBrains Mono for numbers. Slate-200 dividers. No card boxes. Implementation-ready.
```

---

## PORTAL 4: ADMIN DASHBOARD (Key Screens)

### Screen G: Admin Dashboard - "System Observatory"
**Composition Anchor**: Asymmetric premium marketing flow
**Background Mode**: Solid + inline asset (system architecture diagram)

**Visual Description**:
Top: 4 metrics - Total Users, Colleges, Drives, Interviews Completed. Left 60%: "System Health" - 3 panels: API Latency (sparkline), Active Sessions (counter), Storage Used (progress ring). Right 40%: "User Growth" - area chart 12 months, sky-blue gradient fill. Below: "Recent System Events" - timeline 5 items (new college, drive created, interview completed, etc.) with timestamps. Clean, operational, trustworthy.

**Image Generation Prompt**:
```
Admin system observatory dashboard, horizontal 16:9. Top: 4 metrics cards. Left 60%: "System Health" - 3 panels: API Latency sparkline, Active Sessions counter, Storage Used progress ring sky-blue. Right 40%: "User Growth" 12-month area chart sky-blue gradient fill. Below: "Recent System Events" vertical timeline 5 items with timestamps and icons. Clean operational aesthetic, slate-950 text, sky-blue accent, subtle dividers. Trustworthy, not flashy. Implementation-ready.
```

---

### Screen H: User Management - "Clean CRUD"
**Composition Anchor**: Split screen with side panel
**Background Mode**: Solid surface

**Visual Description**:
Left 70%: User table with role tabs (All | Students | TPOs | Admins). Columns: Avatar, Name, Email, Role, College, Status, Last Active, Actions. Right 30%: Slide-over panel (shown open) - "Create User" form: Role select, Email, Name, College select, Password, "Create" primary. Table rows: hover slate-50. Role badges colored: Student (sky), TPO (emerald), Admin (amber). Status: Active/Inactive toggle.

**Image Generation Prompt**:
```
User management admin panel, horizontal 16:9, split 70/30 with slide-over panel. Left: role tabs (All/Students/TPOs/Admins), user table columns: Avatar, Name, Email, Role badge, College, Status toggle, Last Active, Actions. Role badges: Student sky-blue, TPO emerald, Admin amber. Right slide-over panel open: "Create User" form - Role select, Email, Name, College select, Password, sky-blue "Create" button. Clean form layout, labels above inputs. Row hover slate-50. Implementation-ready.
```

---

## AUTH SCREENS (Shared)

### Screen I: Login / Register - "Editorial Split"
**Composition Anchor**: Asymmetric split (50/50)
**Background Mode**: Editorial side-image (left) + clean form (right)
**Hero Scale**: Mid Editorial

**Visual Description**:
Left 50%: Full-bleed editorial photo - student confident in interview setting, duotone treated in slate/sky palette. Right 50%: White surface, centered form container max-w-md. Logo. Headline: "Welcome back" / "Create your account". Form: Email, Password, "Forgot?" link. Primary CTA full-width sky-blue. Divider "or continue with". Google/GitHub outline buttons. Bottom: "New here? Sign up" / "Have account? Login". Clean, breathable, conversion-focused.

**Image Generation Prompt**:
```
Auth screen (login/register), horizontal 16:9, asymmetric 50/50 editorial split. Left: full-bleed duotone editorial photo student in interview setting, slate/sky palette. Right: white surface, centered form max-w-md. Logo, headline "Welcome back", email/password inputs labels above, "Forgot?" link, full-width sky-blue primary CTA. Divider "or continue with". Google/GitHub outline buttons. Bottom switch link. Generous spacing, conversion-focused, premium. Implementation-ready.
```

---

## DESIGN VARIANTS FOR A/B SELECTION

### Variant 1: "Pristine Light" (Current Spec Above)
- Light mode primary, sky-blue accent, Cabinet Grotesk, editorial photography
- Best for: Trust, clarity, institutional adoption

### Variant 2: "Deep Dark Mode"
- Slate-950 background, slate-800 surfaces, sky-400 accent, Geist Mono
- Hero: Giant Statement, bottom-left over atmospheric campus night photo
- Best for: Student portal (long sessions), modern tech feel

### Variant 3: "Bold Studio Solid"
- Primary: #1E3A8A (Blue-900) background, Blue-50 surfaces, Amber-400 accent
- Hero: Mini Minimalist, massive compressed type "PLACEMENT REDEFINED"
- Best for: Marketing differentiation, bold brand statement

### Variant 4: "Quiet Premium Neutral"
- Stone-100 background, White surfaces, Emerald-600 accent, Satoshi
- Hero: Mid Editorial, centered low over paper-texture hero image
- Best for: Calm, premium, "expensive" feel

---

## IMAGE GENERATION CHECKLIST (Per Section)

For each image, verify:
- [ ] Horizontal aspect ratio (16:9 or 21:9)
- [ ] One section only, no multi-section collage
- [ ] Consistent palette across all images
- [ ] Cabinet Grotesk / Satoshi / Geist typography visible
- [ ] Sky-500 accent (not purple)
- [ ] Slate-950 dark text (not pure black)
- [ ] Generous spacing, not cramped
- [ ] Implementation-ready clarity (layout, hierarchy, components readable)
- [ ] Premium materials (paper texture, subtle gradients, clean borders)
- [ ] No AI slop: no floating orbs, no neon glows, no fake KPIs, no generic avatars
- [ ] Composition anchor varied from previous section
- [ ] Background mode varied from previous section
- [ ] Realistic copy (not "unleash/seamless/next-gen")

---

## RECOMMENDED GENERATION ORDER

1. **Start with Landing Hero (Section 1)** - Sets the brand tone
2. **Student Dashboard** - Most complex, validates component system
3. **AI Interview Interface** - Most unique/differentiated feature
4. **TPO Dashboard** - Validates data density handling
5. **Interview Feedback** - Validates report/roadmap design
6. **Drive Listing** - Validates card/list patterns
7. **Auth Screens** - Validates form/editorial split
8. **Admin Screens** - Validates operational UI
9. **Landing remaining sections** - Completes marketing site

---

## USAGE INSTRUCTIONS

Copy any prompt above into your preferred image generator (Midjourney v6, DALL-E 3, Stable Diffusion XL, Flux). For best results:

**Midjourney**: Add `--ar 16:9 --stylize 750 --v 6.0` (or `--ar 21:9` for hero)
**DALL-E 3**: Use "wide" aspect ratio, specify "professional UI design reference"
**Flux**: Use the prompt as-is, it follows instructions well

Generate 2-3 variations per screen, then select the one that best matches your vision. The prompts are designed to be implementation-ready references for developers.