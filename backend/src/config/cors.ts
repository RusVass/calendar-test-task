const DEFAULT_CLIENT_ORIGINS = ['http://localhost:5173', 'https://rusvass.github.io'];

const parseClientOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return [...DEFAULT_CLIENT_ORIGINS];
  }

  const parsedOrigins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (parsedOrigins.length === 0) {
    return [...DEFAULT_CLIENT_ORIGINS];
  }

  return parsedOrigins;
};

export const getAllowedOrigins = (clientUrlValue: string | undefined): string[] => {
  const parsedOrigins = parseClientOrigins(clientUrlValue);
  const allowedOrigins = [...DEFAULT_CLIENT_ORIGINS, ...parsedOrigins];

  return Array.from(new Set(allowedOrigins));
};

export const createCorsOriginValidator = (
  allowedOrigins: string[],
): ((origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => void) => {
  const uniqueOrigins = Array.from(new Set(allowedOrigins));

  return (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (uniqueOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  };
};
