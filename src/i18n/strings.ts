export type Lang = "en" | "ar";

/**
 * UI string dictionary. `ar` falls back to `en` per-key if a key is missing.
 * Templates use {placeholders}, filled with `fill()`.
 */
export const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    fleetStatus: "MQ-9 REAPER // USAF FLEET",
    tracking: "TRACKING",
    remainingTitle: "REMAINING MQ-9S",
    heroH1Context: "MQ-9 Reaper drones remaining in the U.S. Air Force fleet",
    since: "SINCE",
    asOf: "As of",
    source: "source",
    heroIntro:
      "A sourced count of how many MQ-9 Reaper drones remain in the U.S. Air Force fleet. The headline figure is the most recent total the Air Force has stated publicly — not a guess. Every number on this page links to its source.",
    inService: "IN SERVICE",
    reqFloor: "REQ. FLOOR",

    statRemaining: "REMAINING",
    statBelowFloor: "BELOW FLOOR",
    statNetChange: "NET CHANGE",
    statDocumentedLosses: "DOCUMENTED LOSSES",
    statCombatCost: "COMBAT LOSS COST",
    statFootnote:
      "Net change is the shift in the official total since {label} ({count}) — it includes planned retirements, not just losses, so it won't match documented losses. Combat-loss cost is an estimate.",
    why: "Why?",

    secTrend: "FLEET TOTAL OVER TIME",
    trendCaption:
      "Each point is an officially-stated total, with its own source in the log below. The line is drawn between reported figures and does not imply the exact count on the days in between.",
    airframes: "airframes",
    floor: "FLOOR",

    secLossLog: "LOSS LOG",
    timelineIntro:
      "{n} airframes documented below, newest first — recorded for context, not summed into the headline count.",

    secMethodology: "METHODOLOGY",
    methodScopeLabel: "Scope.",
    methodHeadlineLabel: "The headline number.",
    methodHeadlineBody:
      "The big figure is the most recent fleet total the U.S. Air Force has stated publicly ({count}, as of {date}). It is taken directly from a sourced figure — it is not derived by subtracting the losses listed in the log.",
    methodSubtractLabel: "Why not just subtract?",
    methodSubtractBody:
      "The fleet has shrunk from {baseline} ({date}) for more reasons than combat — planned retirements and drawdowns also reduce the count. And loss reports overlap: Houthi claims, U.S. acknowledgements, and journalist tallies do not line up one-to-one. Summing the log would produce a falsely-precise, wrong number.",
    methodCostLabel: "Combat-loss cost.",
    methodCostBody:
      "The dollar figure multiplies airframes lost to enemy action (shootdowns and combat — not crashes) by an assumed unit cost. {note}",
    methodConfidenceLabel: "Confidence levels.",
    confConfirmedDef: "acknowledged by an official U.S. source or investigation.",
    confReportedDef:
      "credible reporting or an adversary claim not yet officially confirmed.",
    confEstimatedDef: "inferred from partial information.",

    footerUpdated: "DATA LAST UPDATED {date}",
    footerDisclaimer:
      "An independent, source-linked tracker. Not affiliated with the U.S. government. Figures reflect public reporting and official statements and may lag real events.",

    hudTitle: "MQ-9 REAPER TRACKER",

    causeShootdown: "shootdown",
    causeCrash: "crash",
    causeCombat: "combat",
    causeRetired: "retired",
    causeOther: "other",
    confConfirmed: "confirmed",
    confReported: "reported",
    confEstimated: "estimated",
  },
  ar: {
    fleetStatus: "طائرة MQ-9 ريبر // أسطول سلاح الجو الأمريكي",
    tracking: "قيد التتبّع",
    remainingTitle: "طائرات MQ-9 المتبقية",
    heroH1Context: "طائرات MQ-9 ريبر المسيّرة المتبقية في أسطول سلاح الجو الأمريكي",
    since: "منذ",
    asOf: "حتى",
    source: "المصدر",
    heroIntro:
      "إحصاء موثّق لعدد طائرات MQ-9 ريبر المسيّرة المتبقية في أسطول سلاح الجو الأمريكي. الرقم الرئيسي هو أحدث إجمالي أعلنه سلاح الجو رسميًا — وليس تخمينًا. وكل رقم في هذه الصفحة موصول بمصدره.",
    inService: "في الخدمة",
    reqFloor: "الحد الأدنى",

    statRemaining: "المتبقية",
    statBelowFloor: "تحت الحد الأدنى",
    statNetChange: "صافي التغيّر",
    statDocumentedLosses: "خسائر موثّقة",
    statCombatCost: "كلفة الخسائر القتالية",
    statFootnote:
      "صافي التغيّر هو الفرق في الإجمالي الرسمي منذ {label} ({count}) — وهو يشمل عمليات الإحالة للتقاعد المخطّطة، لا الخسائر وحدها، لذا لن يطابق الخسائر الموثّقة. وكلفة الخسائر القتالية تقديرية.",
    why: "لماذا؟",

    secTrend: "إجمالي الأسطول عبر الزمن",
    trendCaption:
      "كل نقطة هي إجمالي مُعلَن رسميًا، مع مصدره في السجل أدناه. ويُرسم الخط بين الأرقام المُبلَّغ عنها ولا يعني العدد الدقيق في الأيام الواقعة بينها.",
    airframes: "طائرة",
    floor: "الحد",

    secLossLog: "سجل الخسائر",
    timelineIntro:
      "{n} طائرة موثّقة أدناه، الأحدث أولًا — مُسجّلة للسياق وغير مجموعة ضمن الرقم الرئيسي.",

    secMethodology: "المنهجية",
    methodScopeLabel: "النطاق.",
    methodHeadlineLabel: "الرقم الرئيسي.",
    methodHeadlineBody:
      "الرقم الكبير هو أحدث إجمالي للأسطول أعلنه سلاح الجو الأمريكي رسميًا ({count}، حتى {date}). وهو مأخوذ مباشرةً من رقم موثّق — ولا يُشتقّ بطرح الخسائر المذكورة في السجل.",
    methodSubtractLabel: "لماذا لا نطرح فحسب؟",
    methodSubtractBody:
      "تقلّص الأسطول من {baseline} ({date}) لأسباب تتجاوز القتال — إذ تخفّض عمليات الإحالة للتقاعد والتقليص المخطّط العددَ أيضًا. كما تتداخل تقارير الخسائر: مزاعم الحوثيين، وإقرارات الجيش الأمريكي، وإحصاءات الصحفيين لا تتطابق واحدًا لواحد. وجمع السجل ينتج رقمًا زائف الدقّة وخاطئًا.",
    methodCostLabel: "كلفة الخسائر القتالية.",
    methodCostBody:
      "يضرب الرقم المالي عددَ الطائرات المفقودة بفعل العدو (الإسقاط والقتال — لا التحطّم) في كلفة وحدة مفترضة. {note}",
    methodConfidenceLabel: "مستويات الثقة.",
    confConfirmedDef: "أقرّ به مصدر أمريكي رسمي أو تحقيق.",
    confReportedDef: "تقارير موثوقة أو ادعاء خصم لم يُؤكَّد رسميًا بعد.",
    confEstimatedDef: "مُستنتَج من معلومات جزئية.",

    footerUpdated: "آخر تحديث للبيانات {date}",
    footerDisclaimer:
      "متتبّع مستقل موصول بالمصادر. غير تابع للحكومة الأمريكية. تعكس الأرقام التقارير العامة والتصريحات الرسمية وقد تتأخّر عن الأحداث الفعلية.",

    hudTitle: "متتبّع MQ-9 ريبر",

    causeShootdown: "إسقاط",
    causeCrash: "تحطّم",
    causeCombat: "قتال",
    causeRetired: "تقاعد",
    causeOther: "أخرى",
    confConfirmed: "مؤكَّد",
    confReported: "مُبلَّغ عنه",
    confEstimated: "تقديري",
  },
};

/** Replace {placeholders} in a template string. */
export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
