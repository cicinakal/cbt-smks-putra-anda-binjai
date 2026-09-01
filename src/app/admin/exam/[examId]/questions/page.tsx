'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  type: string;
  question: string;
  points: number;
  options?: { id: string; label: string; text: string }[];
  matchingPairs?: { id: string; leftItem: string; rightItem: string }[];
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
}

export default function ManageQuestions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [questionType, setQuestionType] = useState('MULTIPLE_CHOICE');
  const [formData, setFormData] = useState({
    question: '',
    points: 1,
    correctAnswer: '',
    options: [{ label: 'A', text: '' }],
    matchingPairs: [{ leftItem: '', rightItem: '' }],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && examId) {
      fetchExam();
    }
  }, [status, examId]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exams/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;

    try {
      const payload: any = {
        type: questionType,
        question: formData.question,
        points: formData.points,
      };

      if (questionType === 'MULTIPLE_CHOICE') {
        payload.options = formData.options.map((opt, idx) => ({
          label: ['A', 'B', 'C', 'D', 'E'][idx] || 'A',
          text: opt.text,
        }));
        payload.correctAnswer = formData.correctAnswer;
      } else if (questionType === 'TRUE_FALSE') {
        payload.correctAnswer = formData.correctAnswer;
      } else if (questionType === 'MATCHING') {
        payload.matchingPairs = formData.matchingPairs;
      }

      const res = await fetch(`/api/exams/${examId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({
          question: '',
          points: 1,
          correctAnswer: '',
          options: [{ label: 'A', text: '' }],
          matchingPairs: [{ leftItem: '', rightItem: '' }],
        });
        setShowForm(false);
        fetchExam();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!exam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Ujian tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/admin/dashboard" className="text-blue-100 hover:text-white mb-2 inline-block">
            ← Kembali
          </Link>
          <h1 className="text-3xl font-bold">Kelola Soal</h1>
          <p className="text-blue-100">{exam.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Total Soal: {exam.questions.length}</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {showForm ? '✕ Batal' : '+ Tambah Soal'}
          </button>
        </div>

        {/* Add Question Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Tambah Soal Baru</h3>
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Jenis Soal</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                  <option value="ESSAY">Uraian</option>
                  <option value="TRUE_FALSE">Benar/Salah</option>
                  <option value="MATCHING">Pencocokan</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pertanyaan</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan pertanyaan"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Poin</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              {/* Multiple Choice Options */}
              {questionType === 'MULTIPLE_CHOICE' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Pilihan Jawaban</label>
                  <div className="space-y-3 mb-4">
                    {formData.options.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="w-12 flex items-center font-bold text-gray-700">
                          {['A', 'B', 'C', 'D', 'E'][idx]}.
                        </span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[idx].text = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Pilihan jawaban"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  {formData.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          options: [
                            ...formData.options,
                            { label: '', text: '' },
                          ],
                        })
                      }
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      + Tambah Pilihan
                    </button>
                  )}
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Jawaban Benar</label>
                    <select
                      value={formData.correctAnswer}
                      onChange={(e) =>
                        setFormData({ ...formData, correctAnswer: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Pilih jawaban benar --</option>
                      {formData.options.map((_, idx) => (
                        <option key={idx} value={formData.options[idx].text}>
                          {['A', 'B', 'C', 'D', 'E'][idx]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* True/False */}
              {questionType === 'TRUE_FALSE' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Jawaban Benar</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) =>
                      setFormData({ ...formData, correctAnswer: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Pilih jawaban --</option>
                    <option value="Benar">Benar</option>
                    <option value="Salah">Salah</option>
                  </select>
                </div>
              )}

              {/* Matching Pairs */}
              {questionType === 'MATCHING' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Pasangan Jawaban</label>
                  <div className="space-y-3">
                    {formData.matchingPairs.map((pair, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={pair.leftItem}
                          onChange={(e) => {
                            const newPairs = [...formData.matchingPairs];
                            newPairs[idx].leftItem = e.target.value;
                            setFormData({ ...formData, matchingPairs: newPairs });
                          }}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Item kiri"
                          required
                        />
                        <input
                          type="text"
                          value={pair.rightItem}
                          onChange={(e) => {
                            const newPairs = [...formData.matchingPairs];
                            newPairs[idx].rightItem = e.target.value;
                            setFormData({ ...formData, matchingPairs: newPairs });
                          }}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Item kanan (jawaban benar)"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        matchingPairs: [...formData.matchingPairs, { leftItem: '', rightItem: '' }],
                      })
                    }
                    className="text-blue-600 hover:underline font-semibold mt-3"
                  >
                    + Tambah Pasangan
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Tambah Soal
              </button>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg">
                  {idx + 1}. {q.question}
                </h3>
                <div className="space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {q.type === 'MULTIPLE_CHOICE' && 'Pilihan Ganda'}
                    {q.type === 'ESSAY' && 'Uraian'}
                    {q.type === 'TRUE_FALSE' && 'Benar/Salah'}
                    {q.type === 'MATCHING' && 'Pencocokan'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {q.points} poin
                  </span>
                </div>
              </div>

              {/* Display question details */}
              {q.type === 'MULTIPLE_CHOICE' && q.options && (
                <div className="ml-6 text-sm text-gray-700 space-y-1">
                  {q.options.map((opt) => (
                    <p key={opt.id}>{opt.label}. {opt.text}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
