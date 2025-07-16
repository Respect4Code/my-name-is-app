
import { letterSounds } from "@/lib/phonics";

interface PhonicsReferenceProps {
  className?: string;
}

const phonicsExamples: Record<string, string> = {
  A: "apple",
  B: "bat",
  C: "cat",
  D: "dog",
  E: "egg",
  F: "fish",
  G: "goat",
  H: "hat",
  I: "insect",
  J: "jelly",
  K: "kite",
  L: "lamp",
  M: "moon",
  N: "net",
  O: "octopus",
  P: "pig",
  Q: "queen",
  R: "robot",
  S: "sun",
  T: "tap",
  U: "umbrella",
  V: "van",
  W: "web",
  X: "box",
  Y: "yes",
  Z: "zebra",
};

export default function PhonicsReference({ className = "" }: PhonicsReferenceProps) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Synthetic Phonics Reference Chart
        </h2>
        <p className="text-gray-600 text-sm">
          Pure letter sounds (no "uh" endings) for proper blending
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-purple-700">
                Letter
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-purple-700">
                Sound (IPA)
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-purple-700">
                Example Word
              </th>
            </tr>
          </thead>
          <tbody>
            {alphabet.map((letter) => (
              <tr key={letter} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-bold text-lg text-purple-600">
                  {letter}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-mono text-lg">
                  {letterSounds[letter]}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {phonicsExamples[letter]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => window.print()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Print Reference Chart
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>✨ This chart uses International Phonetic Alphabet (IPA) notation</p>
        <p>Perfect for synthetic phonics and early reading instruction</p>
      </div>
    </div>
  );
}
