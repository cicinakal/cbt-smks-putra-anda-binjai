'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Result {
  id: string;
  student: { name: string; email: string };
  exam: { title: string; subject: string };
  result?: { earnedPoints: number; totalPoints: number; percentage: number; grade: string; passed: boolean };
  submittedAt?: string;
}

export default function AdminResults() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResults();
    }
  }, [status]);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/admin/results');
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
            <h1 className="text-3xl font-bold">CBT Admin</h1>
            <p className="text-blue-100">Hasil Ujian Siswa</p>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Kelola Ujian
          </Link>
          <Link href="/admin/results" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Hasil Ujian
          </Link>
        </div>

        {/* Results Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Ujian</p>
            <p className="text-3xl font-bold text-blue-600">{results.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Lulus</p>
            <p className="text-3xl font-bold text-green-600">
              {results.filter((r) => r.result?.passed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Tidak Lulus</p>
            <p className="text-3xl font-bold text-red-600">
              {results.filter((r) => !r.result?.passed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Rata-rata</p>
            <p className="text-3xl font-bold text-orange-600">
              {(
                results.reduce((sum, r) => sum + (r.result?.percentage || 0), 0) / results.length
              ).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Belum ada hasil ujian</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Nama Siswa</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Nama Ujian</th>
                    <th className="px-6 py-3 text-center">Nilai</th>
                    <th className="px-6 py-3 text-center">Persentase</th>
                    <th className="px-6 py-3 text-center">Grade</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-left">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-800">{result.student.name}</td>
                      <td className="px-6 py-3 text-gray-600 text-sm">{result.student.email}</td>
                      <td className="px-6 py-3 text-gray-700">{result.exam.title}</td>
                      <td className="px-6 py-3 text-center font-bold">
                        {result.result?.earnedPoints}/{result.result?.totalPoints}
                      </td>
                      <td className="px-6 py-3 text-center">{result.result?.percentage.toFixed(1)}%</td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
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
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                            result.result?.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {result.result?.passed ? 'LULUS' : 'TIDAK LULUS'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {result.submittedAt
                          ? new Date(result.submittedAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
