import { meta, baselineTotal, currentTotal, formatDate } from "../lib/inventory";
import { useLang } from "../i18n/LanguageContext";
import { metaAr } from "../i18n/content.ar";
import { SectionHeading } from "./ui";

export default function Methodology() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const scope = ar ? metaAr.scope : meta.scope;
  const notes = ar ? metaAr.notes : meta.notes;
  const costNote = ar ? metaAr.combatUnitCostNote : meta.combatUnitCostNote;

  return (
    <section id="methodology" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-10">
      <SectionHeading index="03">{t("secMethodology")}</SectionHeading>

      <div className="pixel-border bg-panel/60 space-y-5 p-5 text-lg leading-relaxed">
        <p>
          <span className="text-amber glow-amber">{t("methodScopeLabel")}</span>{" "}
          {scope}
        </p>

        <p>
          <span className="text-amber glow-amber">{t("methodHeadlineLabel")}</span>{" "}
          {t("methodHeadlineBody", {
            count: currentTotal.count,
            date: formatDate(currentTotal.date, lang),
          })}
        </p>

        <p>
          <span className="text-amber glow-amber">{t("methodSubtractLabel")}</span>{" "}
          {t("methodSubtractBody", {
            baseline: baselineTotal.count,
            date: formatDate(baselineTotal.date, lang),
          })}
        </p>

        <p>
          <span className="text-amber glow-amber">{t("methodCostLabel")}</span>{" "}
          {t("methodCostBody", { note: costNote })}
        </p>

        <ul className="space-y-2">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-cyan">▸</span>
              <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>

        <p>
          <span className="text-amber glow-amber">{t("methodConfidenceLabel")}</span>{" "}
          <span className="text-green glow-green">
            {t("confConfirmed").toUpperCase()}
          </span>{" "}
          = {t("confConfirmedDef")}{" "}
          <span className="text-amber glow-amber">
            {t("confReported").toUpperCase()}
          </span>{" "}
          = {t("confReportedDef")}{" "}
          <span className="text-cyan glow-cyan">
            {t("confEstimated").toUpperCase()}
          </span>{" "}
          = {t("confEstimatedDef")}
        </p>
      </div>
    </section>
  );
}
