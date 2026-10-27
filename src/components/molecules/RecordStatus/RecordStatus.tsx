import { statusTone } from '@/lib/table/statusTone';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
export function RecordStatus({ status }: { status: string }) {
  return <StatusBadge tone={statusTone(status)}>{status}</StatusBadge>;
}
