import bcrypt from "bcryptjs";
import { PrismaClient, EvidenceRelationType, EvidenceStatus } from "@prisma/client";

const prisma = new PrismaClient();

const managerElements = [
  "بناء الخطة التشغيلية ومتابعة التنفيذ",
  "إدارة الاجتماعات المهنية والتغذية الراجعة",
  "متابعة الانضباط المدرسي وبيانات الغياب",
  "توثيق الشراكات والمبادرات النوعية",
];

async function main() {
  const passwordHash = await bcrypt.hash("Enjaz@12345", 12);

  const user = await prisma.user.upsert({
    where: { email: "principal@enjaz.sa" },
    update: {},
    create: {
      fullName: "أ. سارة العتيبي",
      email: "principal@enjaz.sa",
      passwordHash,
      schoolName: "مدرسة إنجاز النموذجية",
      educationOffice: "مكتب تعليم شمال الرياض",
      academicYear: "1447 / 1448 هـ",
      schoolSettings: {
        create: {
          printHeader: "مدرسة إنجاز النموذجية - تقارير الأداء التعليمي",
        },
      },
    },
  });

  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { id: "seed-teacher-1" },
      update: {},
      create: {
        id: "seed-teacher-1",
        userId: user.id,
        fullName: "أ. نوف المطيري",
        nationalId: "1023456789",
        specialization: "اللغة العربية",
        subject: "لغتي الخالدة",
        className: "الأول المتوسط",
      },
    }),
    prisma.teacher.upsert({
      where: { id: "seed-teacher-2" },
      update: {},
      create: {
        id: "seed-teacher-2",
        userId: user.id,
        fullName: "أ. فيصل الحربي",
        nationalId: "1034567890",
        specialization: "الرياضيات",
        subject: "الرياضيات",
        className: "الثالث المتوسط",
      },
    }),
  ]);

  await prisma.evidence.createMany({
    data: [
      {
        userId: user.id,
        title: "محضر اجتماع أولياء الأمور",
        relatedType: EvidenceRelationType.GENERAL,
        evidenceType: "محضر",
        status: EvidenceStatus.VERIFIED,
        evidenceDate: new Date(),
        notes: "نموذج أولي لتجهيز السجل العام للشواهد.",
        attachments: ["parent-meeting.pdf"],
      },
      {
        userId: user.id,
        title: "خطة دعم نتائج المتعلمين",
        relatedType: EvidenceRelationType.TEACHER,
        relatedRef: teachers[0].id,
        evidenceType: "خطة علاجية",
        status: EvidenceStatus.DRAFT,
        evidenceDate: new Date(),
        notes: "ترتبط بمعلمة اللغة العربية.",
        attachments: ["support-plan.docx"],
      },
    ],
    skipDuplicates: true,
  });

  for (const elementTitle of managerElements) {
    await prisma.managerElementProgress.upsert({
      where: {
        id: `${user.id}-${elementTitle}`,
      },
      update: {},
      create: {
        id: `${user.id}-${elementTitle}`,
        userId: user.id,
        elementTitle,
        isDone: elementTitle !== managerElements[2],
        notes: "تم إنشاؤه عبر seed لتهيئة لوحة القيادة.",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
