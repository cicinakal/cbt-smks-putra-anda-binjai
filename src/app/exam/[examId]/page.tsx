'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ExamTaker from '@/components/ExamTaker';

interface StudentExam {
  id: string;
  exam: {
    id: string;
    title: string;
    duration: number;
    questions: any[];
  };
  status: string;
}

export default function ExamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && examId) {
      fetchExamData();
    }
  }, [status, examId]);

  const fetchExamData = async () => {
    try {
      const res = await fetch(`/api/student/exams/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setStudentExam(data);
      } else {
        setError('Ujian tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (answers: Record<string, any>) => {
    try {
      const res = await fetch(`/api/student/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/exam/${examId}/result?score=${result.earnedPoints}&total=${result.totalPoints}&grade=${result.grade}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !studentExam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Ujian tidak ditemukan'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <ExamTaker exam={studentExam.exam} onSubmit={handleSubmit} />;
}
