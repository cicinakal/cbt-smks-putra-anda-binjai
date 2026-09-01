'use client';

import { useState } from 'react';

interface TrueFalseProps {
  question: {
    id: string;
    question: string;
    points: number;
  };
  onAnswer: (questionId: string, answer: string) => void;
  savedAnswer?: string;
}

export default function TrueFalse({ question, onAnswer, savedAnswer }: TrueFalseProps) {
  const [selected, setSelected] = useState(savedAnswer || '');

  const handleChange = (value: string) => {
    setSelected(value);
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

      <div className="space-y-3">
        {['Benar', 'Salah'].map((option) => (
          <label
            key={option}
            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={selected === option}
              onChange={() => handleChange(option)}
              className="w-4 h-4 mr-3"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
