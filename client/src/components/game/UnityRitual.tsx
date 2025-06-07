import { useState, useEffect } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { useWorld } from "@/lib/stores/useWorld";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useAudio } from "@/lib/stores/useAudio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const UnityRitual = () => {
  const { currentRegion, endGame } = useGameState();
  const { relics, worldTransformation } = useWorld();
  const { position } = usePlayer();
  const { playSuccess } = useAudio();
  
  const [showRitual, setShowRitual] = useState(false);
  const [ritualProgress, setRitualProgress] = useState(0);
  const [ritualPhase, setRitualPhase] = useState<'start' | 'inProgress' | 'complete'>('start');
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Check if player is at Tree of Unity with all relics
    if (currentRegion === 'unity' && relics.length === 5) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distance = Math.sqrt(
        (position.x - centerX) ** 2 + (position.y - centerY) ** 2
      );
      
      if (distance < 60 && !showRitual) {
        setShowRitual(true);
        setCurrentMessage("You stand before the ancient Tree of Unity, all five sacred relics in your possession. The time has come to heal the fractured world.");
      }
    }
  }, [currentRegion, relics.length, position, showRitual]);

  const startRitual = () => {
    setRitualPhase('inProgress');
    setCurrentMessage("You place the relics around the Tree of Unity...");
    
    // Simulate ritual progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setRitualProgress(progress);
      
      if (progress === 30) {
        setCurrentMessage("The Faith relic begins to glow with golden light...");
      } else if (progress === 50) {
        setCurrentMessage("Compassion's warmth spreads through the land...");
      } else if (progress === 70) {
        setCurrentMessage("Strength reinforces the bonds between regions...");
      } else if (progress === 90) {
        setCurrentMessage("Wisdom illuminates the path forward...");
      } else if (progress === 100) {
        setCurrentMessage("Truth reveals the world reborn in unity!");
        setRitualPhase('complete');
        playSuccess();
        clearInterval(interval);
        
        // End game after showing completion
        setTimeout(() => {
          endGame();
        }, 3000);
      }
    }, 1000);
  };

  const renderRitualContent = () => {
    switch (ritualPhase) {
      case 'start':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">🌳</div>
            <p className="text-lg leading-relaxed text-amber-800">
              {currentMessage}
            </p>
            
            <div className="grid grid-cols-5 gap-2 my-6">
              {relics.map((relic, index) => (
                <div key={relic.id} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto">
                    {index === 0 ? '✨' : index === 1 ? '❤️' : index === 2 ? '⛰️' : index === 3 ? '📚' : '🔍'}
                  </div>
                  <p className="text-xs text-amber-700">{relic.virtue}</p>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={startRitual}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
            >
              Begin Unity Ritual
            </Button>
          </div>
        );
        
      case 'inProgress':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4 animate-pulse">🌳✨</div>
            <p className="text-lg leading-relaxed text-amber-800">
              {currentMessage}
            </p>
            
            <Progress value={ritualProgress} className="w-full h-4" />
            <p className="text-sm text-amber-600">Ritual Progress: {ritualProgress}%</p>
            
            <div className="grid grid-cols-5 gap-2 my-6">
              {relics.map((relic, index) => {
                const isActive = ritualProgress >= (index + 1) * 20;
                return (
                  <div key={relic.id} className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse shadow-lg' 
                        : 'bg-gray-400'
                    }`}>
                      {index === 0 ? '✨' : index === 1 ? '❤️' : index === 2 ? '⛰️' : index === 3 ? '📚' : '🔍'}
                    </div>
                    <p className="text-xs text-amber-700">{relic.virtue}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div className="text-8xl mb-4 animate-bounce">🌍✨</div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Unity Restored!
            </h2>
            <p className="text-lg leading-relaxed text-amber-800">
              {currentMessage}
            </p>
            
            <div className="bg-gradient-to-r from-green-200 to-yellow-200 p-6 rounded-lg border-2 border-green-500">
              <p className="text-green-800 font-semibold">
                The fractured world is whole once more. The five virtues flow freely between the regions, 
                bringing peace, understanding, and prosperity to all who dwell within.
              </p>
            </div>
            
            <div className="text-2xl">🎉 Congratulations, Tsega! 🎉</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!showRitual) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl bg-gradient-to-br from-amber-50 to-orange-100 border-4 border-amber-500 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-amber-800">
            The Unity Ritual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderRitualContent()}
          
          {ritualPhase === 'start' && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline"
                onClick={() => setShowRitual(false)}
                className="border-amber-400 text-amber-700"
              >
                Not Yet Ready
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnityRitual;