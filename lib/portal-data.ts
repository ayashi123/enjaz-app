import { Prisma } from "@prisma/client";
import { getManagerElementDefinition, managerElementsCatalog } from "@/data/manager-elements";
import { prisma } from "@/lib/db";

function isPrismaConnectionError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  );
}

export async function ensureManagerElements(userId: string) {
  try {
    const existing = await prisma.managerElementProgress.findMany({
      where: { userId },
      select: { id: true, elementTitle: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    const validTitles = new Set(managerElementsCatalog);
    const titles = new Set<string>();
    const duplicateIds: string[] = [];

    for (const item of existing) {
      if (!validTitles.has(item.elementTitle)) {
        duplicateIds.push(item.id);
        continue;
      }

      if (titles.has(item.elementTitle)) {
        duplicateIds.push(item.id);
        continue;
      }

      titles.add(item.elementTitle);
    }

    const missing = managerElementsCatalog.filter((title) => !titles.has(title));

    if (duplicateIds.length > 0) {
      await prisma.managerElementProgress.deleteMany({
        where: {
          userId,
          id: { in: duplicateIds },
        },
      });
    }

    if (missing.length > 0) {
      await prisma.managerElementProgress.createMany({
        data: missing.map((title) => ({
          userId,
          elementTitle: title,
          isDone: false,
        })),
      });
    }
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
  }
}

export type PortalDashboardData = {
  isDatabaseReady: boolean;
  metrics: {
    totalTeachers: number;
    totalEvaluations: number;
    averageTeacherPerformance: number;
    managerCompletionRate: number;
    totalEvidences: number;
    readyReportsCount: number;
  };
  latestEvaluations: Array<{
    id: string;
    teacherName: string;
    finalScore: number;
    performanceLabel: string;
    visitDate: Date;
  }>;
  latestEvidences: Array<{
    id: string;
    title: string;
    evidenceType: string;
    evidenceDate: Date;
    status: string;
  }>;
  managerFollowUps: Array<{
    id: string;
    elementTitle: string;
    updatedAt: Date;
  }>;
  teacherDirectory: Array<{
    id: string;
    fullName: string;
    subject: string | null;
    className: string | null;
    evaluationsCount: number;
  }>;
  chartData: Array<{ name: string; score: number }>;
};

export type TeacherProfileData = {
  isDatabaseReady: boolean;
  teacher: {
    id: string;
    fullName: string;
    nationalId: string | null;
    specialization: string | null;
    subject: string | null;
    className: string | null;
    createdAt: Date;
  } | null;
  evaluations: Array<{
    id: string;
    followupNo: string;
    lessonTitle: string;
    visitDate: Date;
    finalScoreOutOfFive: number;
    performanceLabel: string;
  }>;
  evidences: Array<{
    id: string;
    title: string;
    evidenceType: string;
    evidenceDate: Date;
    status: string;
  }>;
};

export async function getDashboardData(userId: string): Promise<PortalDashboardData> {
  try {
    await ensureManagerElements(userId);
    const [
      totalTeachers,
      allEvaluations,
      totalEvidences,
      managerElements,
      latestEvaluations,
      latestEvidences,
      teacherDirectory,
    ] = await Promise.all([
      prisma.teacher.count({ where: { userId } }),
      prisma.teacherEvaluation.findMany({
        where: { userId },
        select: {
          id: true,
          finalScoreOutOfFive: true,
          performanceLabel: true,
          visitDate: true,
          teacher: { select: { fullName: true } },
        },
        orderBy: { visitDate: "asc" },
      }),
      prisma.evidence.count({ where: { userId } }),
      prisma.managerElementProgress.findMany({
        where: { userId },
        select: { id: true, isDone: true, elementTitle: true, updatedAt: true },
        orderBy: { updatedAt: "asc" },
      }),
      prisma.teacherEvaluation.findMany({
        where: { userId },
        select: {
          id: true,
          finalScoreOutOfFive: true,
          performanceLabel: true,
          visitDate: true,
          teacher: { select: { fullName: true } },
        },
        orderBy: { visitDate: "desc" },
        take: 4,
      }),
      prisma.evidence.findMany({
        where: { userId },
        select: { id: true, title: true, evidenceType: true, evidenceDate: true, status: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.teacher.findMany({
        where: { userId },
        select: {
          id: true,
          fullName: true,
          subject: true,
          className: true,
          _count: { select: { evaluations: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    const averageTeacherPerformance =
      allEvaluations.length > 0
        ? allEvaluations.reduce((sum, item) => sum + Number(item.finalScoreOutOfFive), 0) / allEvaluations.length
        : 0;

    return {
      isDatabaseReady: true,
      metrics: {
        totalTeachers,
        totalEvaluations: allEvaluations.length,
        averageTeacherPerformance,
        managerCompletionRate:
          managerElements.length > 0
            ? (managerElements.filter((item) => item.isDone).length / managerElements.length) * 100
            : 0,
        totalEvidences,
        readyReportsCount: allEvaluations.length,
      },
      latestEvaluations: latestEvaluations.map((item) => ({
        id: item.id,
        teacherName: item.teacher.fullName,
        finalScore: Number(item.finalScoreOutOfFive),
        performanceLabel: item.performanceLabel,
        visitDate: item.visitDate,
      })),
      latestEvidences: latestEvidences.map((item) => ({ ...item, status: item.status })),
      managerFollowUps: managerElements
        .filter((item) => !item.isDone)
        .slice(0, 4)
        .map((item) => ({ id: item.id, elementTitle: item.elementTitle, updatedAt: item.updatedAt })),
      teacherDirectory: teacherDirectory.map((item) => ({
        id: item.id,
        fullName: item.fullName,
        subject: item.subject,
        className: item.className,
        evaluationsCount: item._count.evaluations,
      })),
      chartData: allEvaluations.slice(-6).map((item, index) => ({
        name: `زيارة ${index + 1}`,
        score: Number(item.finalScoreOutOfFive),
      })),
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return {
        isDatabaseReady: false,
        metrics: {
          totalTeachers: 0,
          totalEvaluations: 0,
          averageTeacherPerformance: 0,
          managerCompletionRate: 0,
          totalEvidences: 0,
          readyReportsCount: 0,
        },
        latestEvaluations: [],
        latestEvidences: [],
        managerFollowUps: [],
        teacherDirectory: [],
        chartData: [],
      };
    }
    throw error;
  }
}

export async function getTeachersData(userId: string) {
  try {
    return {
      isDatabaseReady: true,
      teachers: await prisma.teacher.findMany({
        where: { userId },
        select: {
          id: true,
          fullName: true,
          nationalId: true,
          specialization: true,
          subject: true,
          className: true,
          createdAt: true,
          _count: { select: { evaluations: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) return { isDatabaseReady: false, teachers: [] };
    throw error;
  }
}

export async function getTeacherProfileData(userId: string, teacherId: string): Promise<TeacherProfileData> {
  try {
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, userId },
      select: {
        id: true,
        fullName: true,
        nationalId: true,
        specialization: true,
        subject: true,
        className: true,
        createdAt: true,
      },
    });

    if (!teacher) {
      return { isDatabaseReady: true, teacher: null, evaluations: [], evidences: [] };
    }

    const [evaluations, evidences] = await Promise.all([
      prisma.teacherEvaluation.findMany({
        where: { userId, teacherId },
        select: {
          id: true,
          followupNo: true,
          lessonTitle: true,
          visitDate: true,
          finalScoreOutOfFive: true,
          performanceLabel: true,
        },
        orderBy: { visitDate: "desc" },
      }),
      prisma.evidence.findMany({
        where: { userId, relatedType: "TEACHER", relatedRef: teacherId },
        select: { id: true, title: true, evidenceType: true, evidenceDate: true, status: true },
        orderBy: { evidenceDate: "desc" },
      }),
    ]);

    return {
      isDatabaseReady: true,
      teacher,
      evaluations: evaluations.map((item) => ({ ...item, finalScoreOutOfFive: Number(item.finalScoreOutOfFive) })),
      evidences: evidences.map((item) => ({ ...item, status: item.status })),
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, teacher: null, evaluations: [], evidences: [] };
    }
    throw error;
  }
}

export async function getEvaluationWorkspaceData(userId: string) {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        subject: true,
        className: true,
        specialization: true,
        nationalId: true,
      },
      orderBy: { fullName: "asc" },
    });

    const evaluations = await prisma.teacherEvaluation.findMany({
      where: { userId },
      select: {
        id: true,
        teacher: { select: { fullName: true } },
        visitDate: true,
        lessonTitle: true,
        finalScoreOutOfFive: true,
        performanceLabel: true,
      },
      orderBy: { visitDate: "desc" },
    });

    return {
      isDatabaseReady: true,
      teachers,
      evaluations: evaluations.map((item) => ({
        id: item.id,
        teacherName: item.teacher.fullName,
        visitDate: item.visitDate,
        lessonTitle: item.lessonTitle,
        finalScoreOutOfFive: Number(item.finalScoreOutOfFive),
        performanceLabel: item.performanceLabel,
      })),
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, teachers: [], evaluations: [] };
    }
    throw error;
  }
}

export async function getEvaluationEditorData(userId: string, evaluationId: string) {
  try {
    const [teachers, evaluation] = await Promise.all([
      prisma.teacher.findMany({
        where: { userId },
        select: {
          id: true,
          fullName: true,
          subject: true,
          className: true,
          specialization: true,
          nationalId: true,
        },
        orderBy: { fullName: "asc" },
      }),
      prisma.teacherEvaluation.findFirst({
        where: { id: evaluationId, userId },
        select: {
          id: true,
          teacherId: true,
          followupNo: true,
          visitDate: true,
          lessonTitle: true,
          managerName: true,
          teacherSignature: true,
          managerSignature: true,
          rubricJson: true,
        },
      }),
    ]);

    return {
      isDatabaseReady: true,
      teachers,
      evaluation,
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, teachers: [], evaluation: null };
    }
    throw error;
  }
}

export async function getEvidenceWorkspaceData(userId: string) {
  try {
    await ensureManagerElements(userId);
    const [teachers, evaluations, managerElements, evidences] = await Promise.all([
      prisma.teacher.findMany({ where: { userId }, select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
      prisma.teacherEvaluation.findMany({
        where: { userId },
        select: { id: true, teacher: { select: { fullName: true } }, visitDate: true },
        orderBy: { visitDate: "desc" },
      }),
      prisma.managerElementProgress.findMany({
        where: { userId },
        select: { id: true, elementTitle: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.evidence.findMany({
        where: { userId },
        orderBy: { evidenceDate: "desc" },
      }),
    ]);

    return {
      isDatabaseReady: true,
      teachers,
      evaluations: evaluations.map((item) => ({
        id: item.id,
        label: `${item.teacher.fullName} - ${item.visitDate.toLocaleDateString("ar-SA")}`,
      })),
      managerElements,
      evidences,
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, teachers: [], evaluations: [], managerElements: [], evidences: [] };
    }
    throw error;
  }
}

export async function getManagerElementsData(userId: string) {
  try {
    await ensureManagerElements(userId);
    const [elements, evidences] = await Promise.all([
      prisma.managerElementProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.evidence.findMany({
        where: { userId, relatedType: "MANAGER_ELEMENT" },
        select: { relatedRef: true },
      }),
    ]);
    const evidenceMap = evidences.reduce<Record<string, number>>((acc, evidence) => {
      if (evidence.relatedRef) acc[evidence.relatedRef] = (acc[evidence.relatedRef] || 0) + 1;
      return acc;
    }, {});

    return {
      isDatabaseReady: true,
      elements,
      evidenceMap,
      completedCount: elements.filter((item) => item.isDone).length,
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, elements: [], evidenceMap: {}, completedCount: 0 };
    }
    throw error;
  }
}

export async function getManagerElementDetail(userId: string, id: string) {
  try {
    await ensureManagerElements(userId);

    const element = await prisma.managerElementProgress.findFirst({
      where: { id, userId },
    });

    if (!element) {
      return { isDatabaseReady: true, element: null, definition: null, evidences: [] };
    }

    const evidences = await prisma.evidence.findMany({
      where: {
        userId,
        relatedType: "MANAGER_ELEMENT",
        relatedRef: id,
      },
      orderBy: { evidenceDate: "desc" },
    });

    return {
      isDatabaseReady: true,
      element,
      definition: getManagerElementDefinition(element.elementTitle) || null,
      evidences,
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return { isDatabaseReady: false, element: null, definition: null, evidences: [] };
    }
    throw error;
  }
}

export async function getReportsData(userId: string) {
  try {
    const reports = await prisma.teacherEvaluation.findMany({
      where: { userId },
      select: {
        id: true,
        followupNo: true,
        visitDate: true,
        lessonTitle: true,
        finalScoreOutOfFive: true,
        performanceLabel: true,
        teacher: { select: { fullName: true } },
      },
      orderBy: { visitDate: "desc" },
    });

    return {
      isDatabaseReady: true,
      reports: reports.map((item) => ({
        id: item.id,
        teacherName: item.teacher.fullName,
        followupNo: item.followupNo,
        visitDate: item.visitDate,
        lessonTitle: item.lessonTitle,
        finalScoreOutOfFive: Number(item.finalScoreOutOfFive),
        performanceLabel: item.performanceLabel,
      })),
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) return { isDatabaseReady: false, reports: [] };
    throw error;
  }
}

export async function getReportById(userId: string, id: string) {
  try {
    const report = await prisma.teacherEvaluation.findFirst({
      where: { id, userId },
      select: {
        id: true,
        followupNo: true,
        visitDate: true,
        lessonTitle: true,
        finalScoreOutOfFive: true,
        performanceLabel: true,
        strengths: true,
        developmentPoints: true,
        aiFeedback: true,
        managerName: true,
        teacherSignature: true,
        managerSignature: true,
        rubricJson: true,
        teacher: {
          select: {
            fullName: true,
            nationalId: true,
            specialization: true,
            subject: true,
            className: true,
          },
        },
        user: {
          select: {
            fullName: true,
            schoolName: true,
            educationOffice: true,
            academicYear: true,
            schoolSettings: {
              select: {
                schoolLogo: true,
                printHeader: true,
                managerSignatureImage: true,
                officialStampImage: true,
              },
            },
          },
        },
      },
    });

    return report;
  } catch (error) {
    if (isPrismaConnectionError(error)) return null;
    throw error;
  }
}

export async function getSettingsData(userId: string) {
  try {
    const [user, settings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, schoolName: true, educationOffice: true, academicYear: true },
      }),
      prisma.schoolSettings.findUnique({ where: { userId } }),
    ]);
    return { isDatabaseReady: true, user, settings };
  } catch (error) {
    if (isPrismaConnectionError(error)) return { isDatabaseReady: false, user: null, settings: null };
    throw error;
  }
}
