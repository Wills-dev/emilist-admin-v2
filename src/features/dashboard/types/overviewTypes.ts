export interface SummarySegment {
  key: string;
  label: string;
  value: number;
  fill: string;
}
export interface DonutSummary {
  title: string;
  description: string;
  label: string;
  total: number;
  segments: SummarySegment[];
  footerLabel: string;
  footerValue: string;
  others?: { label: string; value?: number }[];
}
