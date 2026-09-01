'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  subject: string;
  description?: string;
  duration: number;
  createdAt: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExams();
    }
  }, [status]);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/student/exams');
      if (res.ok) {
        const data = await res.json();
        setExams(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleStartExam = async (examId: string) => {
    try {
      const res = await fetch('/api/student/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId }),
      });
      if (res.ok) {
        router.push(`/exam/${examId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">CBT SMKS</h1>
            <p className="text-blue-100">Halo, {session?.user?.name}!</p>
          </div>
          <button
            onClick={() => fetch('/api/auth/signout').then(() => router.push('/login'))}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Ujian Tersedia
          </Link>
          <Link href="/results" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Nilai Saya
          </Link>
        </div>

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Tidak ada ujian yang tersedia</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{exam.subject}</p>
                {exam.description && (
                  <p className="text-gray-700 mb-4 line-clamp-2">{exam.description}</p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">⏱️ {exam.duration} menit</span>
                </div>
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Mulai Ujian
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
