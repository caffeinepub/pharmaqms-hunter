import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEffect } from 'react';

type AppHeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleSidebar: () => void;
};

export default function AppHeader({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onToggleSidebar,
}: AppHeaderProps) {
  const [localSearch, setLocalSearch] = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    onSearchChange(localSearch);
  }, [localSearch, onSearchChange]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/pharmaqms-hunter-logo.dim_512x512.png"
              alt="PharmaQMS Hunter"
              className="h-10 w-10"
            />
            <div className="hidden sm:block">
              <img
                src="/assets/generated/pharmaqms-hunter-wordmark.dim_1200x300.png"
                alt="PharmaQMS Hunter"
                className="h-8"
              />
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs by title or company..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <LoginButton />
        </div>

        <nav className="flex gap-1 overflow-x-auto">
          <Button
            variant={activeTab === 'results' ? 'default' : 'ghost'}
            onClick={() => onTabChange('results')}
            className="whitespace-nowrap"
          >
            All Jobs
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'ghost'}
            onClick={() => onTabChange('saved')}
            className="whitespace-nowrap"
          >
            Saved Jobs
          </Button>
          <Button
            variant={activeTab === 'summary' ? 'default' : 'ghost'}
            onClick={() => onTabChange('summary')}
            className="whitespace-nowrap"
          >
            Daily Summary
          </Button>
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => onTabChange('alerts')}
            className="whitespace-nowrap"
          >
            Email Alerts
          </Button>
        </nav>
      </div>
    </header>
  );
}
