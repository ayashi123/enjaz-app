"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Upload, Users2 } from "lucide-react";
import { TeacherDeleteButton, TeacherFormDialog } from "@/components/teachers/teacher-form-dialog";
import { TeacherImportButton } from "@/components/teachers/teacher-import";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

type TeacherRow = {
  id: string;
  fullName: string;
  nationalId: string | null;
  specialization: string | null;
  subject: string | null;
  className: string | null;
  createdAt: Date;
  _count: {
    evaluations: number;
  };
};

export function TeachersTable({ teachers }: { teachers: TeacherRow[] }) {
  const [query, setQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return teachers;

    return teachers.filter((teacher) =>
      [teacher.fullName, teacher.nationalId, teacher.specialization, teacher.subject, teacher.className]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalized)),
    );
  }, [query, teachers]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] p-5 shadow-soft">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">إدارة المعلمين</h2>
            <p className="text-sm leading-7 text-slate-500">
              بحث سريع، استيراد كشوف، وإدارة ملفات المعلمين بشكل مريح على الهاتف واللوحي.
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-2xl border-[#d7e3e7] pr-10"
              placeholder="ابحث بالاسم أو الهوية أو المادة"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <TeacherImportButton />
            <TeacherFormDialog mode="create" />
            <QuickActionChip icon={<Upload className="h-4 w-4" />} label="استيراد" />
            <QuickActionChip icon={<Plus className="h-4 w-4" />} label="إضافة" />
          </div>
        </div>
      </div>

      {filteredTeachers.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-soft">
          <Users2 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <h3 className="mb-2 text-lg font-black text-slate-900">لا توجد نتائج مطابقة</h3>
          <p className="text-sm leading-7 text-slate-500">
            يمكنك تعديل كلمات البحث أو إضافة معلم جديد لبدء بناء قاعدة بيانات المدرسة.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft lg:block">
            <table className="w-full text-right">
              <thead className="bg-[#f4f8fa] text-sm text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">المعلم</th>
                  <th className="px-5 py-4 font-semibold">التخصص</th>
                  <th className="px-5 py-4 font-semibold">المادة / الصف</th>
                  <th className="px-5 py-4 font-semibold">التقييمات</th>
                  <th className="px-5 py-4 font-semibold">تاريخ الإضافة</th>
                  <th className="px-5 py-4 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t border-slate-100 align-top">
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-900">{teacher.fullName}</div>
                      <div className="mt-1 text-sm text-slate-500">{teacher.nationalId || "لا يوجد رقم هوية"}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{teacher.specialization || "غير محدد"}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <div>{teacher.subject || "غير محددة"}</div>
                      <div className="mt-1 text-xs text-slate-400">{teacher.className || "الصف غير محدد"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="secondary">{teacher._count.evaluations} تقييم</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(teacher.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="secondary" className="rounded-2xl">
                          <Link href={`/dashboard/teachers/${teacher.id}`}>الملف</Link>
                        </Button>
                        <TeacherFormDialog
                          mode="edit"
                          teacher={{
                            id: teacher.id,
                            fullName: teacher.fullName,
                            nationalId: teacher.nationalId || "",
                            specialization: teacher.specialization || "",
                            subject: teacher.subject || "",
                            className: teacher.className || "",
                          }}
                        />
                        <TeacherDeleteButton teacherId={teacher.id} teacherName={teacher.fullName} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(160deg,#ffffff_0%,#fbfcfc_70%,#f8f4ec_100%)] p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">{teacher.fullName}</h3>
                    <p className="text-sm text-slate-500">{teacher.specialization || "التخصص غير محدد"}</p>
                  </div>
                  <Badge variant="secondary">{teacher._count.evaluations} تقييم</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <InfoPill label="المادة" value={teacher.subject || "غير محددة"} />
                  <InfoPill label="الصف" value={teacher.className || "غير محدد"} />
                  <InfoPill label="الهوية" value={teacher.nationalId || "غير متوفر"} />
                  <InfoPill label="الإضافة" value={formatDate(teacher.createdAt)} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button asChild variant="secondary" className="rounded-2xl px-3">
                    <Link href={`/dashboard/teachers/${teacher.id}`}>الملف</Link>
                  </Button>
                  <TeacherFormDialog
                    mode="edit"
                    teacher={{
                      id: teacher.id,
                      fullName: teacher.fullName,
                      nationalId: teacher.nationalId || "",
                      specialization: teacher.specialization || "",
                      subject: teacher.subject || "",
                      className: teacher.className || "",
                    }}
                  />
                  <TeacherDeleteButton teacherId={teacher.id} teacherName={teacher.fullName} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-sm">
      <p className="text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function QuickActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 sm:flex">
      {icon}
      <span>{label}</span>
    </div>
  );
}
