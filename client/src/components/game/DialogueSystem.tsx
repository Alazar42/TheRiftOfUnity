import { useState, useEffect } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { useWorld } from "@/lib/stores/useWorld";
import { regionData } from "@/lib/gameData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DialogueOption {
  text: string;
  response: string;
  action?: () => void;
}

const DialogueSystem = () => {
  const { currentRegion, gamePhase } = useGameState();
  const { regions, setLeaderMet } = useWorld();
  
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<string>('');
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [dialogueOptions, setDialogueOptions] = useState<DialogueOption[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const startUnityDialogue = () => {
    setCurrentSpeaker("The Ancient Tree");
    setShowDialogue(true);
    setDialogueIndex(0);
    
    const dialogues = [
      "Welcome, Tsega. You have journeyed far and learned much.",
      "The five virtues flow through you now - Faith, Compassion, Strength, Wisdom, and Truth.",
      "With all five relics in your possession, you have the power to heal this fractured world.",
      "Approach closer to begin the Unity Ritual and restore balance to the land."
    ];
    
    setCurrentDialogue(dialogues[0]);
    setDialogueOptions([
      {
        text: "I understand my purpose.",
        response: "Then let the healing begin.",
        action: () => setShowDialogue(false)
      }
    ]);
  };

  useEffect(() => {
    if (currentRegion && gamePhase === 'playing') {
      const regionInfo = regionData[currentRegion];
      
      if (currentRegion === 'unity') {
        // Handle unity region separately
        startUnityDialogue();
      } else {
        const regionState = regions[currentRegion];
        if (regionInfo && regionState && !regionState.hasMetLeader) {
          startDialogue(currentRegion);
        }
      }
    }
  }, [currentRegion, regions, gamePhase]);

  const startDialogue = (regionKey: string) => {
    const regionInfo = regionData[regionKey];
    if (!regionInfo) return;

    setCurrentSpeaker(regionInfo.leader);
    setShowDialogue(true);
    setDialogueIndex(0);
    
    const dialogues = getRegionDialogue(regionKey);
    if (dialogues.length > 0) {
      setCurrentDialogue(dialogues[0]);
      setDialogueOptions(getDialogueOptions(regionKey, 0));
    }
  };

  const getRegionDialogue = (regionKey: string): string[] => {
    const dialogues: { [key: string]: string[] } = {
      faith: [
        "Welcome, traveler. I am Abba Samuel, keeper of this sacred place.",
        "The light of faith grows dim in our land. The old songs are forgotten, the rhythms lost.",
        "But you... you carry something different. A spark of hope perhaps?",
        "Complete the sacred rhythm, and perhaps the light will return to our temple."
      ],
      compassion: [
        "Greetings, young one. I am Emebet Meron, and I tend to all who suffer here.",
        "Our community is broken. Hearts have grown cold, neighbors ignore each other's pain.",
        "True compassion means seeing the need before it's spoken, feeling another's hurt as your own.",
        "Show me you understand what it means to truly care for another."
      ],
      strength: [
        "Ho there! I am Ras Dawit, guardian of these mountains.",
        "These peaks have seen many who thought themselves strong, only to be humbled.",
        "True strength isn't in the body alone - it's in the will to continue when all seems lost.",
        "Prove your endurance, and earn the respect of the mountains."
      ],
      wisdom: [
        "Peace be with you. I am Liqe Tewodros, keeper of ancient knowledge.",
        "Wisdom isn't just knowing facts - it's understanding how to use knowledge for good.",
        "The old riddles and proverbs hold truths that can guide us through any darkness.",
        "Solve the ancient puzzle, and show me you can think beyond the obvious."
      ],
      truth: [
        "At last, you arrive. I am Abuna Marcos, seeker of ultimate truth.",
        "This desert strips away all pretense, all lies we tell ourselves.",
        "Truth isn't always comfortable, but it's the foundation upon which all else must stand.",
        "Look beyond the surface, and discover what really divides our lands."
      ]
    };

    return dialogues[regionKey] || ["Welcome, traveler."];
  };

  const getDialogueOptions = (regionKey: string, index: number): DialogueOption[] => {
    if (index === 0) {
      return [
        {
          text: "Tell me more about this place.",
          response: "I'd be happy to share what I know."
        },
        {
          text: "I'm here to help restore unity.",
          response: "A noble goal. Let us see if you have what it takes."
        }
      ];
    } else if (index >= 3) {
      return [
        {
          text: "I accept your challenge.",
          response: "Then let us begin.",
          action: () => {
            setShowDialogue(false);
            setLeaderMet(regionKey);
          }
        },
        {
          text: "I need more time to prepare.",
          response: "Very well. Return when you are ready.",
          action: () => setShowDialogue(false)
        }
      ];
    } else {
      return [
        {
          text: "Continue...",
          response: "Let me tell you more..."
        }
      ];
    }
  };

  const handleDialogueChoice = (option: DialogueOption) => {
    const dialogues = getRegionDialogue(currentRegion!);
    
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
      setCurrentDialogue(dialogues[dialogueIndex + 1]);
      setDialogueOptions(getDialogueOptions(currentRegion!, dialogueIndex + 1));
    }
    
    if (option.action) {
      option.action();
    }
  };

  if (!showDialogue || !currentRegion) return null;

  const regionInfo = regionData[currentRegion];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40">
      <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-4 border-amber-400 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
              {regionInfo?.symbol || '👤'}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-amber-800">{currentSpeaker}</h3>
                <span className="text-sm text-amber-600">- {regionInfo?.name}</span>
              </div>
              
              <p className="text-gray-800 leading-relaxed">{currentDialogue}</p>
              
              <div className="space-y-2">
                {dialogueOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleDialogueChoice(option)}
                    className="w-full justify-start text-left border-amber-300 hover:bg-amber-50 text-amber-800"
                  >
                    → {option.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DialogueSystem;