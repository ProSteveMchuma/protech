import type { ContactClickSummary } from "@/lib/contact-clicks-summary";

export function ContactClicksPanel({ summary }: { summary: ContactClickSummary }) {
  const peak = Math.max(1, ...summary.byDay.map((day) => day.whatsapp + day.call));
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="contact-clicks-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="contact-clicks-heading" className="font-bold text-slate-900">People who tapped WhatsApp or Call · last {summary.days} days</h2>
        <p className="text-sm text-slate-600">
          <span className="font-mono font-bold tabular-nums text-[#128C7E]">{summary.byChannel.whatsapp}</span> WhatsApp
          <span className="mx-2">·</span>
          <span className="font-mono font-bold tabular-nums text-slate-900">{summary.byChannel.call}</span> Call
        </p>
      </div>
      {summary.total === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No taps recorded yet. Every tap on a WhatsApp or Call button on the shop is counted here.</p>
      ) : (
        <>
          <div className="mt-5 flex h-24 items-end gap-[3px]" role="img" aria-label={`${summary.total} contact taps in ${summary.days} days`}>
            {summary.byDay.map((day) => {
              const total = day.whatsapp + day.call;
              return (
                <div key={day.day} className="flex flex-1 flex-col justify-end" title={`${day.day}: ${day.whatsapp} WhatsApp, ${day.call} Call`}>
                  <div className="rounded-t-sm bg-slate-800" style={{ height: `${(day.call / peak) * 96}px` }} />
                  <div className={`${total ? "rounded-t-sm" : ""} bg-[#128C7E]`} style={{ height: `${(day.whatsapp / peak) * 96}px` }} />
                </div>
              );
            })}
          </div>
          <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">Pages they tapped from</h3>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {summary.byPage.map((page) => (
                <tr key={page.path} className="border-t border-slate-100">
                  <td className="py-2 font-mono text-xs text-slate-700">{page.path}</td>
                  <td className="py-2 text-right font-mono tabular-nums text-[#128C7E]">{page.whatsapp}</td>
                  <td className="w-16 py-2 text-right font-mono tabular-nums text-slate-900">{page.call}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
