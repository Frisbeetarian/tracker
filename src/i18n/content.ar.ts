import type { EventCause, Confidence } from "../lib/inventory";
import type { Lang } from "./strings";

/** Arabic translations of event content, keyed by event id. */
export const eventsAr: Record<string, { title: string; summary: string }> = {
  "2026-epic-fury": {
    title: "فقدان 24 طائرة MQ-9 في عملية «إيبيك فيوري» (الحرب الأمريكية-الإيرانية)",
    summary:
      "يفيد تقرير لدائرة أبحاث الكونغرس بأن الولايات المتحدة فقدت 24 طائرة MQ-9 ريبر خلال حرب 2026 مع إيران — أُسقط معظمها بالدفاعات الجوية، ودُمّر بعضها على الأرض في قواعد إقليمية. أي نحو 20% من الأسطول.",
  },
  "2025-11-yellow-sea-crash": {
    title: "تحطّم طائرة MQ-9 في البحر الأصفر قبالة كوريا الجنوبية",
    summary:
      "سقطت طائرة MQ-9 تابعة للسرب الاستطلاعي الاستكشافي 431 (قاعدة كونسان) في البحر الأصفر خلال مهمة روتينية، واستُعيدت لاحقًا بواسطة القوات الأمريكية والكورية الجنوبية.",
  },
  "2025-03-yemen-cluster": {
    title: "فقدان نحو 7 طائرات MQ-9 فوق اليمن، حملة ربيع 2025",
    summary:
      "أكّد مسؤول أمريكي فقدان ما لا يقل عن سبع طائرات MQ-9 في منطقة اليمن منذ منتصف مارس 2025 خلال عمليات مكثّفة ضد الحوثيين. وهذا عدد إجمالي وليس حادثة واحدة.",
  },
  "2025-01-marib": {
    title: "ادعاء إسقاط طائرة MQ-9 فوق مأرب",
    summary:
      "ادّعى الحوثيون إسقاط طائرة MQ-9 فوق محافظة مأرب، وهو أول ادعاء لهم بشأن MQ-9 في عام 2025.",
  },
  "2024-12-mediterranean-ditch": {
    title: "إنزال اضطراري لطائرة MQ-9 في المتوسط بعد فقدان المروحة",
    summary:
      "فقدت طائرة MQ-9 تابعة للجناح 432 مروحتها أثناء الطيران (بسبب عطل في حلقة قفل لولبية بصندوق التروس) وأُنزلت عمدًا في البحر المتوسط. وقدّر مجلس التحقيق في الحوادث الخسارة بنحو 13 مليون دولار.",
  },
  "2024-12-al-bayda": {
    title: "ادعاء إسقاط طائرة MQ-9 فوق البيضاء",
    summary:
      "أعلن المتحدث باسم الحوثيين يحيى سريع إسقاط طائرة MQ-9 فوق محافظة البيضاء.",
  },
  "2024-09-yemen-pair": {
    title: "إسقاط طائرتي MQ-9 فوق اليمن، سبتمبر 2024",
    summary:
      "أقرّ الجيش الأمريكي بأن الحوثيين أسقطوا طائرتي MQ-9 في سبتمبر 2024، إحداهما أُسقطت فوق محافظة ذمار بحسب التقارير.",
  },
  "2024-02-hodeida": {
    title: "إسقاط طائرة MQ-9 قرب الحديدة",
    summary:
      "أُسقطت طائرة MQ-9 قرب ميناء الحديدة على البحر الأحمر، في خسارة مبكرة ضمن حملة الحوثيين ضد المسيّرات الأمريكية.",
  },
};

/** Arabic labels for the official-total points (chart axis + "since"). */
export const totalsLabelAr: Record<string, string> = {
  "Sep 2024": "سبتمبر 2024",
  "End FY2025": "نهاية 2025",
  "May 2026": "مايو 2026",
};

/** Arabic translations of methodology-level meta content. */
export const metaAr = {
  scope:
    "طائرات MQ-9 / MQ-9A ريبر التابعة لسلاح الجو الأمريكي (القوات العاملة والحرس الوطني الجوي). لا تشمل ما تملكه الأفرع الأخرى أو المشغّلون الأجانب.",
  combatUnitCostNote:
    "يعتمد على نحو 30 مليون دولار للطائرة الواحدة تقريبًا. وتتفاوت كلفة وحدة MQ-9 المُعلنة كثيرًا حسب التجهيز — من نحو 13 مليون دولار للهيكل المجرّد إلى أكثر من 56 مليون دولار لمنظومة كاملة بأجهزة استشعار ومحطات أرضية — لذا فإن إجمالي كلفة الخسائر تقديري تقريبي.",
  notes: [
    "الرقم الرئيسي هو أحدث إجمالي مُعلن رسميًا للأسطول، وليس مجموع أحداث الخسائر أدناه.",
    "أحداث الخسائر موثّقة فرديًا للسياق. وتتداخل إحصاءات اليمن خصوصًا بين مزاعم الحوثيين وإقرارات الجيش الأمريكي، لذا لا ينبغي جمع الأحداث لاستنتاج حجم الأسطول.",
  ],
};

/** Map enum values to UI string keys (resolved via the `t()` translator). */
export const causeKey: Record<EventCause, string> = {
  shootdown: "causeShootdown",
  crash: "causeCrash",
  combat: "causeCombat",
  retired: "causeRetired",
  other: "causeOther",
};

export const confidenceKey: Record<Confidence, string> = {
  confirmed: "confConfirmed",
  reported: "confReported",
  estimated: "confEstimated",
};

export const eventTitle = (id: string, en: string, lang: Lang) =>
  lang === "ar" ? (eventsAr[id]?.title ?? en) : en;

export const eventSummary = (id: string, en: string, lang: Lang) =>
  lang === "ar" ? (eventsAr[id]?.summary ?? en) : en;

export const totalLabel = (en: string, lang: Lang) =>
  lang === "ar" ? (totalsLabelAr[en] ?? en) : en;
