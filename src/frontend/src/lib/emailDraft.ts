import type { Job } from '@/backend';
import { formatJobSource } from './jobSource';
import { formatPostedDate } from './formatters';

export function generateEmailDraft(jobs: Job[]): { subject: string; body: string } {
  const subject = `PharmaQMS Hunter Daily Summary - ${jobs.length} New ${jobs.length === 1 ? 'Job' : 'Jobs'}`;

  let body = `PharmaQMS Hunter - Daily Job Summary\n`;
  body += `Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
  body += `${jobs.length} new ${jobs.length === 1 ? 'job' : 'jobs'} matching your criteria:\n\n`;
  body += `${'='.repeat(60)}\n\n`;

  if (jobs.length === 0) {
    body += `No new jobs found today. Check back tomorrow!\n`;
  } else {
    jobs.forEach((job, index) => {
      body += `${index + 1}. ${job.title}\n`;
      body += `   Company: ${job.company}\n`;
      body += `   Location: ${job.location}\n`;
      body += `   Posted: ${formatPostedDate(job.postedTime)}\n`;
      body += `   Source: ${formatJobSource(job.source)}\n`;
      if (job.description) {
        body += `   Description: ${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}\n`;
      }
      body += `\n`;
    });
  }

  body += `${'='.repeat(60)}\n\n`;
  body += `Visit PharmaQMS Hunter to view full details and apply.\n\n`;
  body += `This is an automated summary from PharmaQMS Hunter.\n`;

  return { subject, body };
}
