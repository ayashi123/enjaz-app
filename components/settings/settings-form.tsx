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
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="border-white/80 bg-white/90 shadow-soft">
        <CardHeader>
          <CardTitle>ملف المدير والمدرسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
          <p>اسم مدير المدرسة: {user?.fullName || "-"}</p>
          <p>اسم المدرسة: {user?.schoolName || "-"}</p>
          <p>الإدارة / المكتب: {user?.educationOffice || "-"}</p>
          <p>العام الدراسي: {user?.academicYear || "-"}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="border-white/80 bg-white/90 shadow-soft">
          <CardHeader>
            <CardTitle>هوية الطباعة والعناصر الرسمية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان رأس الطباعة">
              <Input value={printHeader} onChange={(event) => setPrintHeader(event.target.value)} />
            </Field>
            <Field label="رابط شعار المدرسة">
              <Input value={schoolLogo} onChange={(event) => setSchoolLogo(event.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="رابط صورة توقيع المدير">
                <Textarea value={managerSignatureImage} onChange={(event) => setManagerSignatureImage(event.target.value)} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="رابط صورة الختم الرسمي">
                <Textarea value={officialStampImage} onChange={(event) => setOfficialStampImage(event.target.value)} />
              </Field>
            </div>
            {settingsMessage ? <div className="md:col-span-2 rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">{settingsMessage}</div> : null}
            <div className="md:col-span-2">
              <Button onClick={save} disabled={isSaving}>
                {isSaving ? "جار حفظ الإعدادات..." : "حفظ الإعدادات"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white/90 shadow-soft">
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="كلمة المرور الحالية أو المؤقتة">
              <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            </Field>
            <div />
            <Field label="كلمة المرور الجديدة">
              <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            </Field>
            <Field label="تأكيد كلمة المرور الجديدة">
              <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </Field>
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-600">
              إذا استلمت كلمة مرور مؤقتة من المشرف العام، اكتبها في الحقل الأول ثم أدخل كلمة المرور الجديدة الخاصة بك.
            </div>
            {passwordMessage ? <div className="md:col-span-2 rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">{passwordMessage}</div> : null}
            <div className="md:col-span-2">
              <Button onClick={changePassword} disabled={isChangingPassword}>
                {isChangingPassword ? "جار تحديث كلمة المرور..." : "تحديث كلمة المرور"}
              </Button>
            </div>
          </CardContent>
        </Card>
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
