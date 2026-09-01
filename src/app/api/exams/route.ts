import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const session = await getServerSession();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (req.method === "GET") {
    const exams = await prisma.exam.findMany({
      include: {
        questions: true,
        creator: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(exams);
  }

  if (req.method === "POST") {
    const { title, subject, description, duration, passingScore, totalPoints } = await req.json();

    const exam = await prisma.exam.create({
      data: {
        title,
        subject,
        description,
        duration,
        passingScore,
        totalPoints,
        createdBy: (session.user as any).id,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  }
};

export { handler as GET, handler as POST };
