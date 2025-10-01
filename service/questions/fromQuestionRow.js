export const fromQuestionRow = (question) => question
  ? {
    id: question.id,
    gameId: Number(question.game_id),
    question: question.question,
    choiceA: question.choice_a,
    choiceB: question.choice_b,
    choiceC: question.choice_c,
    choiceD: question.choice_d,
    correctChoice: question.correct_choice,
  }
  : null;

