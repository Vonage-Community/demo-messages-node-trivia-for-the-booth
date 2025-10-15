export const fromQuestionRow = (question, detailed) => question
  ? {
    id: question.id,
    gameId: Number(question.game_id),
    question: question.question,
    choiceA: question.choice_a,
    choiceB: question.choice_b,
    choiceC: question.choice_c,
    choiceD: question.choice_d,
    ...(detailed
      ? { correctChoice: question.correct_choice }
      : {}
    ),
  }
  : null;

