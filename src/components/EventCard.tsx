import type { ReaperEvent, EventCause, Confidence } from "../lib/inventory";
import { formatDate } from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import { eventTitle, eventSummary, causeKey, confidenceKey } from "../i18n/content.ar";
import { Badge } from "./ui";

const causeTone: Record<EventCause, "magenta" | "amber" | "cyan" | "muted"> = {
  shootdown: "magenta",
  combat: "magenta",
  crash: "amber",
  retired: "muted",
  other: "cyan",
};

const confidenceTone: Record<Confidence, "green" | "amber" | "cyan"> = {
  confirmed: "green",
  reported: "amber",
  estimated: "cyan",
};

export default function EventCard({ event }: { event: ReaperEvent }) {
  const { t, lang } = useLang();
  const isLoss = event.type === "loss";

  return (
    <article className="pixel-border bg-panel/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="pixel-text text-[10px] text-cyan glow-cyan">
          {formatDate(event.date, lang)}
        </span>
        <span
          className={`pixel-text text-lg ${
            isLoss ? "text-magenta glow-magenta" : "text-green glow-green"
          }`}
        >
          {isLoss ? "−" : "+"}
          {event.count}
        </span>
      </div>

      <h3 className="mt-3 text-2xl leading-tight text-ink">
        {eventTitle(event.id, event.title, lang)}
      </h3>
      <p className="mt-2 text-lg text-muted">
        {eventSummary(event.id, event.summary, lang)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone={causeTone[event.cause]}>{t(causeKey[event.cause])}</Badge>
        <Badge tone={confidenceTone[event.confidence]}>
          {t(confidenceKey[event.confidence])}
        </Badge>
      </div>

      <ul className="mt-4 space-y-1">
        {event.sources.map((s) => (
          <li key={s.url} className="text-base leading-snug">
            <span className="text-muted" aria-hidden>▸ </span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan underline decoration-dotted underline-offset-4 hover:glow-cyan"
            >
              {s.title}
            </a>
            <span className="text-muted"> — {s.publisher}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
