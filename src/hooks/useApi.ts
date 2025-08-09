// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService, type Scenario, type Meeting, type KnowledgeItem, type EmailAnalysis, type MessageDecoding } from '../lib/api';

// Generic hook for API calls with loading and error states
function useApiCall<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Community hooks
export function useCommunityScenarios(search?: string, category?: string) {
  return useApiCall(
    () => apiService.community.getScenarios({ search, category }),
    [search, category]
  );
}

export function useCommunityStats() {
  return useApiCall(() => apiService.community.getStats());
}

export function useTrendingTopics() {
  return useApiCall(() => apiService.community.getTrendingTopics());
}

// Meeting hooks
export function useUpcomingMeetings() {
  return useApiCall(() => apiService.meetings.getUpcoming());
}

export function useMeeting(id: string) {
  return useApiCall(() => apiService.meetings.getMeeting(id), [id]);
}

// Knowledge base hooks
export function useKnowledgeItems(search?: string, folder?: string) {
  return useApiCall(
    () => apiService.knowledge.getItems({ search, folder }),
    [search, folder]
  );
}

export function useKnowledgeFolders() {
  return useApiCall(() => apiService.knowledge.getFolders());
}

// Dashboard hooks
export function useDashboardData() {
  const insights = useApiCall(() => apiService.dashboard.getInsights());
  const stats = useApiCall(() => apiService.dashboard.getStats());
  const recentDecodings = useApiCall(() => apiService.decoder.getRecentDecodings());
  
  return {
    insights: insights.data,
    stats: stats.data,
    recentDecodings: recentDecodings.data,
    loading: insights.loading || stats.loading || recentDecodings.loading,
    error: insights.error || stats.error || recentDecodings.error,
    refetch: () => {
      insights.refetch();
      stats.refetch();
      recentDecodings.refetch();
    }
  };
}

// Mutation hooks for actions that modify data
export function useScenarioActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voteScenario = async (scenarioId: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.community.voteScenario(scenarioId, direction);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bookmarkScenario = async (scenarioId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.community.bookmarkScenario(scenarioId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bookmark');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { voteScenario, bookmarkScenario, loading, error };
}

export function useEmailAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmail = async (content: string): Promise<EmailAnalysis> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.email.analyzeTone(content);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateRevision = async (
    originalContent: string,
    toneAdjustments: any
  ): Promise<{ revisedContent: string; analysis: EmailAnalysis }> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.email.generateRevision(originalContent, toneAdjustments);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate revision');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeEmail, generateRevision, loading, error };
}

export function useMessageDecoder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decodeMessage = async (message: string, context?: string): Promise<MessageDecoding> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.decoder.decodeMessage(message, context);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { decodeMessage, loading, error };
}

export function useKnowledgeActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveItem = async (item: Omit<KnowledgeItem, 'id' | 'userId' | 'dateAdded'>): Promise<KnowledgeItem> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.knowledge.saveItem(item);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string): Promise<{ favorite: boolean }> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.knowledge.toggleFavorite(id);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveItem, toggleFavorite, loading, error };
}

// Utility hook for debounced search
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}