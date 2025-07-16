
export interface PhonicsData {
  letter: string;
  sound: string;
  position: string;
  exampleWord: string;
}

// Synthetic phonics letter sounds - no schwa endings
export const letterSounds: Record<string, string> = {
  A: "/æ/",      // short a as in apple
  B: "/b/",      // not 'buh'
  C: "/k/",      // hard c, as in cat
  D: "/d/",
  E: "/ɛ/",      // short e as in elephant
  F: "/f/",
  G: "/g/",      // hard g as in goat
  H: "/h/",
  I: "/ɪ/",      // short i as in insect
  J: "/dʒ/",
  K: "/k/",
  L: "/l/",
  M: "/m/",
  N: "/n/",
  O: "/ɒ/",      // short o as in octopus (UK), use /ɑ/ for US
  P: "/p/",
  Q: "/kw/",
  R: "/r/",      // light r
  S: "/s/",      // unvoiced s
  T: "/t/",
  U: "/ʌ/",      // short u as in umbrella
  V: "/v/",
  W: "/w/",
  X: "/ks/",     // as in box
  Y: "/j/",
  Z: "/z/"
};

const phonicsMap: Record<string, { sound: string; exampleWord: string }> = {
  A: { sound: "/æ/", exampleWord: "apple" },
  B: { sound: "/b/", exampleWord: "bat" },
  C: { sound: "/k/", exampleWord: "cat" },
  D: { sound: "/d/", exampleWord: "dog" },
  E: { sound: "/ɛ/", exampleWord: "egg" },
  F: { sound: "/f/", exampleWord: "fish" },
  G: { sound: "/g/", exampleWord: "goat" },
  H: { sound: "/h/", exampleWord: "hat" },
  I: { sound: "/ɪ/", exampleWord: "insect" },
  J: { sound: "/dʒ/", exampleWord: "jelly" },
  K: { sound: "/k/", exampleWord: "kite" },
  L: { sound: "/l/", exampleWord: "lamp" },
  M: { sound: "/m/", exampleWord: "moon" },
  N: { sound: "/n/", exampleWord: "net" },
  O: { sound: "/ɒ/", exampleWord: "octopus" },
  P: { sound: "/p/", exampleWord: "pig" },
  Q: { sound: "/kw/", exampleWord: "queen" },
  R: { sound: "/r/", exampleWord: "robot" },
  S: { sound: "/s/", exampleWord: "sun" },
  T: { sound: "/t/", exampleWord: "tap" },
  U: { sound: "/ʌ/", exampleWord: "umbrella" },
  V: { sound: "/v/", exampleWord: "van" },
  W: { sound: "/w/", exampleWord: "web" },
  X: { sound: "/ks/", exampleWord: "box" },
  Y: { sound: "/j/", exampleWord: "yes" },
  Z: { sound: "/z/", exampleWord: "zebra" },
};

const getPositionName = (index: number, total: number): string => {
  if (total === 1) return "only";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  
  const positions = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
  return positions[index + 1] || `${index + 1}th`;
};

// Helper function for quick sound lookup
export const getLetterSound = (letter: string): string => {
  return letterSounds[letter.toUpperCase()] || `/${letter.toLowerCase()}/`;
};

export function generatePhonicsData(name: string): PhonicsData[] {
  const letters = name.toUpperCase().split('');
  
  return letters.map((letter, index) => {
    const phonics = phonicsMap[letter] || { sound: getLetterSound(letter), exampleWord: "word" };
    
    return {
      letter,
      sound: phonics.sound,
      position: getPositionName(index, letters.length),
      exampleWord: phonics.exampleWord,
    };
  });
}
