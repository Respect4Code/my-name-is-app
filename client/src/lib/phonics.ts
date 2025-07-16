export interface PhonicsData {
  letter: string;
  sound: string;
  position: string;
  exampleWord: string;
}

const phonicsMap: Record<string, { sound: string; exampleWord: string }> = {
  A: { sound: "ah", exampleWord: "apple" },
  B: { sound: "buh", exampleWord: "ball" },
  C: { sound: "kuh", exampleWord: "cat" },
  D: { sound: "duh", exampleWord: "dog" },
  E: { sound: "eh", exampleWord: "egg" },
  F: { sound: "fuh", exampleWord: "fish" },
  G: { sound: "guh", exampleWord: "go" },
  H: { sound: "huh", exampleWord: "hat" },
  I: { sound: "ih", exampleWord: "igloo" },
  J: { sound: "juh", exampleWord: "jump" },
  K: { sound: "kuh", exampleWord: "kite" },
  L: { sound: "luh", exampleWord: "lion" },
  M: { sound: "muh", exampleWord: "moon" },
  N: { sound: "nuh", exampleWord: "nest" },
  O: { sound: "oh", exampleWord: "octopus" },
  P: { sound: "puh", exampleWord: "pig" },
  Q: { sound: "kwuh", exampleWord: "queen" },
  R: { sound: "ruh", exampleWord: "rabbit" },
  S: { sound: "sss", exampleWord: "sun" },
  T: { sound: "tuh", exampleWord: "tiger" },
  U: { sound: "uh", exampleWord: "umbrella" },
  V: { sound: "vuh", exampleWord: "van" },
  W: { sound: "wuh", exampleWord: "water" },
  X: { sound: "ksss", exampleWord: "box" },
  Y: { sound: "yuh", exampleWord: "yes" },
  Z: { sound: "zzz", exampleWord: "zebra" },
};

const getPositionName = (index: number, total: number): string => {
  if (total === 1) return "only";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  
  const positions = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
  return positions[index + 1] || `${index + 1}th`;
};

export function generatePhonicsData(name: string): PhonicsData[] {
  const letters = name.toUpperCase().split('');
  
  return letters.map((letter, index) => {
    const phonics = phonicsMap[letter] || { sound: `/${letter.toLowerCase()}/`, exampleWord: "word" };
    
    return {
      letter,
      sound: phonics.sound,
      position: getPositionName(index, letters.length),
      exampleWord: phonics.exampleWord,
    };
  });
}
