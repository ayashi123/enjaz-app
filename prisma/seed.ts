import bcrypt from "bcryptjs";
import { EvidenceRelationType, EvidenceStatus, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const managerElements = [
  "بناء الخطة التشغيلية ومتابعة التنفيذ",
  "إدارة الاجتماعات المهنية والتغذية الراجعة",
  "متابعة الانضباط المدرسي وبيانات الغياب",
  "توثيق الشراكات والمبادرات النوعية",
];

async function main() {
  const passwordHash = await bcrypt.hash("Enjaz@12345", 12);

  const schoolManager = await prisma.user.upsert({
    where: { email: "principal@enjaz.sa" },
    update: {
      role: UserRole.SCHOOL_MANAGER,
      isActive: true,
    },
    create: {
      fullName: "أ. سارة العتيبي",
      email: "principal@enjaz.sa",
      passwordHash,
      role: UserRole.SCHOOL_MANAGER,
      isActive: true,
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

  await prisma.user.upsert({
    where: { email: "admin@enjaz.sa" },
    update: {
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      fullName: "المشرف العام",
      email: "admin@enjaz.sa",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      schoolName: "إدارة منصة إنجاز التعليمية",
      educationOffice: "الإشراف العام",
      academicYear: "1447 / 1448 هـ",
    },
  });

  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { id: "seed-teacher-1" },
      update: {},
      create: {
        id: "seed-teacher-1",
        userId: schoolManager.id,
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
        userId: schoolManager.id,
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
        userId: schoolManager.id,
        title: "محضر اجتماع أولياء الأمور",
        relatedType: EvidenceRelationType.GENERAL,
        evidenceType: "محضر",
        status: EvidenceStatus.VERIFIED,
        evidenceDate: new Date(),
        notes: "نموذج أولي لتجهيز السجل العام للشواهد.",
        attachments: ["parent-meeting.pdf"],
      },
      {
        userId: schoolManager.id,
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
        id: `${schoolManager.id}-${elementTitle}`,
      },
      update: {},
      create: {
        id: `${schoolManager.id}-${elementTitle}`,
        userId: schoolManager.id,
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
