import { SERVICE_EVIDENCE } from '@/features/customers/fixtures/customerFixtures';
import { CustomerGallery } from '@/features/customers/components/CustomerGallery/CustomerGallery';
const documents = [
  'Certificate 1',
  'Certificate 2',
  'Certificate 3',
  'Insurance',
];
export function ServiceEvidence() {
  return (
    <aside className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-1">
      {SERVICE_EVIDENCE.map((item) => (
        <section
          key={item.title}
          aria-label={item.title}
          className="rounded-2xl bg-white p-4"
        >
          <p className="text-center text-[10px] text-neutral-400">
            {item.title} · Sample
          </p>
          <h3 className="mt-4 text-center text-sm font-medium text-slate-950">
            {item.name}
          </h3>
          <p className="mt-2 text-center text-[10px] text-slate-500">
            {item.subtitle}
          </p>
          <dl className="mt-4 space-y-3 border-y border-slate-100 py-3 text-xs">
            {item.details.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-2">
                <dt className="text-slate-500">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[10px] leading-5 text-slate-400">
            {item.note}
          </p>
        </section>
      ))}
      <CustomerGallery label="Supporting documents" items={documents} />
    </aside>
  );
}
