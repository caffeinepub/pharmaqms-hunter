import { JobSource } from '@/backend';

export function formatJobSource(source: JobSource): string {
  switch (source) {
    case JobSource.linkedin:
      return 'LinkedIn';
    case JobSource.indeed:
      return 'Indeed';
    case JobSource.workday:
      return 'Workday';
    case JobSource.companySite:
      return 'Official company career site';
    case JobSource.other:
      return 'Other job posting site';
    default:
      return 'Unknown';
  }
}
