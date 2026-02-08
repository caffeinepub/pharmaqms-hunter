import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { TITLE_KEYWORDS } from '@/constants/titleKeywords';

type TitleKeywordFilterProps = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
};

export default function TitleKeywordFilter({
  enabled,
  onEnabledChange,
}: TitleKeywordFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="title-keywords" className="font-semibold">
          Title Keywords Filter
        </Label>
        <Switch
          id="title-keywords"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {enabled
          ? 'Only showing jobs matching these keywords'
          : 'Filter disabled - showing all jobs'}
      </p>

      <Accordion type="single" collapsible>
        <AccordionItem value="keywords">
          <AccordionTrigger className="text-sm">
            View Keywords ({TITLE_KEYWORDS.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {TITLE_KEYWORDS.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
