'use client';

import { useState } from 'react';

interface MatchingTestProps {
  question: {
    id: string;
    question: string;
    points: number;
    matchingPairs: { id: string; leftItem: string; rightItem: string }[];
  };
  onAnswer: (questionId: string, answer: any) => void;
  savedAnswer?: any;
}

export default function MatchingTest({
  question,
  onAnswer,
  savedAnswer,
}: MatchingTestProps) {
  const [answers, setAnswers] = useState(savedAnswer || {});
  const rightItems = question.matchingPairs.map((p) => p.rightItem);
  const [shuffledRight] = useState(() => {
    return [...rightItems].sort(() => Math.random() - 0.5);
  });

  const handleMatch = (leftItem: string, rightItem: string) => {
    const newAnswers = { ...answers, [leftItem]: rightItem };
    setAnswers(newAnswers);
    onAnswer(question.id, newAnswers);
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-white">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {question.question}
        </h3>
        <p className="text-sm text-gray-600">Poin: {question.points}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Kolom Kiri</h4>
          <div className="space-y-3">
            {question.matchingPairs.map((pair) => (
              <div key={pair.id} className="p-3 bg-gray-100 rounded-lg">
                {pair.leftItem}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Kolom Kanan</h4>
          <div className="space-y-3">
            {shuffledRight.map((item, idx) => (
              <select
                key={idx}
                onChange={(e) => {
                  const leftItem = question.matchingPairs.find(
                    (p) => p.rightItem === item
                  )?.leftItem;
                  if (leftItem) handleMatch(leftItem, e.target.value);
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{item}</option>
                {question.matchingPairs.map((pair) => (
                  <option key={pair.leftItem} value={pair.leftItem}>
                    {pair.leftItem}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
