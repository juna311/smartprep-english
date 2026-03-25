import type { VocabularyPracticeQuestion } from "./types";

const foodBeginner: VocabularyPracticeQuestion[] = [
    {
      id: "food-b-1",
      type: "mcq",
      prompt: "What is 'apple' in Japanese?",
      choices: ["パン", "りんご", "水", "牛乳"],
      correct: 1,
      explanation: "Apple translates to りんご."
    },
    {
      id: "food-b-2",
      type: "fill",
      prompt: "I drink ____ every morning.",
      answer: "milk",
      explanation: "Milk is 牛乳 in Japanese."
    },
    {
      id: "food-b-3",
      type: "mcq",
      prompt: "What does 'パン' mean?",
      choices: ["bread", "rice", "apple", "water"],
      correct: 0,
      explanation: "パン means bread."
    }
  ];

export default foodBeginner;