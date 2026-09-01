import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const session = await getServerSession();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    const results = await prisma.studentExam.findMany({
      include: {
        student: { select: { name: true, email: true } },
        exam: { select: { title: true, subject: true } },
        result: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(results);
  }
};

export { handler as GET };
