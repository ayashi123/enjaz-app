import { teacherRubric, type RubricElement } from "@/data/teacher-rubric";

export type EvaluationSelection = {
  elementId: string;
  score: number;
  strengthNote?: string;
  developmentNote?: string;
};

export function calculateWeightedScore(
  selections: EvaluationSelection[],
  rubric: RubricElement[] = teacherRubric,
) {
  const weights = rubric.reduce((sum, item) => sum + item.weight, 0);
  const weighted = rubric.reduce((sum, item) => {
    const selected = selections.find((selection) => selection.elementId === item.id);
    return sum + (selected ? selected.score * item.weight : 0);
  }, 0);

  return Number((weighted / weights).toFixed(2));
}

export function getPerformanceLabel(score: number) {
  if (score >= 4.5) return "مثالي";
  if (score >= 3.5) return "تخطى التوقعات";
  if (score >= 2.5) return "وافق التوقعات";
  if (score >= 1.5) return "بحاجة لتطوير";
  return "غير مرضي";
}

export function getAchievementLevelLabel(score: number) {
  if (score === 5) return "مثالي";
  if (score === 4) return "تخطى التوقعات";
  if (score === 3) return "وافق التوقعات";
  if (score === 2) return "بحاجة لتطوير";
  return "غير مرضي";
}

function getElementTitle(elementId: string) {
  return teacherRubric.find((item) => item.id === elementId)?.title || elementId;
}

export function generateStrengths(selections: EvaluationSelection[]) {
  const strengths = selections
    .filter((item) => item.score >= 4)
    .slice(0, 4)
    .map((item) => `برز مستوى قوي في عنصر ${getElementTitle(item.elementId)}.`);

  return strengths.length > 0
    ? strengths
    : ["يظهر لدى المعلم أساس مهني مناسب يمكن البناء عليه عبر متابعة مركزة وداعمة."];
}

export function generateDevelopmentPoints(selections: EvaluationSelection[]) {
  const development = selections
    .filter((item) => item.score <= 2)
    .slice(0, 4)
    .map((item) => `يحتاج عنصر ${getElementTitle(item.elementId)} إلى خطة تطوير ومتابعة أقرب.`);

  return development.length > 0
    ? development
    : ["يوصى بالاستمرار في تحسين عمق الممارسة الصفية وتوسيع أثرها على نتائج المتعلمين."];
}

export function generateOverallFeedback(selections: EvaluationSelection[], finalScore: number) {
  const label = getPerformanceLabel(finalScore);
  const highCount = selections.filter((item) => item.score >= 4).length;
  const lowCount = selections.filter((item) => item.score <= 2).length;

  if (label === "مثالي") {
    return `أظهر المعلم مستوى ${label} في الأداء العام، مع اتساق واضح في عناصر الممارسة المهنية ووجود أثر إيجابي ظاهر على التعلم. يوصى بالمحافظة على هذا المستوى وتوثيق الممارسات الناجحة ونشرها.`;
  }

  if (lowCount >= 3) {
    return `تشير النتائج إلى حاجة المعلم إلى دعم مهني منظم، إذ ظهرت فرص تطوير متعددة في عدد من العناصر الأساسية. يوصى ببناء خطة متابعة قصيرة المدى مرتبطة بأولويات واضحة وقابلة للقياس.`;
  }

  if (highCount >= 4) {
    return `يعكس التقييم مستوى ${label} مع وجود جوانب قوة جيدة يمكن تعزيزها بشكل أكبر، مع التركيز على تحويل الأداء الجيد إلى ممارسات أكثر استدامة واتساقًا عبر جميع العناصر.`;
  }

  return `يعكس التقييم مستوى ${label}، مع تحقق مناسب لعدد من المتطلبات المهنية وظهور فرص تطوير قابلة للتحسين عبر متابعة إشرافية مركزة وشواهد تطبيقية مستمرة.`;
}

export function generateShortRecommendations(selections: EvaluationSelection[]) {
  const lowElements = selections.filter((item) => item.score <= 2).slice(0, 3);

  if (lowElements.length === 0) {
    return [
      "الاستمرار في توثيق الممارسات المتميزة ومشاركتها.",
      "توسيع أثر الأساليب الناجحة على فئات طلابية متنوعة.",
      "الاستفادة من البيانات في تعميق التحسين المستمر.",
    ];
  }

  return lowElements.map(
    (item) => `إعداد إجراء تطويري قصير لتحسين عنصر ${getElementTitle(item.elementId)} خلال الزيارة القادمة.`,
  );
}

export function buildRubricJson(selections: EvaluationSelection[]) {
  return teacherRubric.map((element) => {
    const selected = selections.find((item) => item.elementId === element.id);
    const level = element.levels.find((item) => item.level === selected?.score);

    return {
      id: element.id,
      title: element.title,
      weight: element.weight,
      score: selected?.score || 0,
      levelTitle: level?.title || "",
      levelDescription: level?.description || "",
      strengthNote: selected?.strengthNote || "",
      developmentNote: selected?.developmentNote || "",
      suggestedDocuments: element.suggestedDocuments,
    };
  });
}
