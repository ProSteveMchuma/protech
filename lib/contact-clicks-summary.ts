export type ContactChannel = "whatsapp" | "call";

export type ContactClick = {
  id: string;
  at: string;
  channel: ContactChannel;
  path: string;
  label: string;
};

export type ContactClickSummary = {
  days: number;
  total: number;
  byChannel: Record<ContactChannel, number>;
  byPage: { path: string; whatsapp: number; call: number }[];
  byDay: { day: string; whatsapp: number; call: number }[];
};

export function summarizeClicks(clicks: Pick<ContactClick, "at" | "channel" | "path">[], days: number, now = new Date()): ContactClickSummary {
  const byChannel: Record<ContactChannel, number> = { whatsapp: 0, call: 0 };
  const pages = new Map<string, { whatsapp: number; call: number }>();
  const dayKeys: string[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    dayKeys.push(new Date(now.getTime() - offset * 86_400_000).toISOString().slice(0, 10));
  }
  const daily = new Map(dayKeys.map((day) => [day, { whatsapp: 0, call: 0 }]));
  for (const click of clicks) {
    byChannel[click.channel] += 1;
    const page = pages.get(click.path) ?? { whatsapp: 0, call: 0 };
    page[click.channel] += 1;
    pages.set(click.path, page);
    const bucket = daily.get(click.at.slice(0, 10));
    if (bucket) bucket[click.channel] += 1;
  }
  return {
    days,
    total: byChannel.whatsapp + byChannel.call,
    byChannel,
    byPage: [...pages.entries()]
      .map(([path, counts]) => ({ path, ...counts }))
      .sort((a, b) => b.whatsapp + b.call - (a.whatsapp + a.call))
      .slice(0, 8),
    byDay: dayKeys.map((day) => ({ day, ...daily.get(day)! })),
  };
}
