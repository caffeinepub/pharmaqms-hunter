import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useSaveJob, useGetSavedJobIds } from '@/hooks/useQueries';
import { toast } from 'sonner';

type SaveJobButtonProps = {
  jobId: bigint;
};

export default function SaveJobButton({ jobId }: SaveJobButtonProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: savedJobIds = [] } = useGetSavedJobIds();
  const isSaved = savedJobIds.some(id => id === jobId);
  
  const saveJobMutation = useSaveJob();

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save jobs');
      return;
    }

    try {
      await saveJobMutation.mutateAsync(jobId);
      toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isSaved ? 'default' : 'outline'}
            size="icon"
            onClick={handleSave}
            disabled={!isAuthenticated || saveJobMutation.isPending}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!isAuthenticated
            ? 'Log in to save jobs'
            : isSaved
            ? 'Remove from saved'
            : 'Save job'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
