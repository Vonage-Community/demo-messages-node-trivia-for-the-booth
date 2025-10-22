export const fromQuestionRow = (question, detailed) => question
  ? {
    id: question.id || question.question_id,
    gameId: Number(question.game_id),
    question: question.question,
    choiceA: question.choice_a,
    choiceB: question.choice_b,
    choiceC: question.choice_c,
    choiceD: question.choice_d,
    sortOrder: question.sort_order,
    ...(detailed
      ? {
        correctChoice: question.correct_choice,
        correctAnswerCount: question.correct_answer_count,
        incorrectAnswerCount: question.incorrect_answer_count,
        countChoiceA: question.count_choice_a,
        countChoiceB: question.count_choice_b,
        countChoiceC: question.count_choice_c,
        countChoiceD: question.count_choice_d,
      }
      : {}
    ),
  }
  : null;

