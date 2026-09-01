import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, { params }: { params: { examId: string } }) => {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    const studentExam = await prisma.studentExam.findFirst({
      where: {
        studentId: (session.user as any).id,
        examId: params.examId,
      },
      include: {
        exam: {
          include: {
            questions: {
              include: {
                options: true,
                matchingPairs: true,
              },
            },
          },
        },
        studentAnswers: true,
      },
    });

    if (!studentExam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(studentExam);
  }

  if (req.method === "POST") {
    const { answers } = await req.json();

    const studentExam = await prisma.studentExam.findFirst({
      where: {
        studentId: (session.user as any).id,
        examId: params.examId,
      },
      include: {
        exam: true,
      },
    });

    if (!studentExam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
    }

    // Delete existing answers
    await prisma.studentAnswer.deleteMany({
      where: { studentExamId: studentExam.id },
    });

    // Create new answers
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) continue;

      let isCorrect = false;
      let points = 0;

      if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
        isCorrect = answer === question.correctAnswer;
        if (isCorrect) points = question.points;
      } else if (question.type === "MATCHING") {
        // Matching will be manually graded
        points = 0;
      }
      // Essay answers are manually graded

      await prisma.studentAnswer.create({
        data: {
          studentExamId: studentExam.id,
          questionId,
          answerText: typeof answer === "string" ? answer : JSON.stringify(answer),
          selectedOption: question.type === "MULTIPLE_CHOICE" ? (answer as string) : null,
          isCorrect: question.type === "ESSAY" ? null : isCorrect,
          points: question.type === "ESSAY" ? null : points,
        },
      });
    }

    // Calculate total score
    const studentAnswers = await prisma.studentAnswer.findMany({
      where: { studentExamId: studentExam.id },
    });

    const earnedPoints = studentAnswers.reduce((sum, a) => sum + (a.points || 0), 0);
    const percentage = (earnedPoints / studentExam.exam.totalPoints) * 100;
    const passed = percentage >= studentExam.exam.passingScore;

    const grade =
      percentage >= 90 ? "A" :
      percentage >= 80 ? "B" :
      percentage >= 70 ? "C" :
      percentage >= 60 ? "D" : "F";

    // Update exam result
    const result = await prisma.examResult.upsert({
      where: { studentExamId: studentExam.id },
      update: {
        earnedPoints,
        percentage,
        grade,
        passed,
      },
      create: {
        studentExamId: studentExam.id,
        totalPoints: studentExam.exam.totalPoints,
        earnedPoints,
        percentage,
        grade,
        passed,
      },
    });

    // Update student exam status
    await prisma.studentExam.update({
      where: { id: studentExam.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        timeSpent: Math.floor(
          (new Date().getTime() - studentExam.startedAt!.getTime()) / 1000
        ),
      },
    });

    return NextResponse.json(result, { status: 201 });
  }
};

export { handler as GET, handler as POST };
