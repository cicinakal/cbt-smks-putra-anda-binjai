'use client';

import { useState } from 'react';

interface MultipleChoiceProps {
  question: {
    id: string;
    question: string;
    points: number;
    options: { id: string; label: string; text: string }[];
  };
  onAnswer: (questionId: string, answer: string) => void;
  savedAnswer?: string;
}

export default function MultipleChoice({
  question,
  onAnswer,
  savedAnswer,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState(savedAnswer || '');

  const handleChange = (optionId: string) => {
    setSelected(optionId);
    onAnswer(question.id, optionId);
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
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={selected === option.id}
              onChange={() => handleChange(option.id)}
              className="w-4 h-4 mr-3"
            />
            <span className="font-semibold text-gray-700 mr-3">{option.label}.</span>
            <span className="text-gray-700">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
