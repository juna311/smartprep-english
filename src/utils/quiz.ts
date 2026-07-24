export function normalizeAnswer(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,?!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function shuffleArray<T>(items: readonly T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function createQuestionSet<T>(
  questions: readonly T[],
  questionCount: number,
) {
  return shuffleArray(questions).slice(0, questionCount);
}
