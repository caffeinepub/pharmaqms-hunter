import { ExternalLink, MapPin, Building2, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Job } from '@/backend';
import { formatJobSource } from '@/lib/jobSource';
import { formatPostedDate } from '@/lib/formatters';
import SaveJobButton from './SaveJobButton';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const handleApplyNow = () => {
    // For now, we'll use a placeholder URL since jobs don't have URLs yet
    window.open(`https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-1 truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{job.company}</span>
            </div>
          </div>
          <SaveJobButton jobId={job.id} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formatPostedDate(job.postedTime)}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        )}

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="text-xs">
            {formatJobSource(job.source)}
          </Badge>

          <Button onClick={handleApplyNow} size="sm" className="gap-2">
            Apply Now
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
