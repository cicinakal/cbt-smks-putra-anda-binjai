'use client';

import { useState } from 'react';

interface EssayProps {
  question: {
    id: string;
    question: string;
    points: number;
  };
  onAnswer: (questionId: string, answer: string) => void;
  savedAnswer?: string;
}

export default function Essay({ question, onAnswer, savedAnswer }: EssayProps) {
  const [answer, setAnswer] = useState(savedAnswer || '');

  const handleChange = (value: string) => {
    setAnswer(value);
    onAnswer(question.id, value);
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {question.question}
        </h3>
        <p className="text-sm text-gray-600">Poin: {question.points}</p>
      </div>

      <textarea
        value={answer}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Jawab pertanyaan di sini..."
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={6}
      />
    </div>
  );
}
