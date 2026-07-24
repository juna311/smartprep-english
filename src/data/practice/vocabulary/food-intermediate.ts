import type { VocabularyPracticeQuestion } from "./types";

const foodIntermediate: VocabularyPracticeQuestion[] = [
  {
    id: "food-usage-recipe-1",
    type: "usage",
    prompt: "Which sentence sounds natural?",
    choices: [
      "I did a recipe yesterday.",
      "I followed a recipe yesterday.",
      "I learned a recipe yesterday.",
      "I practiced a recipe yesterday.",
    ],
    correct: 1,
    explanation: "'Follow a recipe' is the natural collocation.",
  },
  {
    id: "food-usage-recipe-2",
    type: "usage",
    prompt: "Which verb is best?",
    choices: [
      "make a recipe",
      "follow a recipe",
      "do a recipe",
      "take a recipe",
    ],
    correct: 1,
    explanation: "In English, we say 'follow a recipe', not 'do' or 'take'.",
  },
  {
    id: "food-usage-ingredient-1",
    type: "usage",
    prompt: "Which sentence is correct?",
    choices: [
      "This dish has many ingredients.",
      "This dish has many recipes.",
      "This dish has many cuisines.",
      "This dish has many spices.",
    ],
    correct: 0,
    explanation: "'Ingredients' are the parts used to make a dish.",
  },
  {
    id: "food-usage-ingredient-2",
    type: "usage",
    prompt: "Which word fits best?",
    choices: [
      "Flour is an important recipe.",
      "Flour is an important ingredient.",
      "Flour is an important cuisine.",
      "Flour is an important spice.",
    ],
    correct: 1,
    explanation: "'Ingredient' refers to something used in cooking.",
  },
  {
    id: "food-usage-spice-1",
    type: "usage",
    prompt: "Which sentence sounds natural?",
    choices: [
      "This soup needs more spice.",
      "This soup needs more ingredient.",
      "This soup needs more recipe.",
      "This soup needs more cuisine.",
    ],
    correct: 0,
    explanation: "'Spice' refers to flavor or seasoning.",
  },
  {
    id: "food-usage-spice-2",
    type: "usage",
    prompt: "What does 'spicy food' mean?",
    choices: [
      "Food with many ingredients",
      "Food with strong or hot flavor",
      "Food from another country",
      "Food that is sweet",
    ],
    correct: 1,
    explanation: "'Spicy' refers to strong or hot flavor.",
  },
];

export default foodIntermediate;
