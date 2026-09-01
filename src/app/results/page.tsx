'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StudentResult {
  id: string;
  exam: { title: string; subject: string };
  result?: { earnedPoints: number; totalPoints: number; percentage: number; grade: string };
  submittedAt?: string;
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResults();
    }
  }, [status]);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/student/results');
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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
            <p className="text-blue-100">Nilai Ujian Saya</p>
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
          <Link href="/dashboard" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Ujian Tersedia
          </Link>
          <Link href="/results" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Nilai Saya
          </Link>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Belum ada nilai ujian</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nama Ujian</th>
                  <th className="px-6 py-3 text-left">Mata Pelajaran</th>
                  <th className="px-6 py-3 text-center">Nilai</th>
                  <th className="px-6 py-3 text-center">Persentase</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3 text-left">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{result.exam.title}</td>
                    <td className="px-6 py-3">{result.exam.subject}</td>
                    <td className="px-6 py-3 text-center">
                      {result.result?.earnedPoints}/{result.result?.totalPoints}
                    </td>
                    <td className="px-6 py-3 text-center">{result.result?.percentage.toFixed(1)}%</td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-bold ${
                          result.result?.grade === 'A'
                            ? 'bg-green-500'
                            : result.result?.grade === 'B'
                            ? 'bg-blue-500'
                            : result.result?.grade === 'C'
                            ? 'bg-yellow-500'
                            : result.result?.grade === 'D'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {result.result?.grade}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {result.submittedAt
                        ? new Date(result.submittedAt).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
