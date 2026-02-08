import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/layout/AppHeader';
import FilterSidebar from './components/layout/FilterSidebar';
import JobList from './components/jobs/JobList';
import SavedJobsPanel from './components/saved/SavedJobsPanel';
import DailySummaryPanel from './components/summary/DailySummaryPanel';
import EmailAlertsPanel from './components/alerts/EmailAlertsPanel';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

export type FilterState = {
  searchTerm: string;
  selectedLocations: string[];
  titleKeywordsEnabled: boolean;
};

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const [activeTab, setActiveTab] = useState('results');
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedLocations: [],
    titleKeywordsEnabled: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader
          searchTerm={filters.searchTerm}
          onSearchChange={(value) => setFilters({ ...filters, searchTerm: value })}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="hidden">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                  <TabsTrigger value="summary">Daily Summary</TabsTrigger>
                  <TabsTrigger value="alerts">Email Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="mt-0">
                  <JobList filters={filters} />
                </TabsContent>

                <TabsContent value="saved" className="mt-0">
                  <SavedJobsPanel filters={filters} />
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                  <DailySummaryPanel filters={filters} />
                </TabsContent>

                <TabsContent value="alerts" className="mt-0">
                  <EmailAlertsPanel filters={filters} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>

        <footer className="border-t bg-card py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>

        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
