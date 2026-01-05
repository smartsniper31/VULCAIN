const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface Trend {
  id: string;
  slug: string;
  title: string;
  description: string;
  searchVolume: number;
  growthRate: number;
  imageUrl: string;
  sourceUrl: string;
  isHot: boolean;
  category: string;
  createdAt: string;
}

export interface TrendsResponse {
  status: string;
  timestamp: string;
  data: Trend[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const fetchTrends = async (page = 1, limit = 10): Promise<TrendsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/trends?page=${page}&limit=${limit}&sortBy=searchVolume&sortOrder=desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch trends');
  }
  return response.json();
};
