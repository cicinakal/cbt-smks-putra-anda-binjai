import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    const exams = await prisma.exam.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
        duration: true,
        createdAt: true,
      },
    });

    return NextResponse.json(exams);
  }

  if (req.method === "POST") {
    const { examId } = await req.json();

    const studentExam = await prisma.studentExam.create({
      data: {
        studentId: (session.user as any).id,
        examId,
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    return NextResponse.json(studentExam, { status: 201 });
  }
};

export { handler as GET, handler as POST };
