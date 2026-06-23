# NEARA SYSTEM DIRECTIVE & PRD

## PROJECT OVERVIEW
Build a modern professional marketplace platform that connects clients with verified professionals.
The platform helps people find trusted professionals for construction, engineering, architecture, design, and related services.
The platform's mission is: "Helping clients find trusted professionals while helping professionals acquire qualified project opportunities."

## TARGET PROFESSIONALS
V1 Professional Categories: Architects, Civil Engineers, Structural Engineers, Electrical Engineers, Mechanical Engineers, Contractors, Interior Designers.
Future: Landscape Architects, Surveyors, Quantity Surveyors, Project Managers, Construction Consultants, Building Inspectors.

## TARGET CLIENTS
People who need: House Design, House Construction, Renovation Projects, Commercial Buildings, Interior Design, Engineering Services, Construction Consultation.

## BUSINESS MODEL
**CLIENTS**: Use platform for free. Browse, search, view portfolios/reviews, post projects, request professionals, chat after request acceptance. No subscription required.
**PROFESSIONALS**: Purchase credits. Do NOT pay monthly subscriptions, registration fees, profile fees, portfolio fees, or viewing fees. ONLY spend credits when accepting a client request.

## CLIENT REQUEST FLOW
1. Client logs in.
2. Client browses professionals.
3. Client views profile.
4. Client reviews portfolio.
5. Client sends request.
6. Professional receives request.
7. Professional accepts request.
8. Credits are deducted.
9. Private chat opens.
10. Communication begins.

## IMPORTANT REQUEST RULES
Clients cannot spam professionals. Per project: Maximum 3 professional requests.
Clients must verify: Phone Number (Required). Future support: Government ID Verification.
Professionals must see: Client Name, Budget Range, Location, Project Type before accepting.

## USER TYPES
- **CLIENT**: Browse, search, view portfolios, create projects, send requests, chat after acceptance, leave reviews.
- **PROFESSIONAL**: Create profile, upload portfolio, receive/accept/decline requests, purchase credits, chat with clients, manage profile.
- **ADMIN**: Verify professionals, manage users, moderate content, manage payments/credits, review reports, view analytics.

## AUTHENTICATION
Primary Authentication: Google Sign-In. No traditional registration forms. Flow: Continue with Google -> Create account automatically -> Proceed to onboarding.

## ONBOARDING
- **CLIENT**: Full Name, Phone Number, Province, City. Then immediate access.
- **PROFESSIONAL**: Full Name, Phone Number, Profession, Years Experience, Province, City, About Me, Service Areas, PRC License Number, PRC License Upload, Government ID Upload. Status: Pending Verification, Approved, Rejected.

## PROFESSIONAL PROFILE
Profile Photo, Cover Banner, Verification Badge, Profession, Specialization, Experience, About Section, Service Areas, Portfolio, Reviews, Ratings, Completed Projects, Response Rate, Response Time. CTA: Request Consultation.

## PORTFOLIO SYSTEM
Item Fields: Title, Description, Category, Cover Image, Gallery Images, Project Location, Completion Date. Support: Multiple Images, Image Optimization, Lazy Loading.

## PROJECT SYSTEM
Clients create projects. Fields: Project Title, Project Description, Budget Range, Location, Timeline, Attachments. Statuses: Draft, Open, In Review, Matched, Closed.

## REQUEST SYSTEM
Client sends request. Professional receives notification. Professional can Accept/Decline. Accepting consumes credits. Declining is free.

## CREDIT SYSTEM
Credits act as platform currency. Admin configurable packages (e.g., 10, 50, 100 Credits). Accepting requests deducts credits (configurable by project type).

## PAYMENT SYSTEM
Use Xendit. Support: GCash, Maya, Online Banking, Credit Cards. Track: Payments, Credit Purchases, Receipts, Payment History.

## CHAT SYSTEM
Realtime messaging. Support: Text Messages, Image Uploads, File Attachments, Read Receipts, Timestamps, Notifications. Chat opens after request acceptance.

## REVIEW SYSTEM
Clients can leave reviews (Rating, Comment). Rules: Only clients with accepted requests can review. Prevent fake reviews.

## NOTIFICATION SYSTEM
- **In-App**: Request Received, Request Accepted, Credits Low, Verification Approved.
- **Email**: Welcome, Request Notifications, Payment Receipts, Verification Updates.

## ADMIN DASHBOARD
Dashboard Overview, User Management, Professional Verification, Financial Management, Analytics.

## SEARCH SYSTEM
Search by: Profession, City, Province, Experience, Rating. Filters: Verified Only, Profession, Location, Experience Range. Must be optimized.

## DATABASE
PostgreSQL. Prisma schema. Tables: users, client_profiles, professional_profiles, professional_documents, portfolio_projects, projects, project_requests, conversations, messages, reviews, credits, credit_transactions, payments, notifications, reports, audit_logs.

## STORAGE
Cloudflare R2 for photos, portfolios, IDs, licenses, attachments. Secure uploads.

## REALTIME
Supabase Realtime for Chat, Notifications, Live Updates.

## EMAIL
Resend for templates.

## MAPS
Mapbox for Professional Locations, Service Areas, Project Locations.

## ANALYTICS & MONITORING
Google Analytics, Microsoft Clarity, Sentry.

## SECURITY
RBAC, Rate Limiting, Input Validation, CSRF/XSS Protection, Secure Uploads, Audit Logging.

## PERFORMANCE & SEO
Lighthouse 90+, Optimized Images, Lazy Loading, Code Splitting, Server Components. Metadata, Open Graph, JSON-LD, Sitemap, Robots.txt.

## DESIGN SYSTEM
Premium, Modern, Minimal, Clean, Enterprise Grade. Reference: Stripe, Linear, Vercel.
Tailwind CSS, shadcn/ui, Framer Motion. Mobile First, Fully Responsive, Accessible.

## TECH STACK
Next.js 15, React 19, TypeScript, Tailwind, shadcn/ui, Framer Motion, Better Auth, Prisma, PostgreSQL, Supabase Realtime, Cloudflare R2, Xendit, Resend, Mapbox, Sentry.
