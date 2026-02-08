import { useFilteredJobs } from '@/hooks/useQueries';
import type { FilterState } from '@/App';
import JobCard from './JobCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type JobListProps = {
  filters: FilterState;
  jobIds?: bigint[];
};

export default function JobList({ filters, jobIds }: JobListProps) {
  const { data: jobs, isLoading, error } = useFilteredJobs(filters, jobIds);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load jobs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No jobs found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </p>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id.toString()} job={job} />
        ))}
      </div>
    </div>
  );
}
