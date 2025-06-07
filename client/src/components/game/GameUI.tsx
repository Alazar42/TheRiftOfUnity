import { useState } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { useWorld } from "@/lib/stores/useWorld";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Inventory from "./Inventory";

const GameUI = () => {
  const { gamePhase, currentRegion, startGame, pauseGame } = useGameState();
  const { relics, regions } = useWorld();
  const { isMuted, toggleMute } = useAudio();
  const [showMenu, setShowMenu] = useState(false);

  const completedRegions = Object.values(regions).filter(r => r.isCompleted).length;
  const gameProgress = (completedRegions / 5) * 100;

  const handleSaveGame = () => {
    const gameState = {
      regions,
      relics,
      completedRegions,
      timestamp: Date.now()
    };
    localStorage.setItem('riftOfUnitySave', JSON.stringify(gameState));
    alert('Game saved successfully!');
  };

  const handleLoadGame = () => {
    const saved = localStorage.getItem('riftOfUnitySave');
    if (saved) {
      // Here you would implement the actual loading logic
      alert('Game loaded! (Loading functionality to be implemented)');
    } else {
      alert('No saved game found.');
    }
  };

  if (gamePhase === 'menu') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-500 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">
                The Rift of Unity
              </h1>
              <p className="text-lg text-amber-800">
                A journey through the virtues of Ethiopian wisdom
              </p>
              <div className="w-24 h-1 bg-amber-600 mx-auto rounded"></div>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-amber-700 leading-relaxed">
                In a world fractured by forgotten virtues, you are Tsega, 
                a traveler born in the land of Faith. Your mission: restore 
                unity to the five sacred regions and heal the world.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={startGame}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-3"
              >
                Begin Journey
              </Button>
              <Button 
                onClick={handleLoadGame}
                variant="outline"
                className="w-full border-amber-400 text-amber-700 hover:bg-amber-50"
              >
                Continue Saved Game
              </Button>
            </div>
            
            <div className="text-xs text-amber-600 space-y-1">
              <p>Use WASD or Arrow Keys to move</p>
              <p>Approach regions to enter and solve virtue-based puzzles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Top HUD */}
      <div className="fixed top-4 left-4 z-30">
        <Card className="bg-black bg-opacity-75 text-white border-amber-400">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">Progress:</span>
              <Progress value={gameProgress} className="w-20" />
              <span className="text-xs">{completedRegions}/5</span>
            </div>
            
            {currentRegion && (
              <div className="text-sm">
                <span className="text-amber-400">Current:</span> {currentRegion}
              </div>
            )}
            
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowMenu(!showMenu)}
                className="text-xs border-amber-400 text-amber-300 hover:bg-amber-900"
              >
                Menu
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleMute}
                className="text-xs border-amber-400 text-amber-300 hover:bg-amber-900"
              >
                {isMuted ? '🔇' : '🔊'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-400">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-center text-amber-800">Game Menu</h2>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleSaveGame}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Save Game
                </Button>
                <Button 
                  onClick={handleLoadGame}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-700"
                >
                  Load Game
                </Button>
                <Button 
                  onClick={toggleMute}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-700"
                >
                  {isMuted ? 'Unmute Sound' : 'Mute Sound'}
                </Button>
                <Button 
                  onClick={() => setShowMenu(false)}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-700"
                >
                  Resume Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Help */}
      <div className="fixed bottom-4 left-4 z-30">
        <Card className="bg-black bg-opacity-75 text-white border-amber-400">
          <CardContent className="p-2">
            <div className="text-xs space-y-1">
              <div>WASD / Arrows: Move</div>
              <div>Enter regions to solve puzzles</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Component */}
      <Inventory />

      {/* Unity Ritual Notification */}
      {relics.length === 5 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <Card className="bg-gradient-to-r from-yellow-200 to-amber-300 border-4 border-yellow-500 shadow-2xl animate-pulse">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                🌟 All Relics Collected! 🌟
              </h2>
              <p className="text-yellow-700 mb-4">
                Return to the Tree of Unity to perform the final ritual!
              </p>
              <div className="text-4xl">🌳✨</div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default GameUI;
