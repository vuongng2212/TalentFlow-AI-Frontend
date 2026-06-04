# Data Model & Component Contracts: B2B SaaS Landing Page Refactor

Since the landing page refactor is a presentation-layer change, it does not introduce new database tables or backend persistent models. However, to maintain strict type safety and modular components, this document defines the static datasets, interface types, and component prop contracts.

## 1. Data Contracts (Static Lists)

### Challenge Data Structure
Represents the hiring challenges highlighted in the "Recruitment Challenges" section.
```typescript
export interface Challenge {
  id: string;
  icon: string;        // SVG identifier or name
  title: string;
  description: string;
}
```

### Solution Data Structure
Represents the solution cards mapping to challenges.
```typescript
export interface Solution {
  id: string;
  badge: string;
  title: string;
  description: string;
  challengeId?: string; // Mapping back to the Challenge it solves
}
```

### Feature Data Structure
Represents the 6 key product features shown in the Features section.
```typescript
export interface Feature {
  badge: 'applied' | 'screening' | 'interview' | 'offer' | 'open' | 'closed';
  title: string;
  description: string;
}
```

### Integration Partner Data Structure
Represents API integrations, job boards, and communication platforms.
```typescript
export interface Integration {
  name: string;
  category: 'Job Board' | 'Calendar' | 'Communication' | 'HRIS';
  logoMark: string;
  description: string;
}
```

### Pricing Package Data Structure
Represents the three plan packages (Personal, Plus, Business) rendered in the Pricing section.
```typescript
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
```

### FAQ Data Structure
Represents the collapsible Q&A accordion.
```typescript
export interface FaqItem {
  question: string;
  answer: string;
}
```

---

## 2. Component Prop Interfaces

### Accordion Component Props
Reused from `/home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/ui/accordion.tsx`.
```typescript
export interface AccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
}
```

### Shared Section Header Prop Contract
To avoid duplicate CSS for section headers, we define a reusable SectionHeader presentation component.
```typescript
export interface SectionHeaderProps {
  chip?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}
```
*Validation Rules*:
- `title` is mandatory.
- If `centered` is true, styling will apply `text-center mx-auto`.
