'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  isPublished: boolean;
  questions: any[];
  creator: { name: string };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 60,
    passingScore: 70,
    totalPoints: 100,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExams();
    }
  }, [status]);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exams');
      if (res.ok) {
        const data = await res.json();
        setExams(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          title: '',
          subject: '',
          description: '',
          duration: 60,
          passingScore: 70,
          totalPoints: 100,
        });
        setShowForm(false);
        fetchExams();
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
            <h1 className="text-3xl font-bold">CBT Admin</h1>
            <p className="text-blue-100">Dashboard Admin - {session?.user?.name}</p>
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
        <div className="flex gap-4 mb-8 flex-wrap">
          <Link href="/admin/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Kelola Ujian
          </Link>
          <Link href="/admin/results" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Hasil Ujian
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg ml-auto"
          >
            {showForm ? '✕ Batal' : '+ Buat Ujian Baru'}
          </button>
        </div>

        {/* Create Exam Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Buat Ujian Baru</h2>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Judul Ujian</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Ujian Matematika Semester 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Matematika"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi ujian (opsional)"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Durasi (menit)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Total Poin</label>
                  <input
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">KKM (%)</label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Buat Ujian
              </button>
            </form>
          </div>
        )}

        {/* Exams List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{exam.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    exam.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {exam.isPublished ? 'Dipublikasikan' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exam.subject}</p>
              <p className="text-xs text-gray-500 mb-4">Dibuat oleh: {exam.creator.name}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <p>⏱️ Durasi: {exam.duration} menit</p>
                <p>❓ Soal: {exam.questions.length} pertanyaan</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/exam/${exam.id}/questions`}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-center text-sm font-semibold"
                >
                  Kelola Soal
                </Link>
                <Link
                  href={`/admin/exam/${exam.id}/edit`}
                  className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 text-center text-sm font-semibold"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
