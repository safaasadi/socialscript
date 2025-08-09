// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generic API client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient(API_BASE_URL);

// Type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    socialEnergyLevel: number;
    communicationStyle: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  votes: number;
  comments: number;
  bookmarks: number;
  timeAgo: string;
  preview: string;
  solution: string;
  confidence: number;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: Participant[];
  agenda: string[];
  prepComplete: boolean;
  context: string;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  style: string;
  energy: 'low' | 'medium' | 'high';
  communicationTips: string[];
}

export interface EmailAnalysis {
  overallTone: string;
  toneScores: {
    formality: number;
    directness: number;
    warmth: number;
    urgency: number;
    clarity: number;
  };
  insights: Array<{
    type: 'warning' | 'success' | 'info';
    message: string;
  }>;
  suggestions: string[];
  highlightedPhrases: Array<{
    text: string;
    severity: 'warning' | 'success' | 'info';
    suggestion: string;
  }>;
  revisedVersion?: string;
}

export interface MessageDecoding {
  literal: string;
  decoded: string;
  tone: {
    type: string;
    color: string;
    description: string;
  };
  context: string[];
  suggestions: Array<{
    type: string;
    icon: string;
    title: string;
    content: string;
  }>;
  alternativeInterpretations: Array<{
    interpretation: string;
    likelihood: string;
  }>;
  confidence: number;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: 'scenario' | 'template' | 'guide' | 'analysis';
  category: string;
  dateAdded: string;
  confidence: number;
  tags: string[];
  summary: string;
  content: string;
  folder: string;
  favorite: boolean;
  userId: string;
}

// API Service functions
export const apiService = {
  // User services
  user: {
    getCurrentUser: (): Promise<User> => api.get('/user/me'),
    updatePreferences: (preferences: Partial<User['preferences']>): Promise<User> => 
      api.put('/user/preferences', preferences),
    updateSocialEnergy: (level: number): Promise<{ socialEnergyLevel: number }> =>
      api.put('/user/social-energy', { level }),
  },

  // Community services
  community: {
    getScenarios: (params?: {
      search?: string;
      category?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ scenarios: Scenario[]; total: number }> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.category && params.category !== 'all') {
        searchParams.append('category', params.category);
      }
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      
      return api.get(`/community/scenarios?${searchParams.toString()}`);
    },
    
    getCategories: (): Promise<Array<{ id: string; name: string; count: number }>> =>
      api.get('/community/categories'),
    
    getTrendingTopics: (): Promise<Array<{ topic: string; discussions: number }>> =>
      api.get('/community/trending'),
    
    getStats: (): Promise<{
      scenariosShared: number;
      peopleHelped: number;
      helpfulPercentage: number;
      activeContributors: number;
    }> => api.get('/community/stats'),
    
    voteScenario: (scenarioId: string, direction: 'up' | 'down'): Promise<{ votes: number }> =>
      api.post(`/community/scenarios/${scenarioId}/vote`, { direction }),
    
    bookmarkScenario: (scenarioId: string): Promise<{ bookmarked: boolean }> =>
      api.post(`/community/scenarios/${scenarioId}/bookmark`),
  },

  // Meeting services
  meetings: {
    getUpcoming: (): Promise<Meeting[]> => api.get('/meetings/upcoming'),
    
    getMeeting: (id: string): Promise<Meeting> => api.get(`/meetings/${id}`),
    
    updatePrepStatus: (id: string, complete: boolean): Promise<Meeting> =>
      api.put(`/meetings/${id}/prep`, { complete }),
    
    getParticipantInsights: (participantIds: string[]): Promise<Participant[]> =>
      api.post('/meetings/participant-insights', { participantIds }),
  },

  // Email analysis services
  email: {
    analyzeTone: (emailContent: string): Promise<EmailAnalysis> =>
      api.post('/email/analyze-tone', { content: emailContent }),
    
    generateRevision: (
      originalContent: string, 
      toneAdjustments: {
        formality: number;
        directness: number;
        warmth: number;
        urgency: number;
      }
    ): Promise<{ revisedContent: string; analysis: EmailAnalysis }> =>
      api.post('/email/revise', { originalContent, toneAdjustments }),
  },

  // Real-time decoder services
  decoder: {
    decodeMessage: (message: string, context?: string): Promise<MessageDecoding> =>
      api.post('/decoder/analyze', { message, context }),
    
    getRecentDecodings: (): Promise<Array<{
      id: string;
      title: string;
      confidence: number;
      saved: boolean;
      createdAt: string;
    }>> => api.get('/decoder/recent'),
  },

  // Knowledge base services
  knowledge: {
    getItems: (params?: {
      search?: string;
      folder?: string;
      type?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ items: KnowledgeItem[]; total: number }> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.folder && params.folder !== 'all') {
        searchParams.append('folder', params.folder);
      }
      if (params?.type) searchParams.append('type', params.type);
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      
      return api.get(`/knowledge/items?${searchParams.toString()}`);
    },
    
    getFolders: (): Promise<Array<{ id: string; name: string; count: number }>> =>
      api.get('/knowledge/folders'),
    
    saveItem: (item: Omit<KnowledgeItem, 'id' | 'userId' | 'dateAdded'>): Promise<KnowledgeItem> =>
      api.post('/knowledge/items', item),
    
    toggleFavorite: (id: string): Promise<{ favorite: boolean }> =>
      api.put(`/knowledge/items/${id}/favorite`),
    
    getRecentlyAccessed: (): Promise<Array<{ title: string; accessed: string }>> =>
      api.get('/knowledge/recent'),
  },

  // Dashboard services
  dashboard: {
    getInsights: (): Promise<Array<{
      type: 'pattern' | 'energy' | 'recommendation';
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
    }>> => api.get('/dashboard/insights'),
    
    getStats: (): Promise<{
      socialEnergyLevel: number;
      recentTranslations: number;
      upcomingMeetings: number;
      savedScenarios: number;
    }> => api.get('/dashboard/stats'),
  },
};
