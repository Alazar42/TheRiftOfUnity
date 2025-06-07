import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGameState } from "@/lib/stores/useGameState";

const SoundManager = () => {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  const { gamePhase, currentRegion } = useGameState();
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio files
    const backgroundMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');

    // Configure background music
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusicRef.current = backgroundMusic;

    // Configure sound effects
    hitSound.volume = 0.5;
    successSound.volume = 0.6;

    // Set audio in store
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    return () => {
      // Cleanup
      backgroundMusic.pause();
      backgroundMusic.src = '';
      hitSound.src = '';
      successSound.src = '';
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  useEffect(() => {
    const backgroundMusic = backgroundMusicRef.current;
    if (!backgroundMusic) return;

    if (gamePhase === 'playing' && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log('Background music play prevented:', error);
      });
    } else {
      backgroundMusic.pause();
    }

    return () => {
      backgroundMusic.pause();
    };
  }, [gamePhase, isMuted]);

  useEffect(() => {
    // Adjust music based on current region
    const backgroundMusic = backgroundMusicRef.current;
    if (!backgroundMusic || isMuted) return;

    if (currentRegion) {
      // Different regions could have different background music volumes or filters
      switch (currentRegion) {
        case 'faith':
          backgroundMusic.volume = 0.4;
          break;
        case 'compassion':
          backgroundMusic.volume = 0.3;
          break;
        case 'strength':
          backgroundMusic.volume = 0.5;
          break;
        case 'wisdom':
          backgroundMusic.volume = 0.2;
          break;
        case 'truth':
          backgroundMusic.volume = 0.3;
          break;
        case 'unity':
          backgroundMusic.volume = 0.6;
          break;
        default:
          backgroundMusic.volume = 0.3;
      }
    } else {
      backgroundMusic.volume = 0.3;
    }
  }, [currentRegion, isMuted]);

  // This component doesn't render anything
  return null;
};

export default SoundManager;
