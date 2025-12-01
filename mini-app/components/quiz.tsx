"use client";

import { useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

const questions = [
  {
    question: "What’s your favorite type of snack?",
    answers: [
      { text: "Fish", animal: "cat" as Animal },
      { text: "Bones", animal: "dog" as Animal },
      { text: "Berries", animal: "fox" as Animal },
      { text: "Seeds", animal: "hamster" as Animal },
      { text: "Hay", animal: "horse" as Animal },
    ],
  },
  {
    question: "Which activity sounds most fun to you?",
    answers: [
      { text: "Chasing a laser", animal: "cat" as Animal },
      { text: "Playing fetch", animal: "dog" as Animal },
      { text: "Hunting in the woods", animal: "fox" as Animal },
      { text: "Running in a wheel", animal: "hamster" as Animal },
      { text: "Riding a trail", animal: "horse" as Animal },
    ],
  },
  {
    question: "What’s your ideal living space?",
    answers: [
      { text: "A cozy apartment", animal: "cat" as Animal },
      { text: "A big backyard", animal: "dog" as Animal },
      { text: "A forest", animal: "fox" as Animal },
      { text: "A small cage", animal: "hamster" as Animal },
      { text: "An open field", animal: "horse" as Animal },
    ],
  },
  {
    question: "How do you handle stress?",
    answers: [
      { text: "Curl up and nap", animal: "cat" as Animal },
      { text: "Run around", animal: "dog" as Animal },
      { text: "Hide in a burrow", animal: "fox" as Animal },
      { text: "Spin in circles", animal: "hamster" as Animal },
      { text: "Stand tall", animal: "horse" as Animal },
    ],
  },
  {
    question: "What’s your favorite color?",
    answers: [
      { text: "Black & white", animal: "cat" as Animal },
      { text: "Brown & golden", animal: "dog" as Animal },
      { text: "Orange & brown", animal: "fox" as Animal },
      { text: "Pink & purple", animal: "hamster" as Animal },
      { text: "White & gray", animal: "horse" as Animal },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Animal, number>>({
    cat: 0,
    dog: 0,
    fox: 0,
    hamster: 0,
    horse: 0,
  });
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (animal: Animal) => {
    setScores((prev) => ({ ...prev, [animal]: prev[animal] + 1 }));
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScores({
      cat: 0,
      dog: 0,
      fox: 0,
      hamster: 0,
      horse: 0,
    });
    setCompleted(false);
  };

  if (completed) {
    const maxScore = Math.max(...Object.values(scores));
    const bestAnimals = Object.entries(scores)
      .filter(([, s]) => s === maxScore)
      .map(([a]) => a as Animal);

    const resultAnimal = bestAnimals[0]; // pick first in case of tie
    const imageSrc = `/${resultAnimal}.png`;
    const resultText = `You are most like a ${resultAnimal}!`;

    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">{resultText}</h2>
        <img src={imageSrc} alt={resultAnimal} width={512} height={512} />
        <Share text={`${resultText} ${url}`} />
        <button
          className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground"
          onClick={resetQuiz}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const shuffledAnswers = shuffleArray(questions[current].answers);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-medium">{questions[current].question}</h3>
      <div className="flex flex-col gap-2">
        {shuffledAnswers.map((ans, idx) => (
          <button
            key={idx}
            className="px-4 py-2 rounded bg-secondary text-secondary-foreground"
            onClick={() => handleAnswer(ans.animal)}
          >
            {ans.text}
          </button>
        ))}
      </div>
    </div>
  );
}
