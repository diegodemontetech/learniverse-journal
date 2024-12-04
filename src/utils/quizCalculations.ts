export const calculateQuizScore = (totalQuestions: number, correctAnswers: number) => {
  const pointsPerQuestion = 10 / totalQuestions;
  return correctAnswers * pointsPerQuestion;
};