import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useWorld } from "@/lib/stores/useWorld";
import WorldMap from "./WorldMap";
import GameUI from "./GameUI";
import DialogueSystem from "./DialogueSystem";
import PuzzleSystem from "./PuzzleSystem";
import UnityRitual from "./UnityRitual";

const GameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { gamePhase, currentRegion } = useGameState();
  const { position, setPosition } = usePlayer();
  const { regions } = useWorld();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setIsInitialized(true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw game world
      drawBackground(ctx, canvas.width, canvas.height);
      
      if (gamePhase === 'playing') {
        // Update and draw game elements
        updateGame();
        drawGame(ctx, canvas.width, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, gamePhase, position, regions]);

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Ethiopian-inspired gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.5, '#CD853F');
    gradient.addColorStop(1, '#DEB887');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add Ethiopian pattern overlay
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  const updateGame = () => {
    // Game logic updates will be handled by individual components
    // This is where we'd update physics, check collisions, etc.
  };

  const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw the world and player directly in the main game loop
    drawWorldAndPlayer(ctx, width, height);
  };

  const drawWorldAndPlayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const regionRadius = Math.min(width, height) * 0.15;
    const orbitRadius = Math.min(width, height) * 0.3;

    // Draw Tree of Unity (center)
    drawTreeOfUnity(ctx, centerX, centerY);

    // Draw regions in circular arrangement
    const regionKeys = ['faith', 'compassion', 'strength', 'wisdom', 'truth'];
    regionKeys.forEach((key, index) => {
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
      const regionX = centerX + Math.cos(angle) * orbitRadius;
      const regionY = centerY + Math.sin(angle) * orbitRadius;
      
      const isUnlocked = true; // For now, make all regions visible
      const isCompleted = regions[key]?.isCompleted || false;
      
      drawRegion(ctx, regionX, regionY, regionRadius, key, isUnlocked, isCompleted);
      
      // Draw connecting paths
      if (isUnlocked) {
        drawPath(ctx, centerX, centerY, regionX, regionY);
      }
    });

    // Draw player
    drawPlayer(ctx, position.x, position.y);
  };

  const drawTreeOfUnity = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const completedRegions = Object.values(regions).filter(r => r.isCompleted).length;
    const alpha = Math.min(1, completedRegions / 5);
    
    // Tree trunk
    ctx.fillStyle = `rgba(139, 69, 19, ${0.5 + alpha * 0.5})`;
    ctx.fillRect(x - 8, y - 20, 16, 40);
    
    // Tree crown
    ctx.beginPath();
    ctx.arc(x, y - 20, 30, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(50, 205, 50, ${0.3 + alpha * 0.7})`;
    ctx.fill();
    
    // Unity glow effect
    if (completedRegions === 5) {
      ctx.beginPath();
      ctx.arc(x, y - 20, 50, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fill();
    }
    
    // Label
    ctx.fillStyle = '#FFD700';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Tree of Unity', x, y + 40);
  };

  const drawRegion = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    radius: number, 
    regionKey: string,
    isUnlocked: boolean, 
    isCompleted: boolean
  ) => {
    const regionColors: { [key: string]: string } = {
      faith: '#FFD700',
      compassion: '#FF6B6B',
      strength: '#8B4513',
      wisdom: '#4682B4',
      truth: '#DEB887'
    };
    
    const regionNames: { [key: string]: string } = {
      faith: 'Faith',
      compassion: 'Compassion',
      strength: 'Strength',
      wisdom: 'Wisdom',
      truth: 'Truth'
    };

    // Region circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (isCompleted) {
      ctx.fillStyle = regionColors[regionKey] + 'CC';
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
    } else if (isUnlocked) {
      ctx.fillStyle = regionColors[regionKey] + '88';
      ctx.strokeStyle = regionColors[regionKey];
      ctx.lineWidth = 2;
    } else {
      ctx.fillStyle = '#444444';
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;
    }
    
    ctx.fill();
    ctx.stroke();

    // Region symbol/pattern
    if (isUnlocked) {
      const symbols: { [key: string]: string } = {
        faith: '✨',
        compassion: '❤️',
        strength: '⛰️',
        wisdom: '📚',
        truth: '🔍'
      };
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(symbols[regionKey] || '●', x, y + 8);
    }

    // Region label
    ctx.fillStyle = isUnlocked ? '#FFFFFF' : '#AAAAAA';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(regionNames[regionKey], x, y + radius + 20);
  };

  const drawPath = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Simple animation (bobbing effect)
    const time = Date.now() * 0.005;
    const bob = Math.sin(time) * 2;
    
    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 12, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Player body (larger and more visible)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 12, y - 20 + bob, 24, 32);
    
    // Player head (larger)
    ctx.beginPath();
    ctx.arc(x, y - 28 + bob, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#DEB887';
    ctx.fill();
    
    // Traditional Ethiopian clothing pattern (more prominent)
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x - 10, y - 16 + bob, 20, 3);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - 10, y - 10 + bob, 20, 3);
    
    // Simple face
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 4, y - 32 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 4, y - 32 + bob, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // White outline to make player more visible
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 28 + bob, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeRect(x - 12, y - 20 + bob, 24, 32);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gamePhase !== 'playing') return;

    const speed = 8;
    let newX = position.x;
    let newY = position.y;

    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        newY = Math.max(50, position.y - speed);
        break;
      case 's':
      case 'arrowdown':
        newY = Math.min(window.innerHeight - 50, position.y + speed);
        break;
      case 'a':
      case 'arrowleft':
        newX = Math.max(50, position.x - speed);
        break;
      case 'd':
      case 'arrowright':
        newX = Math.min(window.innerWidth - 50, position.x + speed);
        break;
    }

    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, position]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {isInitialized && (
        <>
          <WorldMap canvasRef={canvasRef} />
          <GameUI />
          <DialogueSystem />
          <PuzzleSystem />
          <UnityRitual />
        </>
      )}
    </div>
  );
};

export default GameEngine;
