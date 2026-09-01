'use client';

import { useState } from 'react';
import ExamTimer from '@/components/ExamTimer';
import MultipleChoice from '@/components/questions/MultipleChoice';
import Essay from '@/components/questions/Essay';
import TrueFalse from '@/components/questions/TrueFalse';
import MatchingTest from '@/components/questions/MatchingTest';

interface ExamTakerProps {
  exam: {
    id: string;
    title: string;
    duration: number;
    questions: any[];
  };
  onSubmit: (answers: any) => void;
}

export default function ExamTaker({ exam, onSubmit }: ExamTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleTimeUp = async () => {
    setIsSubmitting(true);
    await onSubmit(answers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(answers);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoice
            question={currentQuestion}
            onAnswer={handleAnswer}
            savedAnswer={answers[currentQuestion.id]}
          />
        );
      case 'ESSAY':
        return (
          <Essay
            question={currentQuestion}
            onAnswer={handleAnswer}
            savedAnswer={answers[currentQuestion.id]}
          />
        );
      case 'TRUE_FALSE':
        return (
          <TrueFalse
            question={currentQuestion}
            onAnswer={handleAnswer}
            savedAnswer={answers[currentQuestion.id]}
          />
        );
      case 'MATCHING':
        return (
          <MatchingTest
            question={currentQuestion}
            onAnswer={handleAnswer}
            savedAnswer={answers[currentQuestion.id]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{exam.title}</h1>
          <ExamTimer durationMinutes={exam.duration} onTimeUp={handleTimeUp} />
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-semibold">
              Soal {currentQuestionIndex + 1} dari {exam.questions.length}
            </span>
            <span className="text-gray-600">{Math.round(progress)}% Selesai</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Soal Sebelumnya
          </button>

          <div className="flex gap-2 flex-wrap justify-center">
            {exam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[exam.questions[idx].id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Selesai & Kirim'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Soal Selanjutnya →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
