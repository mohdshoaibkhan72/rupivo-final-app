
export enum EmploymentType {
  SALARIED = 'Salaried',
  SELF_EMPLOYED = 'Self-employed'
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  DISBURSED = 'Disbursed'
}

export interface UserProfile {
  mobile: string;
  pan: string;
  isPanVerified: boolean;
  verifiedName?: string;
  employmentType: EmploymentType | null;
  monthlyIncome: string;
  isIncomeVerified: boolean;
  city: string;
  pincode: string;
  employerName?: string;
  jobType?: string;
  workExperience?: string;
  businessType?: string;
  vintage?: string;
  isAadhaarVerified: boolean;
  isSelfieVerified: boolean;
}

export interface LoanOffer {
  id: string;
  lenderName: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  minInterest: number;
  isRecommended: boolean;
  tag?: string;
  logo: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
