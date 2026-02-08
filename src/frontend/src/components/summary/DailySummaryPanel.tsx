import { useFilteredJobs } from '@/hooks/useQueries';
import type { FilterState } from '@/App';
import JobCard from '../jobs/JobCard';
import { Loader2, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isJobFromLast24Hours } from '@/lib/time';

type DailySummaryPanelProps = {
  filters: FilterState;
};

export default function DailySummaryPanel({ filters }: DailySummaryPanelProps) {
  const { data: allJobs, isLoading, error } = useFilteredJobs(filters);

  const newJobs = allJobs?.filter((job) => isJobFromLast24Hours(job.postedTime)) || [];

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
          Failed to load daily summary. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Daily Job Summary</h2>
        </div>
        <p className="text-muted-foreground">
          New jobs posted in the last 24 hours
        </p>
      </div>

      {newJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No new jobs today</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back tomorrow for new opportunities
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {newJobs.length} new {newJobs.length === 1 ? 'job' : 'jobs'} today
          </p>
          <div className="space-y-3">
            {newJobs.map((job) => (
              <JobCard key={job.id.toString()} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
