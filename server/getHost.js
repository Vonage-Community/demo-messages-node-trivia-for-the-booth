const PORT = process.env.PORT || 3000;

export const getHostUrl = (port = PORT) => {
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-${port}.app.github.dev`;
  }

  return `http://localhost:${port}`;
};
