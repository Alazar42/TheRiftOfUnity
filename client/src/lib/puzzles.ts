export interface Puzzle {
  id: string;
  title: string;
  virtue: string;
  question: string;
  answer: string;
  alternativeAnswers?: string[];
  hint: string;
  culturalContext: string;
}

export const puzzleData: { [key: string]: Puzzle } = {
  faith: {
    id: 'faith',
    title: 'The Sacred Rhythm',
    virtue: 'Faith',
    question: 'Complete the sacred drum pattern: Strong-Strong-Weak-Strong-Strong-?',
    answer: 'weak',
    alternativeAnswers: ['soft', 'light'],
    hint: 'Listen to the rhythm of your heartbeat when you pray.',
    culturalContext: 'Ethiopian Orthodox music often follows specific rhythmic patterns that mirror the rhythm of prayer and devotion.'
  },
  
  compassion: {
    id: 'compassion', 
    title: 'The Heart of Ubuntu',
    virtue: 'Compassion',
    question: 'A hungry traveler arrives at your door. What do you offer first?',
    answer: 'listening ear',
    alternativeAnswers: ['listen', 'ear', 'attention'],
    hint: 'Before the body can be fed, the spirit must be acknowledged.',
    culturalContext: 'In Ethiopian culture, true hospitality begins with recognizing the humanity and dignity of every visitor.'
  },
  
  strength: {
    id: 'strength',
    title: 'The Mountain\'s Test', 
    virtue: 'Strength',
    question: 'Click repeatedly to push the boulder. True strength comes from...',
    answer: 'persistence',
    alternativeAnswers: ['endurance', 'determination', 'perseverance'],
    hint: 'The mountain does not move for power alone, but for the steady effort that never gives up.',
    culturalContext: 'Ethiopian highlands have taught generations that true strength is not in the moment of force, but in the commitment to continue.'
  },
  
  wisdom: {
    id: 'wisdom',
    title: 'The Ancient Riddle',
    virtue: 'Wisdom', 
    question: 'I am not seen, yet I guide the way. I am not heard, yet I speak each day. In books I live, in minds I grow. What am I?',
    answer: 'knowledge',
    alternativeAnswers: ['wisdom', 'learning', 'understanding'],
    hint: 'It grows when shared and multiplies when taught.',
    culturalContext: 'Ethiopian scholarly tradition values knowledge not as possession, but as a living force that guides and connects all people.'
  },
  
  truth: {
    id: 'truth',
    title: 'The Desert\'s Clarity',
    virtue: 'Truth',
    question: 'Which statement represents the deepest truth?',
    answer: 'The journey matters more than the destination',
    alternativeAnswers: ['journey matters more', 'journey is important'],
    hint: 'The desert strips away all illusions, revealing what truly endures.',
    culturalContext: 'In Ethiopian wisdom, truth is not a destination to reach, but a way of traveling through life with integrity.'
  }
};

export const puzzleHelpers = {
  validateAnswer: (puzzleId: string, userAnswer: string): boolean => {
    const puzzle = puzzleData[puzzleId];
    if (!puzzle) return false;
    
    const normalized = userAnswer.toLowerCase().trim();
    const correctAnswer = puzzle.answer.toLowerCase().trim();
    
    if (normalized === correctAnswer) return true;
    
    return puzzle.alternativeAnswers?.some(alt => 
      alt.toLowerCase().trim() === normalized
    ) || false;
  },
  
  getHint: (puzzleId: string): string => {
    return puzzleData[puzzleId]?.hint || "Think about the virtue this region represents.";
  },
  
  getCulturalContext: (puzzleId: string): string => {
    return puzzleData[puzzleId]?.culturalContext || "This puzzle reflects traditional Ethiopian values.";
  }
};
