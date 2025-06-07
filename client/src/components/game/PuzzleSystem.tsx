import { useState, useEffect } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { useWorld } from "@/lib/stores/useWorld";
import { useAudio } from "@/lib/stores/useAudio";
import { puzzleData } from "@/lib/puzzles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const PuzzleSystem = () => {
  const { currentRegion, gamePhase } = useGameState();
  const { regions, completeRegion, addRelic } = useWorld();
  const { playSuccess, playHit } = useAudio();
  
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [puzzleProgress, setPuzzleProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentRegion && gamePhase === 'playing' && currentRegion !== 'unity') {
      const regionState = regions[currentRegion];
      // Only show puzzle AFTER leader has been met (dialogue completed)
      if (regionState && !regionState.isCompleted && regionState.hasMetLeader) {
        const puzzle = puzzleData[currentRegion];
        if (puzzle) {
          setCurrentPuzzle(puzzle);
          setShowPuzzle(true);
          setIsCompleted(false);
          setPuzzleProgress(0);
          setUserAnswer('');
        }
      }
    } else {
      setShowPuzzle(false);
      setCurrentPuzzle(null);
    }
  }, [currentRegion, regions, gamePhase]);

  const handlePuzzleSubmit = () => {
    if (!currentPuzzle || !currentRegion) return;

    const isCorrect = checkAnswer(currentPuzzle, userAnswer);
    
    if (isCorrect) {
      playSuccess();
      setIsCompleted(true);
      setPuzzleProgress(100);
      
      // Complete the region and add relic
      setTimeout(() => {
        completeRegion(currentRegion);
        addRelic({
          id: currentRegion,
          name: `${currentPuzzle.virtue} Relic`,
          description: `A sacred relic representing the virtue of ${currentPuzzle.virtue}`,
          virtue: currentPuzzle.virtue
        });
        setShowPuzzle(false);
      }, 2000);
    } else {
      playHit();
      // Give feedback for wrong answer
      alert('Not quite right. Think about the virtue this region represents.');
    }
  };

  const checkAnswer = (puzzle: any, answer: string): boolean => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = puzzle.answer.toLowerCase().trim();
    
    return normalizedAnswer === normalizedCorrect || 
           puzzle.alternativeAnswers?.some((alt: string) => 
             alt.toLowerCase().trim() === normalizedAnswer
           );
  };

  const renderSpecificPuzzle = () => {
    if (!currentPuzzle) return null;

    switch (currentRegion) {
      case 'faith':
        return renderFaithPuzzle();
      case 'compassion':
        return renderCompassionPuzzle();
      case 'strength':
        return renderStrengthPuzzle();
      case 'wisdom':
        return renderWisdomPuzzle();
      case 'truth':
        return renderTruthPuzzle();
      default:
        return renderGenericPuzzle();
    }
  };

  const renderFaithPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">Listen to the rhythm of the sacred drums. Complete the pattern:</p>
      <div className="flex space-x-2 justify-center">
        {[1, 2, 3, 4, 5].map((beat) => (
          <div
            key={beat}
            className={`w-8 h-8 rounded-full border-2 border-yellow-400 ${
              beat <= 3 ? 'bg-yellow-400' : 'bg-transparent'
            }`}
          />
        ))}
        <span className="text-xl">?</span>
      </div>
      <Input
        placeholder="What comes next? (strong/weak)"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="text-center"
      />
    </div>
  );

  const renderCompassionPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">A traveler arrives hungry and tired. What would you offer first?</p>
      <div className="grid grid-cols-2 gap-2">
        {['Food', 'Shelter', 'Listening ear', 'Directions'].map((option) => (
          <Button
            key={option}
            variant={userAnswer === option ? "default" : "outline"}
            onClick={() => setUserAnswer(option)}
            className="text-sm"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderStrengthPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">You face a massive boulder blocking your path. How do you proceed?</p>
      <Progress value={puzzleProgress} className="w-full" />
      <div className="text-center">
        <Button
          onClick={() => {
            setPuzzleProgress(prev => Math.min(100, prev + 10));
            if (puzzleProgress >= 90) {
              setUserAnswer('persistence');
            }
          }}
          disabled={puzzleProgress >= 100}
        >
          Push with determination ({Math.floor(puzzleProgress)}%)
        </Button>
      </div>
    </div>
  );

  const renderWisdomPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">An ancient riddle:</p>
      <blockquote className="border-l-4 border-blue-500 pl-4 italic">
        "I am not seen, yet I guide the way.<br />
        I am not heard, yet I speak each day.<br />
        In books I live, in minds I grow.<br />
        What am I?"
      </blockquote>
      <Input
        placeholder="Enter your answer..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="text-center"
      />
    </div>
  );

  const renderTruthPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">Examine these statements and find the one truth:</p>
      <div className="space-y-2">
        {[
          'The journey matters more than the destination',
          'Unity comes from forcing everyone to be the same',
          'Truth is whatever makes you feel good',
          'Strength means never asking for help'
        ].map((statement, index) => (
          <Button
            key={index}
            variant={userAnswer === statement ? "default" : "outline"}
            onClick={() => setUserAnswer(statement)}
            className="w-full text-left justify-start text-sm"
          >
            {statement}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderGenericPuzzle = () => (
    <div className="space-y-4">
      <p className="text-lg">{currentPuzzle.question}</p>
      <Input
        placeholder="Enter your answer..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="text-center"
      />
    </div>
  );

  if (!showPuzzle || !currentPuzzle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-400">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-800">
            {currentPuzzle.title}
          </CardTitle>
          <p className="text-amber-700">{currentPuzzle.virtue} Challenge</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSpecificPuzzle()}
          
          {!isCompleted && (
            <div className="flex space-x-2">
              <Button 
                onClick={handlePuzzleSubmit}
                disabled={!userAnswer}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                Submit Answer
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowPuzzle(false)}
                className="border-amber-400 text-amber-700"
              >
                Close
              </Button>
            </div>
          )}
          
          {isCompleted && (
            <div className="text-center space-y-4">
              <div className="text-2xl text-green-600">✨ Puzzle Completed! ✨</div>
              <p className="text-amber-800">
                You have earned the {currentPuzzle.virtue} Relic!
              </p>
              <Progress value={puzzleProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuzzleSystem;
