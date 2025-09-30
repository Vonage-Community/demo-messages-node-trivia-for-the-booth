
export const gameFromRow = (row) => row
  ? {
    id: row.id,
    title: row.title,
    active: !!row.active,
  }
  : null;
