const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const dashboardApi = {
  async getUserPageTotal(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/users/pageTotal/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch page total');
    return response.json();
  },

  async getUserInkTotal(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/users/inkTotal/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch ink total');
    return response.json();
  },

  async getUserAvgScore(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/users/avgScore/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch average score');
    return response.json();
  },

  async getOrgMetrics(): Promise<{
    totalPagesSaved: number;
    totalInkSaved: number;
    avgOptimizingScore: number;
    totalSessions: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/dashboard/org-metrics`);
    if (!response.ok) throw new Error('Failed to fetch org metrics');
    return response.json();
  },
};
