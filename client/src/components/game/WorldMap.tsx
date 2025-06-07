import { useEffect, useRef } from "react";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useWorld } from "@/lib/stores/useWorld";
import { useGameState } from "@/lib/stores/useGameState";
import { regionData } from "@/lib/gameData";

interface WorldMapProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const WorldMap = ({ canvasRef }: WorldMapProps) => {
  const { position } = usePlayer();
  const { regions, unlockedRegions } = useWorld();
  const { setCurrentRegion } = useGameState();
  const lastRegionCheck = useRef<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawWorld(ctx, canvas.width, canvas.height);
    checkRegionTransition();
  }, [position, regions, unlockedRegions]);

  const drawWorld = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const regionRadius = Math.min(width, height) * 0.15;
    const orbitRadius = Math.min(width, height) * 0.3;

    // Clear any previous drawings
    ctx.save();

    // Draw Tree of Unity (center)
    drawTreeOfUnity(ctx, centerX, centerY);

    // Draw regions in circular arrangement
    Object.entries(regionData).forEach(([key, region], index) => {
      if (key === 'unity') return; // Skip unity region for now

      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
      const regionX = centerX + Math.cos(angle) * orbitRadius;
      const regionY = centerY + Math.sin(angle) * orbitRadius;
      
      const isUnlocked = unlockedRegions.includes(key);
      const isCompleted = regions[key]?.isCompleted || false;
      
      drawRegion(ctx, regionX, regionY, regionRadius, region, isUnlocked, isCompleted);
      
      // Draw connecting paths
      if (isUnlocked) {
        drawPath(ctx, centerX, centerY, regionX, regionY);
      }
    });

    // Draw player - make sure this is always visible
    drawPlayer(ctx, position.x, position.y);
    
    ctx.restore();
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
    region: any, 
    isUnlocked: boolean, 
    isCompleted: boolean
  ) => {
    // Region circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (isCompleted) {
      ctx.fillStyle = region.color + 'CC';
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
    } else if (isUnlocked) {
      ctx.fillStyle = region.color + '88';
      ctx.strokeStyle = region.color;
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
      drawRegionSymbol(ctx, x, y, region.name);
    }

    // Region label
    ctx.fillStyle = isUnlocked ? '#FFFFFF' : '#AAAAAA';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(region.name, x, y + radius + 20);
  };

  const drawRegionSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, regionName: string) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    
    const symbols: { [key: string]: string } = {
      'Faith': '✨',
      'Compassion': '❤️',
      'Strength': '⛰️',
      'Wisdom': '📚',
      'Truth': '🔍'
    };
    
    ctx.fillText(symbols[regionName] || '●', x, y + 8);
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

  const checkRegionTransition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const orbitRadius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const regionRadius = Math.min(window.innerWidth, window.innerHeight) * 0.15;

    // Check Tree of Unity
    const distanceToCenter = Math.sqrt(
      (position.x - centerX) ** 2 + (position.y - centerY) ** 2
    );
    
    if (distanceToCenter < 50) {
      if (lastRegionCheck.current !== 'unity') {
        setCurrentRegion('unity');
        lastRegionCheck.current = 'unity';
      }
      return;
    }

    // Check regions
    Object.keys(regionData).forEach((key, index) => {
      if (key === 'unity') return;
      
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
      const regionX = centerX + Math.cos(angle) * orbitRadius;
      const regionY = centerY + Math.sin(angle) * orbitRadius;
      
      const distance = Math.sqrt(
        (position.x - regionX) ** 2 + (position.y - regionY) ** 2
      );
      
      if (distance < regionRadius && unlockedRegions.includes(key)) {
        if (lastRegionCheck.current !== key) {
          setCurrentRegion(key);
          lastRegionCheck.current = key;
        }
        return;
      }
    });

    // If not in any region, clear current region
    if (lastRegionCheck.current && distanceToCenter > 50) {
      let inAnyRegion = false;
      Object.keys(regionData).forEach((key, index) => {
        if (key === 'unity') return;
        
        const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
        const regionX = centerX + Math.cos(angle) * orbitRadius;
        const regionY = centerY + Math.sin(angle) * orbitRadius;
        
        const distance = Math.sqrt(
          (position.x - regionX) ** 2 + (position.y - regionY) ** 2
        );
        
        if (distance < regionRadius * 1.2) {
          inAnyRegion = true;
        }
      });
      
      if (!inAnyRegion) {
        setCurrentRegion(null);
        lastRegionCheck.current = null;
      }
    }
  };

  return null; // This component only handles rendering on the canvas
};

export default WorldMap;
