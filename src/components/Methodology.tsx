import { meta, baselineTotal, currentTotal, formatDate } from "../lib/inventory";
import { SectionHeading } from "./ui";

export default function Methodology() {
  return (
    <section id="methodology" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-10">
      <SectionHeading index="03">METHODOLOGY</SectionHeading>

      <div className="pixel-border bg-panel/60 space-y-5 p-5 text-lg leading-relaxed">
        <p>
          <span className="text-amber glow-amber">Scope.</span> {meta.scope}
        </p>

        <p>
          <span className="text-amber glow-amber">The headline number.</span>{" "}
          The big figure is the most recent fleet total the U.S. Air Force has
          stated publicly ({currentTotal.count}, as of{" "}
          {formatDate(currentTotal.date)}). It is taken directly from a sourced
          figure — it is <span className="text-ink">not</span> derived by
          subtracting the losses listed in the log.
        </p>

        <p>
          <span className="text-amber glow-amber">Why not just subtract?</span>{" "}
          The fleet has shrunk from {baselineTotal.count} (
          {formatDate(baselineTotal.date)}) for more reasons than combat — planned
          retirements and drawdowns also reduce the count. And loss reports
          overlap: Houthi claims, U.S. acknowledgements, and journalist tallies
          do not line up one-to-one. Summing the log would produce a
          falsely-precise, wrong number.
        </p>

        <p>
          <span className="text-amber glow-amber">Combat-loss cost.</span> The
          dollar figure multiplies airframes lost to enemy action (shootdowns and
          combat — not crashes) by an assumed unit cost. {meta.combatUnitCostNote}
        </p>

        <ul className="space-y-2">
          {meta.notes.map((note, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-cyan">▸</span>
              <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>

        <p>
          <span className="text-amber glow-amber">Confidence levels.</span>{" "}
          <span className="text-green glow-green">CONFIRMED</span> = acknowledged
          by an official U.S. source or investigation.{" "}
          <span className="text-amber glow-amber">REPORTED</span> = credible
          reporting or an adversary claim not yet officially confirmed.{" "}
          <span className="text-cyan glow-cyan">ESTIMATED</span> = inferred from
          partial information.
        </p>
      </div>
    </section>
  );
}
