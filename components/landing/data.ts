import { Challenge, Solution, Feature, Integration, PricingPlan, FaqItem, NavItem } from './types';

export const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How it works', href: '#how' },
];

export const challenges: Challenge[] = [
  {
    id: 'ch-triage',
    icon: 'time',
    title: 'Hours spent on manual CV triage',
    description: 'Recruiters drown in hundreds of resumes per role, spending hours scanning files manually and losing top candidates in the noise.'
  },
  {
    id: 'ch-alignment',
    icon: 'chat',
    title: 'Misalignment with hiring managers',
    description: 'Feedback is scattered across Slack, emails, and meeting notes, slowing down screening decisions and extending time-to-hire.'
  },
  {
    id: 'ch-compliance',
    icon: 'shield',
    title: 'Lack of audit trail and compliance',
    description: 'No single record of why candidates were selected, rejected, or moved, risking compliance issues and making processes hard to audit.'
  }
];

export const solutions: Solution[] = [
  {
    id: 'sol-triage',
    badge: 'AI CV Triage',
    title: 'Extract structured facts automatically',
    description: 'TalentFlow extracts experience, skills, and compensation signals in seconds, creating decision-ready candidate summaries.',
    challengeId: 'ch-triage'
  },
  {
    id: 'sol-alignment',
    badge: 'Shared Fit Scorecard',
    title: 'Collaborate around a single candidate dossier',
    description: 'Recruiters and hiring managers view the same structured evidence, scoring notes, and feedback in a shared workspace.',
    challengeId: 'ch-alignment'
  },
  {
    id: 'sol-compliance',
    badge: 'Built-in Audit Trail',
    title: 'First-class recruiter overrides & logs',
    description: 'AI scoring is explainable and completely overridable. Every modification is logged with notes and timestamps for governance.',
    challengeId: 'ch-compliance'
  }
];

export const features: Feature[] = [
  {
    badgeStyle: 'screening',
    badgeText: 'AI CV Parsing',
    title: 'Structured profiles in seconds',
    description: 'Extract experience, seniority, skills, education, compensation signals, and missing evidence from every uploaded resume.'
  },
  {
    badgeStyle: 'offer',
    badgeText: 'Semantic Scoring',
    title: 'Scores with visible reasoning',
    description: 'Each AI score includes matched skills, gaps, risk flags, and recruiter override history so teams can audit decisions.'
  },
  {
    badgeStyle: 'applied',
    badgeText: 'Kanban Pipeline',
    title: 'Move fast without losing context',
    description: 'Drag candidates through role-specific stages while notes, interview packs, and automation triggers follow the card.'
  },
  {
    badgeStyle: 'interview',
    badgeText: 'Automated Comms',
    title: 'Keep candidates warm',
    description: 'Send templated updates, interview reminders, rejection messages, and hiring-manager nudges from the same workspace.'
  },
  {
    badgeStyle: 'open',
    badgeText: 'Real-time Updates',
    title: 'Every stakeholder sees the latest state',
    description: 'Recruiters, interviewers, and admins get role-aware navigation and alerts for the work they own.'
  },
  {
    badgeStyle: 'closed',
    badgeText: 'Audit Trail',
    title: 'Govern the hiring process',
    description: 'Track scoring changes, stage moves, plan usage, data exports, and workspace permission changes.'
  }
];

export const integrations: Integration[] = [
  {
    name: 'LinkedIn',
    category: 'Job Board',
    logoMark: 'LI',
    description: 'Sync candidate profiles and applications directly.'
  },
  {
    name: 'Google Calendar',
    category: 'Calendar',
    logoMark: 'GC',
    description: 'Automate interview scheduling and link coordination.'
  },
  {
    name: 'Slack',
    category: 'Communication',
    logoMark: 'SL',
    description: 'Get real-time updates when candidate stages change.'
  },
  {
    name: 'BambooHR',
    category: 'HRIS',
    logoMark: 'BH',
    description: 'Sync hired candidate files to your HR backend.'
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Personal',
    badge: 'closed',
    price: 'Free',
    period: 'free',
    description: 'One recruiter, two active jobs, AI parsing preview, and candidate notes.',
    features: ['1 Recruiter seat', '2 Active jobs', 'AI parsing preview', 'Candidate notes'],
    ctaText: 'Start Free',
    ctaHref: '/signup'
  },
  {
    name: 'Plus',
    badge: 'screening',
    price: '$49',
    period: '/ seat',
    description: 'For individual recruiters and freelancers. Expanded limits and AI scoring.',
    features: ['Unlimited active jobs', 'Expanded CV parsing limits', 'Candidate synthesis', 'Kanban automations', 'AI scoring & explainability'],
    ctaText: 'Choose Plus',
    ctaHref: '/signup',
    isPopular: true
  },
  {
    name: 'Business',
    badge: 'open',
    price: 'Custom',
    period: 'Custom',
    description: 'Enterprise features including admin workspace creation, SSO, and audit exports.',
    features: ['Admin workspace creation', 'Invite recruiters/interviewers', 'SSO authentication', 'Audit history exports', 'Dedicated support'],
    ctaText: 'Contact Sales',
    ctaHref: '/billing'
  }
];

export const faqItems: FaqItem[] = [
  {
    question: "How does AI scoring work?",
    answer: "Scores compare resume evidence to the job requirements and show matched skills, gaps, and confidence notes."
  },
  {
    question: "Can hiring managers use a lighter workspace?",
    answer: "Yes. Interviewers see interviews, candidate dossiers, feedback tasks, and relevant jobs without admin surfaces."
  },
  {
    question: "Do admins get audit history?",
    answer: "Workspace admins can review role changes, exports, billing events, automations, and AI override history."
  },
  {
    question: "Can we customize pipeline stages?",
    answer: "Each job can reorder stages, add review steps, and map automations to stage movement."
  },
  {
    question: "Does it support bulk CV upload?",
    answer: "Bulk upload, email ingestion, and job-board ingestion are supported in Plus and Business plans."
  },
  {
    question: "Can recruiters override the AI?",
    answer: "Yes. Overrides are first-class and kept in the audit trail with notes and timestamps."
  }
];

export const testimonials = [
  {
    quote: "We cut the first review loop from two days to one morning, and the score explanation made hiring managers trust the shortlist.",
    author: "Ari Lane",
    role: "VP People",
    company: "Novaware"
  },
  {
    quote: "The candidate dossier changed our interview prep. Interviewers arrive with evidence instead of resume guesses.",
    author: "Priya Raman",
    role: "Eng Director",
    company: "Cloudkit"
  },
  {
    quote: "Admin can finally see automation, roles, exports, and billing without asking recruiting ops for a spreadsheet.",
    author: "Marcus Ito",
    role: "COO",
    company: "Axiom Data"
  }
];

export const impactMetrics = [
  {
    value: '50%',
    description: 'Faster first-pass triage for high-volume roles.',
    icon: 'time'
  },
  {
    value: '85%',
    description: 'Extraction accuracy target for structured candidate facts.',
    icon: 'check'
  },
  {
    value: '4.7h',
    description: 'Average weekly recruiter admin time saved per open role.',
    icon: 'calendar'
  },
  {
    value: '3',
    description: 'Role-specific workspaces for recruiters, interviewers, and admins.',
    icon: 'users'
  }
];
