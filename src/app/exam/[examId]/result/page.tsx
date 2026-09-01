'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ExamResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get('score');
  const total = searchParams.get('total');
  const grade = searchParams.get('grade');

  const percentage = total ? ((Number(score) / Number(total)) * 100).toFixed(1) : '0';
  const passed = Number(percentage) >= 70;

  const getGradeColor = (g: string | null) => {
    switch (g) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className={`text-6xl font-bold mb-4 ${getGradeColor(grade)}`}>{grade}</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Ujian Selesai!</h1>
        <p className="text-gray-600 mb-8">
          {passed ? 'Selamat, Anda LULUS!' : 'Maaf, Anda TIDAK LULUS'}
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Skor Anda</p>
            <p className="text-4xl font-bold text-blue-600">
              {score}/{total}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Persentase</p>
            <p className="text-3xl font-bold text-gray-800">{percentage}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            href="/results"
            className="block px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Lihat Semua Nilai
          </Link>
        </div>
      </div>
    </div>
  );
}
