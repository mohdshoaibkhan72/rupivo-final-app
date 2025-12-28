import { LoanOffer } from './types';

export const mockOffers: LoanOffer[] = [
  {
    id: '1',
    lenderName: 'CredPrime Bank',
    minAmount: 50000,
    maxAmount: 500000,
    minTenure: 12,
    maxTenure: 48,
    minInterest: 11.99,
    isRecommended: true,
    tag: 'Lowest EMI',
    logo: 'https://picsum.photos/40/40?random=1'
  },
  {
    id: '2',
    lenderName: 'QuickFunds NBFC',
    minAmount: 20000,
    maxAmount: 200000,
    minTenure: 6,
    maxTenure: 24,
    minInterest: 14.5,
    isRecommended: false,
    tag: 'Fastest Approval',
    logo: 'https://picsum.photos/40/40?random=2'
  },
  {
    id: '3',
    lenderName: 'TrustFin',
    minAmount: 100000,
    maxAmount: 1000000,
    minTenure: 12,
    maxTenure: 60,
    minInterest: 12.5,
    isRecommended: false,
    logo: 'https://picsum.photos/40/40?random=3'
  }
];