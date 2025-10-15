
export const gameFromRow = (row) => row
  ? {
    id: row.id,
    title: row.title,
    shortCode: row.short_code,
    active: !!row.active,
    questionCount: row.question_count,
    playerCount: row.player_count,
    totalCorrectAnswers: row.total_correct_answers,
    totalIncorrectAnswers: row.total_incorrect_answers,
  }
  : null;
