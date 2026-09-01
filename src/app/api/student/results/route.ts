import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    const results = await prisma.studentExam.findMany({
      where: {
        studentId: (session.user as any).id,
      },
      include: {
        exam: { select: { title: true, subject: true } },
        result: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(results);
  }
};

export { handler as GET };
