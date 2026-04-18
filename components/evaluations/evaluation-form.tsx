"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { teacherRubric } from "@/data/teacher-rubric";
import {
  buildRubricJson,
  calculateWeightedScore,
  generateDevelopmentPoints,
  generateOverallFeedback,
  generateShortRecommendations,
  generateStrengths,
  getAchievementLevelLabel,
  getPerformanceLabel,
  type EvaluationSelection,
} from "@/lib/evaluation-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type TeacherLite = {
  id: string;
  fullName: string;
  subject: string | null;
  className: string | null;
  specialization: string | null;
  nationalId: string | null;
};

type SelectionState = Record<string, { score: number; strengthNote: string; developmentNote: string }>;

type EvaluationFormProps = {
  teachers: TeacherLite[];
  defaultTeacherId?: string;
  managerName: string;
  mode?: "create" | "edit";
  evaluationId?: string;
  initialData?: {
    teacherId: string;
    followupNo: string;
    visitDate: string;
    lessonTitle: string;
    managerName: string;
    teacherSignature?: string | null;
    managerSignature?: string | null;
    elements: EvaluationSelection[];
  };
};

function buildInitialSelectionState(initialData?: EvaluationFormProps["initialData"]): SelectionState {
  const defaults = Object.fromEntries(
    teacherRubric.map((item) => [item.id, { score: 3, strengthNote: "", developmentNote: "" }]),
  ) as SelectionState;

  if (!initialData) return defaults;

  for (const element of initialData.elements) {
    defaults[element.elementId] = {
      score: element.score,
      strengthNote: element.strengthNote || "",
      developmentNote: element.developmentNote || "",
    };
  }

  return defaults;
}

export function EvaluationForm({
  teachers,
  defaultTeacherId,
  managerName,
  mode = "create",
  evaluationId,
  initialData,
}: EvaluationFormProps) {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || defaultTeacherId || teachers[0]?.id || "");
  const [followupNo, setFollowupNo] = useState(initialData?.followupNo || "1");
  const [visitDate, setVisitDate] = useState(initialData?.visitDate || new Date().toISOString().slice(0, 10));
  const [lessonTitle, setLessonTitle] = useState(initialData?.lessonTitle || "");
  const [reportPreparer, setReportPreparer] = useState(initialData?.managerName || managerName || "");
  const [teacherSignature, setTeacherSignature] = useState(initialData?.teacherSignature || "");
  const [managerSignature, setManagerSignature] = useState(initialData?.managerSignature || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectionState, setSelectionState] = useState<SelectionState>(() => buildInitialSelectionState(initialData));

  const selectedTeacher = teachers.find((teacher) => teacher.id === teacherId);

  const selections = useMemo<EvaluationSelection[]>(
    () =>
      teacherRubric.map((item) => ({
        elementId: item.id,
        score: selectionState[item.id]?.score ?? 3,
        strengthNote: selectionState[item.id]?.strengthNote ?? "",
        developmentNote: selectionState[item.id]?.developmentNote ?? "",
      })),
    [selectionState],
  );

  const finalScore = calculateWeightedScore(selections);
  const performanceLabel = getPerformanceLabel(finalScore);
  const strengths = generateStrengths(selections);
  const developmentPoints = generateDevelopmentPoints(selections);
  const overallFeedback = generateOverallFeedback(selections, finalScore);
  const recommendations = generateShortRecommendations(selections);

  async function handleSubmit() {
    if (!teacherId || !lessonTitle || !followupNo || !visitDate || !reportPreparer) {
      setError("أكمل بيانات التقييم الأساسية قبل الحفظ.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const endpoint = mode === "edit" && evaluationId ? `/api/evaluations/${evaluationId}` : "/api/evaluations";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId,
        followupNo,
        visitDate,
        lessonTitle,
        managerName: reportPreparer,
        strengths,
        developmentPoints,
        aiFeedback: `${overallFeedback}\n\nالتوصيات:\n- ${recommendations.join("\n- ")}`,
        recommendations,
        teacherSignature,
        managerSignature,
        elements: selections,
        rubricJson: buildRubricJson(selections),
      }),
    });

    const data = await response.json().catch(() => null);
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.message || "تعذر حفظ التقييم.");
      return;
    }

    router.push(`/dashboard/reports/${data.evaluation.id}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/80 bg-white/90 shadow-soft">
        <CardHeader>
          <CardTitle>{mode === "edit" ? "تعديل بيانات التقييم" : "بيانات التقييم الأساسية"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="المعلم">
            <select
              className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="رقم المتابعة">
            <Input value={followupNo} onChange={(event) => setFollowupNo(event.target.value)} />
          </Field>
          <Field label="تاريخ الزيارة">
            <Input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} />
          </Field>
          <Field label="عنوان الدرس">
            <Input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} />
          </Field>
          <Field label="معد التقرير">
            <Input
              value={reportPreparer}
              onChange={(event) => setReportPreparer(event.target.value)}
              placeholder="اكتب اسم معد التقرير"
            />
          </Field>
          <Field label="التوقيع المعتمد للمدير">
            <Input
              value={managerSignature}
              onChange={(event) => setManagerSignature(event.target.value)}
              placeholder="اسم أو معرف التوقيع"
            />
          </Field>
        </CardContent>
      </Card>

      {selectedTeacher ? (
        <Card className="border-white/80 bg-gradient-to-br from-emerald-50 to-white shadow-soft">
          <CardContent className="grid gap-3 p-6 md:grid-cols-2 xl:grid-cols-4">
            <Info title="المعلم" value={selectedTeacher.fullName} />
            <Info title="التخصص" value={selectedTeacher.specialization || "غير محدد"} />
            <Info title="المادة" value={selectedTeacher.subject || "غير محددة"} />
            <Info title="الصف" value={selectedTeacher.className || "غير محدد"} />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          {teacherRubric.map((element, index) => {
            const selectedLevel = element.levels.find((level) => level.level === selectionState[element.id]?.score);

            return (
              <Card key={element.id} className="border-white/80 bg-white/90 shadow-soft">
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">العنصر {index + 1}</p>
                      <CardTitle>{element.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">الوزن النسبي {element.weight}%</Badge>
                  </div>
                  <p className="text-sm leading-7 text-slate-500">{element.uiHint}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 sm:grid-cols-5">
                    {element.levels.map((level) => (
                      <button
                        key={level.level}
                        type="button"
                        onClick={() =>
                          setSelectionState((current) => ({
                            ...current,
                            [element.id]: {
                              ...current[element.id],
                              score: level.level,
                            },
                          }))
                        }
                        className={`rounded-2xl border px-3 py-3 text-center text-sm font-bold transition-colors ${
                          selectionState[element.id]?.score === level.level
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div>المستوى {level.level}</div>
                        <div className="mt-1 text-[11px] font-medium opacity-90">{level.title}</div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950">
                    <p className="mb-2 font-bold">
                      {selectedLevel ? `${selectedLevel.level} - ${selectedLevel.title}` : ""}
                    </p>
                    <p>{selectedLevel?.description}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="ملاحظة قوة">
                      <Textarea
                        value={selectionState[element.id]?.strengthNote || ""}
                        onChange={(event) =>
                          setSelectionState((current) => ({
                            ...current,
                            [element.id]: {
                              ...current[element.id],
                              strengthNote: event.target.value,
                            },
                          }))
                        }
                        className="min-h-[100px]"
                      />
                    </Field>
                    <Field label="ملاحظة تطوير">
                      <Textarea
                        value={selectionState[element.id]?.developmentNote || ""}
                        onChange={(event) =>
                          setSelectionState((current) => ({
                            ...current,
                            [element.id]: {
                              ...current[element.id],
                              developmentNote: event.target.value,
                            },
                          }))
                        }
                        className="min-h-[100px]"
                      />
                    </Field>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-bold text-slate-700">الوثائق المقترحة</p>
                    <div className="flex flex-wrap gap-2">
                      {element.suggestedDocuments.map((document) => (
                        <Badge key={document} variant="secondary">
                          {document}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24 border-white/80 bg-white/95 shadow-soft">
            <CardHeader>
              <CardTitle>النتيجة المباشرة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-3xl bg-primary px-5 py-6 text-white">
                <p className="text-sm opacity-90">الدرجة النهائية</p>
                <p className="text-4xl font-bold">{finalScore.toFixed(2)} / 5</p>
                <p className="mt-2 text-sm">{performanceLabel}</p>
                <p className="mt-1 text-xs opacity-80">
                  أعلى مستوى مختار: {getAchievementLevelLabel(Math.round(finalScore))}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-primary">
                  <Sparkles className="h-4 w-4" />
                  تغذية راجعة ذكية
                </div>
                <p className="text-sm leading-7 text-slate-600">{overallFeedback}</p>
              </div>

              <Section title="نقاط التميز" items={strengths} />
              <Section title="نقاط التطوير" items={developmentPoints} />
              <Section title="توصيات قصيرة" items={recommendations} />

              <Field label="توقيع اطلاع المعلم">
                <Input value={teacherSignature} onChange={(event) => setTeacherSignature(event.target.value)} />
              </Field>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? "جاري الحفظ..."
                  : mode === "edit"
                    ? "حفظ التعديلات وتحديث التقرير"
                    : "حفظ التقييم وإنشاء التقرير"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-100 p-4">
      <p className="mb-2 font-bold">{title}</p>
      <ul className="space-y-2 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
