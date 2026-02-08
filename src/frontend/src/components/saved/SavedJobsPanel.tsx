import { useGetSavedJobIds } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { FilterState } from '@/App';
import JobList from '../jobs/JobList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';

type SavedJobsPanelProps = {
  filters: FilterState;
};

export default function SavedJobsPanel({ filters }: SavedJobsPanelProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: savedJobIds = [] } = useGetSavedJobIds();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Saved Jobs</h2>
        <p className="text-muted-foreground mb-6">
          Log in to save and view your favorite job listings
        </p>
        <LoginButton />
      </div>
    );
  }

  if (savedJobIds.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Saved Jobs</h2>
        <p className="text-muted-foreground">
          You haven't saved any jobs yet. Start browsing and save jobs you're interested in!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Saved Jobs</h2>
      <JobList filters={filters} jobIds={savedJobIds} />
    </div>
  );
}
