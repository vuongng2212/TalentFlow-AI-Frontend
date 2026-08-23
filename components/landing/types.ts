export interface Challenge {
  id: string;
  icon: string;        // SVG identifier or name
  title: string;
  description: string;
}

export interface Solution {
  id: string;
  badge: string;
  title: string;
  description: string;
  challengeId?: string; // Mapping back to the Challenge it solves
}

export interface Feature {
  badgeStyle: string;
  badgeText: string;
  title: string;
  description: string;
}

export interface Integration {
  name: string;
  category: 'Job Board' | 'Calendar' | 'Communication' | 'HRIS';
  logoMark: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  badge: 'closed' | 'screening' | 'open';
  price: string;
  period: string; // e.g. "free", "/ seat", "Custom"
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isPopular?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SectionHeaderProps {
  chip?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export interface TrustedLogo {
  company: string;
  meta: string;
  description: string;
}
