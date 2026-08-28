import type { SearchResult } from '@/types/shared/search';
import { environment } from '@/config/environment';
import { sharedSearchService } from '@/services/mock/sharedSearchService';
import { getApiClient } from './apiClient';

export interface SearchApiService {
  search(query: string): Promise<SearchResult[]>;
  getRecentSearches(): Promise<string[]>;
  saveRecentSearch(query: string): Promise<void>;
}

class SearchApi implements SearchApiService {
  private readonly client = getApiClient();

  async search(query: string): Promise<SearchResult[]> {
    return this.client.get<SearchResult[]>('/api/search', {
      params: { query },
    });
  }

  async getRecentSearches(): Promise<string[]> {
    return this.client.get<string[]>('/api/search/recent');
  }

  async saveRecentSearch(query: string): Promise<void> {
    await this.client.post('/api/search/recent', { query });
  }
}

class MockSearchApi implements SearchApiService {
  async search(query: string) {
    return sharedSearchService.search(query);
  }
  async getRecentSearches() {
    return sharedSearchService.getRecentSearches();
  }
  async saveRecentSearch(query: string) {
    return sharedSearchService.saveRecentSearch(query);
  }
}

export const searchApi: SearchApiService = environment.useMockApi
  ? new MockSearchApi()
  : new SearchApi();
