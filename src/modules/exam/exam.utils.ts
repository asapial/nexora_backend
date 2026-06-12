export type ScoringQuestion = {
  id: string;
  type?: "MCQ" | "CQ";
  marks: number;
  options: { id: string; isCorrect: boolean; }[];
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
};

export const seededShuffle = <T>(items: T[], seed: string): T[] => {
  const copy = [...items];
  let state = hash(seed) || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    const current = copy[index]!;
    copy[index] = copy[target]!;
    copy[target] = current;
  }
  return copy;
};

export const scoreAnswers = (
  questions: ScoringQuestion[],
  answers: { questionId: string; optionId?: string | null; }[],
) => {
  const selected = new Map(answers.map((answer) => [answer.questionId, answer.optionId]));
  const rows = questions.map((question) => {
    const optionId = selected.get(question.id) ?? null;
    const isCorrect = question.type !== "CQ" && question.options.some((option) => option.id === optionId && option.isCorrect);
    return { questionId: question.id, optionId, isCorrect, awardedMarks: isCorrect ? question.marks : 0 };
  });
  const score = rows.reduce((sum, row) => sum + row.awardedMarks, 0);
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  return { rows, score, totalMarks, percentage: totalMarks ? Math.round((score / totalMarks) * 10000) / 100 : 0 };
};
