
export interface PhonicsData {
  letter: string;
  sound: string;
  ipa: string;
  position: string;
  examples: string[];
  description: string;
}

// Comprehensive phonics mapping with contextual awareness
const phonicsMap: Record<string, PhonicsData> = {
  // Vowels
  'A': {
    letter: 'A',
    sound: 'æ',
    ipa: '/æ/',
    position: 'any',
    examples: ['cat', 'bat', 'hat'],
    description: 'Short A sound like in "cat"'
  },
  'E': {
    letter: 'E',
    sound: 'ɛ',
    ipa: '/ɛ/',
    position: 'any',
    examples: ['bet', 'pet', 'red'],
    description: 'Short E sound like in "bet"'
  },
  'I': {
    letter: 'I',
    sound: 'ɪ',
    ipa: '/ɪ/',
    position: 'any',
    examples: ['bit', 'sit', 'hit'],
    description: 'Short I sound like in "bit"'
  },
  'O': {
    letter: 'O',
    sound: 'ɒ',
    ipa: '/ɒ/',
    position: 'any',
    examples: ['hot', 'pot', 'dog'],
    description: 'Short O sound like in "hot"'
  },
  'U': {
    letter: 'U',
    sound: 'ʌ',
    ipa: '/ʌ/',
    position: 'any',
    examples: ['cup', 'but', 'run'],
    description: 'Short U sound like in "cup"'
  },

  // Consonants
  'B': {
    letter: 'B',
    sound: 'b',
    ipa: '/b/',
    position: 'any',
    examples: ['ball', 'baby', 'cab'],
    description: 'B sound like in "ball"'
  },
  'C': {
    letter: 'C',
    sound: 'k',
    ipa: '/k/',
    position: 'any',
    examples: ['cat', 'car', 'music'],
    description: 'Hard C sound like in "cat"'
  },
  'D': {
    letter: 'D',
    sound: 'd',
    ipa: '/d/',
    position: 'any',
    examples: ['dog', 'dad', 'bed'],
    description: 'D sound like in "dog"'
  },
  'F': {
    letter: 'F',
    sound: 'f',
    ipa: '/f/',
    position: 'any',
    examples: ['fish', 'fun', 'leaf'],
    description: 'F sound like in "fish"'
  },
  'G': {
    letter: 'G',
    sound: 'g',
    ipa: '/g/',
    position: 'any',
    examples: ['go', 'big', 'dog'],
    description: 'Hard G sound like in "go"'
  },
  'H': {
    letter: 'H',
    sound: 'h',
    ipa: '/h/',
    position: 'any',
    examples: ['hat', 'house', 'hello'],
    description: 'H sound like in "hat"'
  },
  'J': {
    letter: 'J',
    sound: 'dʒ',
    ipa: '/dʒ/',
    position: 'any',
    examples: ['jump', 'joy', 'bridge'],
    description: 'J sound like in "jump"'
  },
  'K': {
    letter: 'K',
    sound: 'k',
    ipa: '/k/',
    position: 'any',
    examples: ['kite', 'key', 'book'],
    description: 'K sound like in "kite"'
  },
  'L': {
    letter: 'L',
    sound: 'l',
    ipa: '/l/',
    position: 'any',
    examples: ['lion', 'love', 'ball'],
    description: 'L sound like in "lion"'
  },
  'M': {
    letter: 'M',
    sound: 'm',
    ipa: '/m/',
    position: 'any',
    examples: ['moon', 'mom', 'swim'],
    description: 'M sound like in "moon"'
  },
  'N': {
    letter: 'N',
    sound: 'n',
    ipa: '/n/',
    position: 'any',
    examples: ['nose', 'name', 'sun'],
    description: 'N sound like in "nose"'
  },
  'P': {
    letter: 'P',
    sound: 'p',
    ipa: '/p/',
    position: 'any',
    examples: ['pig', 'pop', 'cup'],
    description: 'P sound like in "pig"'
  },
  'Q': {
    letter: 'Q',
    sound: 'kw',
    ipa: '/kw/',
    position: 'any',
    examples: ['queen', 'quick', 'quilt'],
    description: 'Q sound like "kw" in "queen"'
  },
  'R': {
    letter: 'R',
    sound: 'r',
    ipa: '/r/',
    position: 'any',
    examples: ['run', 'red', 'car'],
    description: 'R sound like in "run"'
  },
  'S': {
    letter: 'S',
    sound: 's',
    ipa: '/s/',
    position: 'any',
    examples: ['sun', 'see', 'yes'],
    description: 'S sound like in "sun"'
  },
  'T': {
    letter: 'T',
    sound: 't',
    ipa: '/t/',
    position: 'any',
    examples: ['top', 'tree', 'cat'],
    description: 'T sound like in "top"'
  },
  'V': {
    letter: 'V',
    sound: 'v',
    ipa: '/v/',
    position: 'any',
    examples: ['van', 'love', 'give'],
    description: 'V sound like in "van"'
  },
  'W': {
    letter: 'W',
    sound: 'w',
    ipa: '/w/',
    position: 'any',
    examples: ['water', 'win', 'cow'],
    description: 'W sound like in "water"'
  },
  'X': {
    letter: 'X',
    sound: 'ks',
    ipa: '/ks/',
    position: 'any',
    examples: ['box', 'six', 'fox'],
    description: 'X sound like "ks" in "box"'
  },
  'Y': {
    letter: 'Y',
    sound: 'j',
    ipa: '/j/',
    position: 'any',
    examples: ['yes', 'yellow', 'my'],
    description: 'Y sound like in "yes"'
  },
  'Z': {
    letter: 'Z',
    sound: 'z',
    ipa: '/z/',
    position: 'any',
    examples: ['zoo', 'zero', 'buzz'],
    description: 'Z sound like in "zoo"'
  }
};

// Context-sensitive phonics adjustments
const contextualAdjustments: Record<string, Partial<PhonicsData>> = {
  'A_END': {
    sound: 'ə',
    ipa: '/ə/',
    description: 'Schwa sound like in "comma"'
  },
  'E_END': {
    sound: 'silent',
    ipa: '//',
    description: 'Silent E at the end of words'
  },
  'Y_END': {
    sound: 'i',
    ipa: '/i/',
    description: 'Long I sound when Y is at the end'
  },
  'C_BEFORE_E': {
    sound: 's',
    ipa: '/s/',
    description: 'Soft C sound like in "cent"'
  },
  'C_BEFORE_I': {
    sound: 's',
    ipa: '/s/',
    description: 'Soft C sound like in "city"'
  },
  'G_BEFORE_E': {
    sound: 'dʒ',
    ipa: '/dʒ/',
    description: 'Soft G sound like in "gem"'
  },
  'G_BEFORE_I': {
    sound: 'dʒ',
    ipa: '/dʒ/',
    description: 'Soft G sound like in "giraffe"'
  }
};

export function generatePhonicsData(name: string): PhonicsData[] {
  const letters = name.toUpperCase().split('');
  
  return letters.map((letter, index) => {
    const isFirst = index === 0;
    const isLast = index === letters.length - 1;
    const nextLetter = index < letters.length - 1 ? letters[index + 1] : null;
    
    // Get base phonics data
    let phonicsData = { ...phonicsMap[letter] };
    
    if (!phonicsData) {
      // Fallback for unknown letters
      phonicsData = {
        letter,
        sound: letter.toLowerCase(),
        ipa: `/${letter.toLowerCase()}/`,
        position: isFirst ? 'first' : isLast ? 'last' : 'middle',
        examples: [letter.toLowerCase()],
        description: `${letter} sound`
      };
    }
    
    // Apply contextual adjustments
    const contextKey = `${letter}_${isLast ? 'END' : ''}`;
    if (contextualAdjustments[contextKey]) {
      phonicsData = { ...phonicsData, ...contextualAdjustments[contextKey] };
    }
    
    // Check for soft C/G before E/I
    if ((letter === 'C' || letter === 'G') && nextLetter && ['E', 'I'].includes(nextLetter)) {
      const softKey = `${letter}_BEFORE_${nextLetter}`;
      if (contextualAdjustments[softKey]) {
        phonicsData = { ...phonicsData, ...contextualAdjustments[softKey] };
      }
    }
    
    // Set position
    phonicsData.position = isFirst ? 'first' : isLast ? 'last' : 'middle';
    
    return phonicsData;
  });
}

export function getLetterPosition(index: number, totalLength: number): string {
  if (index === 0) return 'first';
  if (index === totalLength - 1) return 'last';
  return 'middle';
}

export function isVowel(letter: string): boolean {
  return ['A', 'E', 'I', 'O', 'U'].includes(letter.toUpperCase());
}

export function isConsonant(letter: string): boolean {
  return /^[A-Z]$/i.test(letter) && !isVowel(letter);
}

// Export for reference materials
export { phonicsMap, contextualAdjustments };
