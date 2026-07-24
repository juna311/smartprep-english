export type CleftQuestion =
  | {
      id: string;
      type: "mcq";
      title: string;
      prompt: string;
      choices: string[];
      correct: number;
      explanation: string;
    }
  | {
      id: string;
      type: "fill";
      title: string;
      prompt: string;
      answer: string;
      explanation: string;
    }
  | {
      id: string;
      type: "reorder";
      title: string;
      prompt: string;
      tokens: string[];
      answer: string;
      explanation: string;
    };

export const cleftAQuestions: CleftQuestion[] = [
  {
    id: "cleft-a-mcq-1",
    type: "mcq",
    title: "Cleft Sentences",
    prompt: "Which sentence correctly uses a cleft sentence?",
    choices: [
      "John broke the window yesterday.",
      "It was John who broke the window.",
      "It is John broke the window.",
      "Was John that broke the window.",
    ],
    correct: 1,
    explanation:
      "Cleft sentences often use 'It was ... who/that ...' to emphasize a part of the sentence.",
  },
  {
    id: "cleft-a-mcq-2",
    type: "mcq",
    title: "Cleft Sentences",
    prompt: "Choose the best option to emphasize the time:",
    choices: [
      "It was yesterday that he left.",
      "It was yesterday who he left.",
      "What yesterday he left is true.",
      "It is yesterday he left.",
    ],
    correct: 0,
    explanation:
      "To emphasize time, use: 'It was + time + that + clause' (e.g., It was yesterday that he left).",
  },
  {
    id: "cleft-a-fill-1",
    type: "fill",
    title: "Cleft Sentences",
    prompt: "Complete the cleft sentence: It was Maria ___ called you.",
    answer: "who",
    explanation:
      "Use 'who' when the emphasized part is a person: 'It was Maria who called you.'",
  },
  {
    id: "cleft-a-fill-2",
    type: "fill",
    title: "Cleft Sentences",
    prompt: "Complete the cleft sentence: It was the keys ___ I lost.",
    answer: "that",
    explanation:
      "Use 'that' when the emphasized part is a thing: 'It was the keys that I lost.'",
  },
  {
    id: "cleft-a-reorder-1",
    type: "reorder",
    title: "Cleft Sentences",
    prompt: "Reorder the words to make a correct cleft sentence.",
    tokens: ["It", "was", "in", "Spain", "that", "we", "met"],
    answer: "It was in Spain that we met.",
    explanation:
      "Cleft structure: 'It was + place + that + clause' to emphasize location.",
  },
];
