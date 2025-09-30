
export const deactivateGame = () => {
  const game = getActiveGame();

  if (!game.active) {
    return game;
  }

  game.active = 0;
  updateGameById.run(game);
  return fromRow(game);
};
