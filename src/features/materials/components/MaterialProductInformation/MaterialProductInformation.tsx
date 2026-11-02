'use client';
import { useOrderPresentation } from '@/features/materials/hooks/useOrderPresentation/useOrderPresentation';
import type { MaterialOrderDetail } from '@/features/materials/types/materialOrderDetailTypes';
export function MaterialProductInformation({
  detail,
}: {
  detail: Pick<
    MaterialOrderDetail,
    'description' | 'specifications' | 'comments'
  >;
}) {
  const state = useOrderPresentation(detail.comments);
  return (
    <section className="space-y-4 rounded-lg bg-neutral-50 p-4 text-xs leading-5 text-neutral-500">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-2"
      >
        {(['description', 'specifications'] as const).map((section) => (
          <button
            key={section}
            type="button"
            role="tab"
            id={`product-${section}-tab`}
            aria-selected={state.section === section}
            aria-controls="product-info-panel"
            tabIndex={state.section === section ? 0 : -1}
            onKeyDown={(event) => {
              if (
                ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 'description'
                    : event.key === 'End'
                      ? 'specifications'
                      : state.section === 'description'
                        ? 'specifications'
                        : 'description';
                state.setSection(next);
                document.getElementById(`product-${next}-tab`)?.focus();
              }
            }}
            onClick={() => state.setSection(section)}
            className={`rounded-full px-3 py-1 capitalize transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none ${state.section === section ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-neutral-600'}`}
          >
            {section}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="product-info-panel"
        aria-labelledby={`product-${state.section}-tab`}
        tabIndex={0}
        className="space-y-4 rounded focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        {state.section === 'description' ? (
          detail.description.map((text) => <p key={text}>{text}</p>)
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            {detail.specifications.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd className="font-medium text-slate-700">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
