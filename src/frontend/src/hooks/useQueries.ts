import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Job, UserProfile } from '@/backend';
import type { FilterState } from '@/App';
import { isCompanyAllowed } from '@/constants/companyAllowlist';
import { containsTitleKeyword } from '@/constants/titleKeywords';

export function useGetAllJobIds() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['jobIds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobsIds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJob(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Job>({
    queryKey: ['job', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJob(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredJobs(filters: FilterState, specificJobIds?: bigint[]) {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: allJobIds = [] } = useGetAllJobIds();

  const jobIdsToFetch = specificJobIds || allJobIds;

  return useQuery<Job[]>({
    queryKey: ['filteredJobs', filters, jobIdsToFetch.map(id => id.toString()).join(',')],
    queryFn: async () => {
      if (!actor) return [];

      const jobs = await Promise.all(
        jobIdsToFetch.map(async (id) => {
          try {
            return await actor.getJob(id);
          } catch {
            return null;
          }
        })
      );

      let filtered = jobs.filter((job): job is Job => job !== null);

      // Apply company allowlist
      filtered = filtered.filter((job) => isCompanyAllowed(job.company));

      // Apply title keyword filter if enabled
      if (filters.titleKeywordsEnabled) {
        filtered = filtered.filter((job) => containsTitleKeyword(job.title));
      }

      // Apply location filter
      if (filters.selectedLocations.length > 0) {
        filtered = filtered.filter((job) =>
          filters.selectedLocations.some(
            (loc) => job.location.toLowerCase().includes(loc.toLowerCase())
          )
        );
      }

      // Apply search filter
      if (filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(searchLower) ||
            job.company.toLowerCase().includes(searchLower)
        );
      }

      // Sort by newest first
      filtered.sort((a, b) => {
        if (a.postedTime > b.postedTime) return -1;
        if (a.postedTime < b.postedTime) return 1;
        return 0;
      });

      return filtered;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSavedJobIds() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint[]>({
    queryKey: ['savedJobIds'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getSavedJobIds();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSaveJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobIds'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
