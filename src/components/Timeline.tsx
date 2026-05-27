import { events, documentedLosses } from "../lib/inventory";
import EventCard from "./EventCard";
import { SectionHeading } from "./ui";

export default function Timeline() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading index="02">LOSS LOG</SectionHeading>

      <p className="mb-6 text-lg text-muted">
        Documented losses, newest first —{" "}
        <span className="text-amber glow-amber">
          {documentedLosses} airframes
        </span>{" "}
        across the events below. These are recorded for context and are{" "}
        <span className="text-ink">not</span> summed to produce the headline
        count; see the methodology note for why.
      </p>

      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
