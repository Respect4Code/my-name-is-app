export interface PhonicsData {
  letter: string;
  sound: string;
  position: string;
  exampleWord: string;
}

const phonicsMap: Record<string, { sound: string; exampleWord: string }> = {
  A: { sound: "/æ/", exampleWord: "apple" },
  B: { sound: "/b/", exampleWord: "ball" },
  C: { sound: "/k/", exampleWord: "cat" },
  D: { sound: "/d/", exampleWord: "dog" },
  E: { sound: "/ɛ/", exampleWord: "egg" },
  F: { sound: "/f/", exampleWord: "fish" },
  G: { sound: "/g/", exampleWord: "go" },
  H: { sound: "/h/", exampleWord: "hat" },
  I: { sound: "/ɪ/", exampleWord: "igloo" },
  J: { sound: "/dʒ/", exampleWord: "jump" },
  K: { sound: "/k/", exampleWord: "kite" },
  L: { sound: "/l/", exampleWord: "lion" },
  M: { sound: "/m/", exampleWord: "moon" },
  N: { sound: "/n/", exampleWord: "nest" },
  O: { sound: "/ɒ/", exampleWord: "octopus" },
  P: { sound: "/p/", exampleWord: "pig" },
  Q: { sound: "/kw/", exampleWord: "queen" },
  R: { sound: "/r/", exampleWord: "rabbit" },
  S: { sound: "/s/", exampleWord: "sun" },
  T: { sound: "/t/", exampleWord: "tiger" },
  U: { sound: "/ʌ/", exampleWord: "umbrella" },
  V: { sound: "/v/", exampleWord: "van" },
  W: { sound: "/w/", exampleWord: "water" },
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