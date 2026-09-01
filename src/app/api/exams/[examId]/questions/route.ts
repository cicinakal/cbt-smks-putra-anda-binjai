import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, { params }: { params: { examId: string } }) => {
  const session = await getServerSession();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "POST") {
    const { type, question, points, options, matchingPairs, correctAnswer } = await req.json();

    const newQuestion = await prisma.question.create({
      data: {
        examId: params.examId,
        type,
        question,
        points,
        correctAnswer,
        createdBy: (session.user as any).id,
        options: {
          create: options || [],
        },
        matchingPairs: {
          create: matchingPairs || [],
        },
      },
      include: {
        options: true,
        matchingPairs: true,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  }
};

export { handler as POST };
