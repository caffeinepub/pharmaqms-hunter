import { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilteredJobs } from '@/hooks/useQueries';
import type { FilterState } from '@/App';
import { generateEmailDraft } from '@/lib/emailDraft';
import { isJobFromLast24Hours } from '@/lib/time';
import { toast } from 'sonner';

type EmailAlertsPanelProps = {
  filters: FilterState;
};

export default function EmailAlertsPanel({ filters }: EmailAlertsPanelProps) {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: allJobs } = useFilteredJobs(filters);
  const newJobs = allJobs?.filter((job) => isJobFromLast24Hours(job.postedTime)) || [];

  const emailDraft = generateEmailDraft(newJobs);

  const handleMailto = () => {
    if (!emailAddress) {
      toast.error('Please enter an email address');
      return;
    }

    const subject = encodeURIComponent(emailDraft.subject);
    const body = encodeURIComponent(emailDraft.body);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`);
      setCopied(true);
      toast.success('Email draft copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Email Alerts</h2>
        </div>
        <p className="text-muted-foreground">
          Configure email notifications for new job postings
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
            <CardDescription>
              Set up daily email summaries of new job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Enable Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily summaries of new jobs
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                type="email"
                placeholder="your.email@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                disabled={!emailEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview Daily Summary</CardTitle>
            <CardDescription>
              Preview and send today's job summary email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={emailDraft.subject} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={emailDraft.body}
                readOnly
                rows={12}
                className="font-mono text-xs"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleMailto} className="gap-2">
                <Mail className="h-4 w-4" />
                Open in Email Client
              </Button>
              <Button onClick={handleCopy} variant="outline" className="gap-2">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
