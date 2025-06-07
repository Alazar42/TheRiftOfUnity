export interface RegionData {
  name: string;
  description: string;
  color: string;
  leader: string;
  symbol: string;
  virtue: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const regionData: { [key: string]: RegionData } = {
  faith: {
    name: "Faith",
    description: "A spiritual realm where sacred rhythms echo through golden temples and the light of devotion illuminates the path forward.",
    color: "#FFD700", // Gold
    leader: "Abba Samuel",
    symbol: "✨",
    virtue: "Faith",
    theme: {
      primary: "#FFD700",
      secondary: "#FFA500",
      accent: "#FFFF00"
    }
  },
  
  compassion: {
    name: "Compassion",
    description: "A warm community where hearts connect across all boundaries, and the spirit of ubuntu - 'I am because we are' - thrives.",
    color: "#FF6B6B", // Warm Red
    leader: "Emebet Meron",
    symbol: "❤️",
    virtue: "Compassion",
    theme: {
      primary: "#FF6B6B",
      secondary: "#FF8E8E",
      accent: "#FFB1B1"
    }
  },
  
  strength: {
    name: "Strength", 
    description: "Rugged mountains where endurance is tested and inner fortitude is forged through trials that mirror the harsh beauty of the highlands.",
    color: "#8B4513", // Saddle Brown
    leader: "Ras Dawit",
    symbol: "⛰️",
    virtue: "Strength",
    theme: {
      primary: "#8B4513",
      secondary: "#A0522D",
      accent: "#CD853F"
    }
  },
  
  wisdom: {
    name: "Wisdom",
    description: "Ancient libraries and schools where knowledge flows like the Blue Nile, carrying the accumulated understanding of generations.",
    color: "#4682B4", // Steel Blue
    leader: "Liqe Tewodros",
    symbol: "📚",
    virtue: "Wisdom",
    theme: {
      primary: "#4682B4",
      secondary: "#5F9EA0",
      accent: "#87CEEB"
    }
  },
  
  truth: {
    name: "Truth",
    description: "A vast desert where mirages cannot hide reality, and the harsh sun reveals all things as they truly are.",
    color: "#DEB887", // Burlywood
    leader: "Abuna Marcos",
    symbol: "🔍", 
    virtue: "Truth",
    theme: {
      primary: "#DEB887",
      secondary: "#D2B48C",
      accent: "#F5DEB3"
    }
  },
  
  unity: {
    name: "Tree of Unity",
    description: "The sacred center where all virtues converge, and the healing of the world can begin anew.",
    color: "#32CD32", // Lime Green
    leader: "The Ancient Tree",
    symbol: "🌳",
    virtue: "Unity",
    theme: {
      primary: "#32CD32",
      secondary: "#228B22",
      accent: "#90EE90"
    }
  }
};

export const storyElements = {
  protagonist: {
    name: "Tsega",
    meaning: "Grace" // in Amharic
  },
  
  culturalElements: {
    greetings: [
      "Selam", // Peace
      "Tena yistilign", // May God give you health
      "Dehna neh?", // Are you well?
    ],
    
    proverbs: [
      "When spider webs unite, they can tie up a lion.",
      "He who learns, teaches.",
      "A single bracelet does not jingle.",
      "The earth is not thirsty for the blood of the brave."
    ],
    
    values: [
      "Respect for elders",
      "Community solidarity", 
      "Spiritual devotion",
      "Perseverance through hardship",
      "Hospitality to strangers"
    ]
  },
  
  gameProgression: {
    order: ['faith', 'compassion', 'strength', 'wisdom', 'truth'],
    finalRitual: 'unity'
  }
};
