import { useEffect, useState } from "react";
import { useWorld } from "@/lib/stores/useWorld";
import { useGameState } from "@/lib/stores/useGameState";
import { regionData } from "@/lib/gameData";

interface RegionProps {
  regionKey: string;
  onEnter?: () => void;
  onExit?: () => void;
}

const Region = ({ regionKey, onEnter, onExit }: RegionProps) => {
  const { regions, unlockRegion, completeRegion } = useWorld();
  const { currentRegion } = useGameState();
  const [isEntered, setIsEntered] = useState(false);

  const regionInfo = regionData[regionKey];
  const regionState = regions[regionKey];

  useEffect(() => {
    if (currentRegion === regionKey && !isEntered) {
      setIsEntered(true);
      onEnter?.();
      
      // Show region entry message
      console.log(`Entered ${regionInfo?.name} - ${regionInfo?.description}`);
    } else if (currentRegion !== regionKey && isEntered) {
      setIsEntered(false);
      onExit?.();
    }
  }, [currentRegion, regionKey, isEntered, onEnter, onExit, regionInfo]);

  const handleRegionCompletion = () => {
    if (regionState && !regionState.isCompleted) {
      completeRegion(regionKey);
      
      // Unlock next region based on story progression
      const regionOrder = ['faith', 'compassion', 'strength', 'wisdom', 'truth'];
      const currentIndex = regionOrder.indexOf(regionKey);
      
      if (currentIndex >= 0 && currentIndex < regionOrder.length - 1) {
        const nextRegion = regionOrder[currentIndex + 1];
        unlockRegion(nextRegion);
      }
    }
  };

  return null; // This component handles logic only
};

export default Region;
