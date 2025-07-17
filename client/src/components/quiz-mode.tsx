
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generatePhonicsData } from "@/lib/phonics";
import type { Settings } from "@/pages/home";

interface QuizModeProps {
  name: string;
  onComplete: (score: number) => void;
  onGoBack: () => void;
  settings: Settings;
}

export default function QuizMode({ name, onComplete, onGoBack, settings }: QuizModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const phonicsData = generatePhonicsData(name);
  const totalQuestions = phonicsData.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const currentPhonics = phonicsData[currentQuestion];
  
  // Generate multiple choice options
  const generateOptions = () => {
    const correctSound = currentPhonics.sound;
    const allSounds = phonicsData.map(p => p.sound);
    const wrongSounds = allSounds.filter(s => s !== correctSound);
    const randomWrong = wrongSounds.sort(() => Math.random() - 0.5).slice(0, 2);
    return [correctSound, ...randomWrong].sort(() => Math.random() - 0.5);
  };

  const [options] = useState(generateOptions());

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentPhonics.sound) {
      setScore(score + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        onComplete(score);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={onGoBack}>← Back</Button>
            <h2 className="text-2xl font-bold">Quiz: {name}</h2>
            <div className="text-sm text-gray-600">{currentQuestion + 1}/{totalQuestions}</div>
          </div>

          <Progress value={progress} className="mb-6" />

          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-purple-600 mb-4">
              {currentPhonics.letter}
            </div>
            <p className="text-xl text-gray-700">What sound does this letter make?</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={showResult ? 
                  (option === currentPhonics.sound ? "default" : 
                   option === selectedAnswer ? "destructive" : "secondary") 
                  : "outline"}
                size="lg"
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                className="text-2xl py-6"
              >
                {option}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 text-center">
              <p className={`text-xl font-bold ${
                selectedAnswer === currentPhonics.sound ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedAnswer === currentPhonics.sound ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-gray-600 mt-2">Score: {score}/{currentQuestion + 1}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
