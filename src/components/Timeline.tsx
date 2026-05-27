import { events, documentedLosses } from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import EventCard from "./EventCard";
import { SectionHeading } from "./ui";

export default function Timeline() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading index="02">{t("secLossLog")}</SectionHeading>

      <p className="mb-6 text-lg text-muted">
        {t("timelineIntro", { n: documentedLosses })}
      </p>

      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
