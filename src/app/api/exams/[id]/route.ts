import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getServerSession();

  if (req.method === "GET") {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            options: true,
            matchingPairs: true,
          },
        },
        creator: { select: { name: true } },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(exam);
  }

  if (req.method === "PUT") {
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, subject, description, duration, passingScore, isPublished } = await req.json();

    const exam = await prisma.exam.update({
      where: { id: params.id },
      data: {
        title,
        subject,
        description,
        duration,
        passingScore,
        isPublished,
      },
    });

    return NextResponse.json(exam);
  }
};

export { handler as GET, handler as PUT };
