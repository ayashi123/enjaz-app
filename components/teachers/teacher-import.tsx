"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FileUp, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function normalizeKey(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function findHeaderRow(rows: unknown[][], aliases: string[]) {
  return rows.findIndex((row) =>
    row.some((cell) => {
      if (cell === undefined || cell === null) return false;
      const value = normalizeKey(String(cell));
      return aliases.some((alias) => normalizeKey(alias) === value);
    }),
  );
}

function createRowObject(headers: unknown[], values: unknown[]) {
  return Object.fromEntries(
    headers.map((header, index) => [String(header ?? `column_${index}`), values[index] ?? ""]),
  ) as Record<string, unknown>;
}

function getField(row: Record<string, unknown>, aliases: string[]) {
  const normalizedRow = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));

  for (const alias of aliases) {
    const value = normalizedRow[normalizeKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

function hasAnyColumn(row: Record<string, unknown>, aliases: string[]) {
  const normalizedKeys = Object.keys(row).map(normalizeKey);
  return aliases.some((alias) => normalizedKeys.includes(normalizeKey(alias)));
}

export function TeacherImportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      const headerRowIndex = findHeaderRow(rawRows, [
        "اسم المعلم",
        "الاسم",
        "الأسم",
        "teacherName",
        "fullName",
        "name",
      ]);

      if (headerRowIndex === -1) {
        window.alert("لم يتم العثور على صف عناوين صالح داخل الملف. تأكد من وجود عمود للاسم مثل: الاسم أو الأسم.");
        return;
      }

      const headers = rawRows[headerRowIndex];
      const rows = rawRows
        .slice(headerRowIndex + 1)
        .map((row) => createRowObject(headers, row))
        .filter((row) => Object.values(row).some((value) => String(value ?? "").trim() !== ""));

      const looksLikeSchoolStatsReport = rows.some((row) =>
        hasAnyColumn(row, [
          "المدرسة",
          "الرقم الاحصائي",
          "نسبة الانجاز",
          "المعلمين الذين تم تأكيد بياناتهم",
          "المعلمين الذين لم يتم تأكيد بياناتهم",
        ]),
      );

      const teachers = rows
        .map((row) => ({
          fullName: getField(row, ["اسم المعلم", "الاسم", "الأسم", "fullName", "name", "teacherName"]),
          nationalId: getField(row, ["رقم الهوية", "السجل المدني", "nationalId", "idNumber", "national_id"]),
          specialization: getField(row, ["التخصص", "التخصص التعليمي", "specialization"]),
          subject: getField(row, ["المادة", "التخصص التعليمي", "subject"]),
          className: getField(row, ["الصف", "الفصل", "class", "className"]),
        }))
        .filter((teacher) => teacher.fullName && !["معلم", "معلمة"].includes(teacher.fullName));

      if (looksLikeSchoolStatsReport && teachers.length === 0) {
        window.alert(
          "الملف الذي اخترته يبدو تقريرًا إحصائيًا للمدرسة وليس كشفًا بأسماء المعلمين. للاستيراد نحتاج ملفًا يحتوي صفًا لكل معلم مثل: اسم المعلم، رقم الهوية، التخصص، المادة، الصف.",
        );
        return;
      }

      if (teachers.length === 0) {
        window.alert("لم يتم العثور على صفوف صالحة للاستيراد. تأكد من وجود عمود مثل: اسم المعلم أو الاسم.");
        return;
      }

      const response = await fetch("/api/teachers/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teachers }),
      });

      const result = (await response.json()) as { message?: string; count?: number };

      if (!response.ok) {
        window.alert(result.message || "تعذر استيراد بيانات المعلمين.");
        return;
      }

      window.alert(`تم استيراد ${result.count || teachers.length} معلم/معلمة بنجاح.`);
      window.location.reload();
    } catch {
      window.alert("تعذر قراءة ملف Excel أو CSV. تأكد من سلامة الملف ثم أعد المحاولة.");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
      <Button type="button" variant="outline" disabled={isLoading} onClick={() => inputRef.current?.click()}>
        {isLoading ? <LoaderCircle className="ml-2 h-4 w-4 animate-spin" /> : <FileUp className="ml-2 h-4 w-4" />}
        استيراد Excel / CSV
      </Button>
    </>
  );
}
