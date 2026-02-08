import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import TitleKeywordFilter from '../filters/TitleKeywordFilter';
import LocationMultiSelect from '../filters/LocationMultiSelect';
import type { FilterState } from '@/App';

type FilterSidebarProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onFiltersChange({
              searchTerm: filters.searchTerm,
              selectedLocations: [],
              titleKeywordsEnabled: true,
            })
          }
        >
          Reset Filters
        </Button>
      </div>

      <Separator />

      <TitleKeywordFilter
        enabled={filters.titleKeywordsEnabled}
        onEnabledChange={(enabled) =>
          onFiltersChange({ ...filters, titleKeywordsEnabled: enabled })
        }
      />

      <Separator />

      <LocationMultiSelect
        selectedLocations={filters.selectedLocations}
        onLocationsChange={(locations) =>
          onFiltersChange({ ...filters, selectedLocations: locations })
        }
      />
    </div>
  );

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 lg:hidden">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
            {content}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-card">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-6">{content}</div>
        </ScrollArea>
      </aside>
    </>
  );
}
