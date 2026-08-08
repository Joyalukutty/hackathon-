import { apiClient, isMockMode } from './client';
import { MOCK_ANALYTICS } from '@/mock/data';
import { AnalyticsData, BackendAnalytics } from '@/types';

export const getAnalytics = async (): Promise<{
  kpis: AnalyticsData;
  severityData: Array<{name: string, value: number, fill: string}>;
}> => {
  if (isMockMode()) {
    return {
      kpis: MOCK_ANALYTICS,
      severityData: [
        { name: 'Critical', value: 14, fill: 'var(--destructive)' },
        { name: 'Warning', value: 45, fill: 'var(--warning)' },
        { name: 'Safe', value: 89, fill: 'var(--safe)' },
        { name: 'Normal', value: 100, fill: 'hsl(var(--muted-foreground))' },
      ]
    };
  }

  const data = await apiClient<BackendAnalytics>('/api/analytics');
  
  const kpis: AnalyticsData = {
    latency: parseFloat(data.avg_triage_time_min) || 0,
    avgConfidence: data.avg_confidence_pct,
    patientsCount: data.total_patients,
    criticalCases: data.critical_cases
  };

  const severityData = [
    { name: 'Critical', value: data.severity_distribution?.critical || 0, fill: 'var(--destructive)' },
    { name: 'Warning', value: data.severity_distribution?.warning || 0, fill: 'var(--warning)' },
    { name: 'Safe', value: data.severity_distribution?.safe || 0, fill: 'var(--safe)' },
    { name: 'Normal', value: data.severity_distribution?.normal || 0, fill: 'hsl(var(--muted-foreground))' },
  ];

  return { kpis, severityData };
};
