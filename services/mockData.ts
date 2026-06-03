import { Invoice, CandidateFilters } from '../types';

// Local type for mock data that includes legacy UI fields
interface MockCandidate {
  id: string;
  name: string;
  fullName?: string;
  title: string;
  avatar: string;
  stage: string;
  score: number;
  scoreCategory: 'high' | 'mid' | 'low';
  skills: string[];
  appliedDate: string;
  email: string;
  phone?: string;
  summary: string;
  timeline: { id: string; date: string; user: string; action: string; notes?: string }[];
  scorecard: { criteria: string; score: number; notes: string }[];
  createdAt?: string;
  updatedAt?: string;
}

interface MockJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  employmentType?: string;
  status: string;
  applicantsCount: number;
  filledPipelines: number;
  createdAt: string;
  salaryRange: string;
  owner: string;
  description?: string;
  requirements?: string[];
  createdById?: string;
  updatedAt?: string;
}

const INITIAL_CANDIDATES: MockCandidate[] = [
  {
    id: '1',
    name: 'Maya Chen',
    title: 'Senior Frontend Engineer',
    avatar: 'MC',
    stage: 'screening',
    score: 94,
    scoreCategory: 'high',
    skills: ['React', 'Design Systems', 'TS'],
    appliedDate: 'May 29',
    email: 'maya.chen@example.dev',
    phone: '+1 415 555 0184',
    summary: 'Maya shows five years of React infrastructure work, component API ownership, accessibility remediation, and measurable build-performance wins. The strongest evidence maps to the platform charter; the unresolved gap is explicit enterprise security workflow experience.',
    timeline: [
      { id: 't1', date: 'May 29, 09:42', user: 'AI System', action: 'AI triage completed', notes: '94 score' },
      { id: 't2', date: 'May 29, 10:03', user: 'Avery Sloan', action: 'Moved to Screening' },
      { id: 't3', date: 'Jun 1, 09:00', user: 'Nora Walsh', action: 'Hiring manager requested', notes: 'review due Jun 1' }
    ],
    scorecard: [
      { criteria: 'Systems depth', score: 94, notes: 'Owned shared React primitives and component API migration across multiple product teams.' },
      { criteria: 'Accessibility', score: 90, notes: 'Led WCAG-focused fixes and described rollout strategy, QA gates, and adoption metrics.' },
      { criteria: 'Leadership', score: 82, notes: 'Shows concrete build and interaction-performance work rather than only feature delivery.' },
      { criteria: 'Security fit', score: 58, notes: 'Resume does not name SSO, audit, permissions, or regulated enterprise workflows directly.' }
    ]
  },
  {
    id: '2',
    name: 'Nora Patel',
    title: 'ML Platform Engineer',
    avatar: 'NP',
    stage: 'interview',
    score: 89,
    scoreCategory: 'high',
    skills: ['Python', 'Infra', 'LLMOps'],
    appliedDate: 'May 27',
    email: 'nora.patel@example.dev',
    phone: '+1 647 555 0293',
    summary: 'Nora has robust experience designing scalable ML pipelines, container orchestration, and deploying large-language models at scale. She demonstrates clear architectural understanding of microservices, although further assessment is required for real-time model streaming constraints.',
    timeline: [
      { id: 't4', date: 'May 27, 14:15', user: 'AI System', action: 'AI triage completed', notes: '89 score' },
      { id: 't5', date: 'May 28, 11:30', user: 'Avery Sloan', action: 'Moved to Interview' },
      { id: 't6', date: 'May 31, 15:00', user: 'Interviewer Team', action: 'Interview May 31', notes: 'Feedback pending' }
    ],
    scorecard: [
      { criteria: 'Python & ML Ops', score: 90, notes: 'Built automated retraining pipelines using Kubeflow.' },
      { criteria: 'Infrastructure Scale', score: 88, notes: 'Kubernetes node provisioning and GPU reservation optimization.' },
      { criteria: 'Communication', score: 85, notes: 'Structured answers regarding trade-offs in low-latency inference.' },
      { criteria: 'Security fit', score: 75, notes: 'Familiar with basic role-based access control and secure API boundaries.' }
    ]
  },
  {
    id: '3',
    name: 'Sofia Rivera',
    title: 'Product Design Lead',
    avatar: 'SR',
    stage: 'offer',
    score: 91,
    scoreCategory: 'high',
    skills: ['Systems', 'Research', 'B2B'],
    appliedDate: 'May 20',
    email: 'sofia.rivera@example.dev',
    phone: '+1 212 555 0741',
    summary: 'Sofia is an exceptional visual and UX systems designer. She has managed complete product redesigns, built B2B component UI frameworks, and demonstrated highly analytical customer-research processes. Recommended for immediate hire with competitive offer package.',
    timeline: [
      { id: 't7', date: 'May 20, 11:00', user: 'AI System', action: 'AI triage completed', notes: '91 score' },
      { id: 't8', date: 'May 22, 16:30', user: 'Avery Sloan', action: 'Portfolio Review Pass' },
      { id: 't9', date: 'May 28, 14:00', user: 'Design Panel', action: 'Design Loop Pass' },
      { id: 't10', date: 'May 30, 10:00', user: 'Admin', action: 'Offer review · Comp approved' }
    ],
    scorecard: [
      { criteria: 'Systems design', score: 95, notes: 'Exceptional consistency, tokens design, and developer-handoff specifications.' },
      { criteria: 'Research depth', score: 90, notes: 'Solid user interviewing protocols and data-driven taxonomy structures.' },
      { criteria: 'Collaboration', score: 88, notes: 'Excellent pairing history with product managers and engineering platform leads.' }
    ]
  },
  {
    id: '4',
    name: 'Tomas Keane',
    title: 'Frontend Engineer',
    avatar: 'TK',
    stage: 'rejected',
    score: 42,
    scoreCategory: 'low',
    skills: ['HTML', 'CSS', 'JavaScript'],
    appliedDate: 'May 15',
    email: 'tomas.keane@example.dev',
    phone: '+1 512 555 0932',
    summary: 'Tomas has basic web development capabilities, but lacks required modern framework experience (React/Next.js). He struggled to describe state synchronization patterns, performance optimizations, or UI component architecture during the initial intake review.',
    timeline: [
      { id: 't11', date: 'May 15, 16:00', user: 'AI System', action: 'AI triage completed', notes: '42 score' },
      { id: 't12', date: 'May 18, 10:00', user: 'Avery Sloan', action: 'Screened out', notes: 'Missing systems evidence' }
    ],
    scorecard: [
      { criteria: 'Systems depth', score: 40, notes: 'Unfamiliar with modular UI paradigms or state models.' },
      { criteria: 'JavaScript', score: 55, notes: 'Able to complete simple DOM transformations but limited on ES6+ features.' },
      { criteria: 'Accessibility', score: 45, notes: 'Basic HTML semantic familiarity only.' }
    ]
  },
  {
    id: '5',
    name: 'Jon Bell',
    title: 'Senior Frontend Engineer',
    avatar: 'JB',
    stage: 'applied',
    score: 76,
    scoreCategory: 'mid',
    skills: ['React', 'Next.js', 'A11y'],
    appliedDate: 'May 26',
    email: 'jon.bell@example.dev',
    phone: '+1 415 555 0753',
    summary: 'Jon is a competent React engineer with solid accessibility (WCAG 2.1 AA) focus. He has built several responsive dashboards and has a strong grasp of Tailwind CSS. His architectural systems design depth is moderate but solid.',
    timeline: [
      { id: 't13', date: 'May 26, 10:00', user: 'AI System', action: 'AI triage completed', notes: '76 score' }
    ],
    scorecard: [
      { criteria: 'Systems depth', score: 75, notes: 'Good component design, familiar with micro-frontends.' },
      { criteria: 'React expertise', score: 80, notes: 'Strong knowledge of React hooks, context, and state management.' },
      { criteria: 'Accessibility', score: 72, notes: 'Familiar with screen readers, aria-attributes, and focus states.' }
    ]
  }
];

const INITIAL_JOBS: MockJob[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote US',
    type: 'Full-time',
    status: 'open',
    applicantsCount: 186,
    filledPipelines: 3,
    createdAt: '2026-05-10',
    salaryRange: '$165k–$210k',
    owner: 'Avery Sloan'
  },
  {
    id: 'job-2',
    title: 'ML Platform Engineer',
    department: 'Engineering',
    location: 'Toronto',
    type: 'Hybrid',
    status: 'open',
    applicantsCount: 94,
    filledPipelines: 2,
    createdAt: '2026-05-15',
    salaryRange: '$150k–$190k',
    owner: 'Avery Sloan'
  },
  {
    id: 'job-3',
    title: 'Product Design Lead',
    department: 'Product',
    location: 'New York',
    type: 'Full-time',
    status: 'draft',
    applicantsCount: 0,
    filledPipelines: 0,
    createdAt: '2026-05-28',
    salaryRange: '$155k–$205k',
    owner: 'Avery Sloan'
  },
  {
    id: 'job-4',
    title: 'Recruiting Ops Analyst',
    department: 'People',
    location: 'Austin',
    type: 'Contract',
    status: 'closed',
    applicantsCount: 43,
    filledPipelines: 5,
    createdAt: '2026-05-01',
    salaryRange: '$75/hr',
    owner: 'Avery Sloan'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2026-001', date: 'May 1, 2026', amount: 1176, status: 'paid', description: 'TalentFlow Plus - May 2026' },
  { id: 'INV-2026-002', date: 'Apr 1, 2026', amount: 1029, status: 'paid', description: 'TalentFlow Plus - Apr 2026' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: 882, status: 'paid', description: 'TalentFlow Plus - Mar 2026' }
];

// Helper to check if running in browser
const isBrowser = () => typeof window !== 'undefined';

// Get candidates with state persistence
export async function getCandidates(filters?: CandidateFilters): Promise<MockCandidate[]> {
  let candidates = [...INITIAL_CANDIDATES];

  if (isBrowser()) {
    const stored = localStorage.getItem('tf-candidates');
    if (stored) {
      try {
        candidates = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored candidates', e);
      }
    }
  }

  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      candidates = candidates.filter(
        c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.title.toLowerCase().includes(searchLower) ||
          c.skills.some(s => s.toLowerCase().includes(searchLower))
      );
    }
    if (filters.stage && filters.stage !== 'all') {
      candidates = candidates.filter(c => c.stage === filters.stage);
    }
    if (filters.minScore !== undefined && filters.minScore > 0) {
      candidates = candidates.filter(c => c.score >= (filters.minScore ?? 0));
    }
  }

  return candidates;
}

export async function getCandidateById(id: string): Promise<MockCandidate | null> {
  const candidates = await getCandidates();
  return candidates.find(c => c.id === id) || null;
}

export async function updateCandidateStage(id: string, stage: string): Promise<MockCandidate> {
  const allowedStages = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
  if (!allowedStages.includes(stage)) {
    throw new Error(`Invalid stage transition: ${stage}`);
  }

  const candidates = await getCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Candidate with id ${id} not found`);
  }

  // Update candidate
  const updatedCandidate = {
    ...candidates[index],
    stage: stage,
    // Add event to timeline
    timeline: [
      {
        id: `t-gen-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        user: 'Avery Sloan',
        action: `Moved candidate to ${stage.charAt(0).toUpperCase() + stage.slice(1)}`
      },
      ...candidates[index].timeline
    ]
  };

  candidates[index] = updatedCandidate;

  if (isBrowser()) {
    localStorage.setItem('tf-candidates', JSON.stringify(candidates));
  }

  return updatedCandidate;
}

// Get jobs
export async function getJobs(search?: string, status?: string): Promise<MockJob[]> {
  let jobs = [...INITIAL_JOBS];

  if (search) {
    const searchLower = search.toLowerCase();
    jobs = jobs.filter(
      j =>
        j.title.toLowerCase().includes(searchLower) ||
        j.department.toLowerCase().includes(searchLower) ||
        j.location.toLowerCase().includes(searchLower)
    );
  }

  if (status && status !== 'all') {
    jobs = jobs.filter(j => j.status === status);
  }

  return jobs;
}

// Get invoices
export async function getInvoices(): Promise<Invoice[]> {
  return [...INITIAL_INVOICES];
}

// Get dashboard stats
export async function getDashboardStats() {
  const candidates = await getCandidates();
  const jobs = await getJobs();

  return {
    totalCandidates: candidates.length,
    activeJobs: jobs.filter(j => j.status === 'open').length,
    interviewsThisWeek: candidates.filter(c => c.stage === 'interview').length,
    hiredThisMonth: 12, // Still mock for now, but linked to same pattern
    recentCandidates: candidates.slice(0, 5),
    recentJobs: jobs.slice(0, 5)
  };
}

// Add candidate (helper for quickstart/upload cv simulation)
export async function createCandidate(c: Omit<MockCandidate, 'id' | 'scoreCategory'>): Promise<MockCandidate> {
  const candidates = await getCandidates();
  const id = (candidates.length + 1).toString();
  const scoreCategory = c.score >= 80 ? 'high' : c.score >= 50 ? 'mid' : 'low';
  const newCandidate: MockCandidate = {
    ...c,
    id,
    scoreCategory
  };

  candidates.unshift(newCandidate);
  if (isBrowser()) {
    localStorage.setItem('tf-candidates', JSON.stringify(candidates));
  }
  return newCandidate;
}
