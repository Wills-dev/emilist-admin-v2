import { Download } from 'lucide-react';
import { ActionDialog } from '@/components/molecules/ActionDialog/ActionDialog';
import { ExportReportForm } from '@/features/reports/components/ExportReportForm/ExportReportForm';
import type { DateRange } from '@/lib/date/calendarDates';
export function ExportReportsDialog({ dates }: { dates: DateRange }) {
  return (
    <ActionDialog
      title="Export Reports"
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <Download className="size-3.5" />
          Export reports
        </button>
      }
      confirmLabel="Download Report"
      note="Sample report selection only. Verified report files and export APIs are unavailable."
    >
      <ExportReportForm dates={dates} />
    </ActionDialog>
  );
}
