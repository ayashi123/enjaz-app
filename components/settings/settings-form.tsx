"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({
  user,
  settings,
}: {
  user: { fullName: string; schoolName: string; educationOffice: string; academicYear: string } | null;
  settings: {
    schoolLogo: string | null;
    managerSignatureImage: string | null;
    officialStampImage: string | null;
    printHeader: string | null;
  } | null;
}) {
  const router = useRouter();
  const [schoolLogo, setSchoolLogo] = useState(settings?.schoolLogo || "");
  const [managerSignatureImage, setManagerSignatureImage] = useState(settings?.managerSignatureImage || "");
  const [officialStampImage, setOfficialStampImage] = useState(settings?.officialStampImage || "");
  const [printHeader, setPrintHeader] = useState(settings?.printHeader || user?.schoolName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  async function save() {
    setIsSaving(true);
    setSettingsMessage(null);

    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolLogo,
        managerSignatureImage,
        officialStampImage,
        printHeader,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      setSettingsMessage("تعذر حفظ الإعدادات.");
      return;
    }

    setSettingsMessage("تم حفظ الإعدادات بنجاح.");
    router.refresh();
  }

  async function changePassword() {
    setIsChangingPassword(true);
    setPasswordMessage(null);

    const response = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const result = await response.json().catch(() => ({}));
    setIsChangingPassword(false);

    if (!response.ok) {
      setPasswordMessage(result.message || "تعذر تغيير كلمة المرور.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("تم تغيير كلمة المرور بنجاح.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <Card className="border-white/80 bg-white/92 shadow-soft">
        <CardHeader>
          <CardTitle className="font-black">الملف المدرسي</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <ProfileInfo label="اسم المدير" value={user?.fullName || "-"} />
          <ProfileInfo label="اسم المدرسة" value={user?.schoolName || "-"} />
          <ProfileInfo label="الإدارة التعليمية" value={user?.educationOffice || "-"} />
          <ProfileInfo label="العام الدراسي" value={user?.academicYear || "-"} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="border-white/80 bg-white/92 shadow-soft">
          <CardHeader>
            <CardTitle className="font-black">هوية الطباعة والعناصر الرسمية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="عنوان رأس الطباعة">
              <Input value={printHeader} onChange={(event) => setPrintHeader(event.target.value)} />
            </Field>
            <Field label="رابط شعار المدرسة">
              <Input value={schoolLogo} onChange={(event) => setSchoolLogo(event.target.value)} />
            </Field>
            <Field label="رابط صورة توقيع المدير">
              <Textarea value={managerSignatureImage} onChange={(event) => setManagerSignatureImage(event.target.value)} />
            </Field>
            <Field label="رابط صورة الختم الرسمي">
              <Textarea value={officialStampImage} onChange={(event) => setOfficialStampImage(event.target.value)} />
            </Field>

            {settingsMessage ? (
              <div className="rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">
                {settingsMessage}
              </div>
            ) : null}

            <Button onClick={save} disabled={isSaving} className="rounded-2xl">
              {isSaving ? "جاري حفظ الإعدادات..." : "حفظ الإعدادات"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white/92 shadow-soft">
          <CardHeader>
            <CardTitle className="font-black">تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="كلمة المرور الحالية أو المؤقتة">
              <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            </Field>
            <Field label="كلمة المرور الجديدة">
              <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            </Field>
            <Field label="تأكيد كلمة المرور الجديدة">
              <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </Field>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-600">
              إذا استلمت كلمة مرور مؤقتة من المشرف العام، اكتبها في الحقل الأول ثم أدخل كلمة المرور الجديدة الخاصة بك.
            </div>

            {passwordMessage ? (
              <div className="rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">
                {passwordMessage}
              </div>
            ) : null}

            <Button onClick={changePassword} disabled={isChangingPassword} className="rounded-2xl">
              {isChangingPassword ? "جاري تحديث كلمة المرور..." : "تحديث كلمة المرور"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}
