import { useEffect } from "react";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useGameState } from "@/lib/stores/useGameState";

const Player = () => {
  const { position, setPosition, playerStats } = usePlayer();
  const { gamePhase } = useGameState();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gamePhase !== 'playing') return;

      const speed = 3;
      let newX = position.x;
      let newY = position.y;

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(0, position.y - speed);
          break;
        case 's':
        case 'arrowdown':
          newY = Math.min(window.innerHeight - 32, position.y + speed);
          break;
        case 'a':
        case 'arrowleft':
          newX = Math.max(0, position.x - speed);
          break;
        case 'd':
        case 'arrowright':
          newX = Math.min(window.innerWidth - 32, position.x + speed);
          break;
      }

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [position, setPosition, gamePhase]);

  return null; // Player rendering is handled by WorldMap component
};

export default Player;
