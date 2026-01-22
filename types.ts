import { LucideIcon } from 'lucide-react';

export interface SectionContent {
  title: string;
  description: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface EligibilityItem {
  text: string;
}

export interface Proposal {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiReview?: string;
  // Section A
  entityType: string;
  entityName: string;
  licenseNumber: string;
  issuingAuthority: string;
  city: string;
  email: string;
  mobile: string;
  responsibleName: string;
  nationalId: string;
  // Section C
  projectTitle: string;
  projectDesc: string;
  beneficiaries: string;
  location: string;
  duration: string;
  fundingAmount: string | number; // Updated to handle numeric values from Supabase
  budgetBreakdown: string;
  expectedOutcomes: string;
}