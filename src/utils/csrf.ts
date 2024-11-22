import { logger } from './logger';

interface CsrfOptions {
  cookieName?: string;
  headerName?: string;
  cookieOptions?: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

const defaultOptions: CsrfOptions = {
  cookieName: 'XSRF-TOKEN',
  headerName: 'X-XSRF-TOKEN',
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
};

export const csrfMiddleware = (options: CsrfOptions = defaultOptions) => {
  return async (req: Request, next: () => void) => {
    if (
      req.method === 'GET' ||
      req.method === 'HEAD' ||
      req.method === 'OPTIONS'
    ) {
      return next();
    }

    const token = req.headers.get(options.headerName?.toLowerCase() ?? '');
    const cookieHeader = req.headers.get('cookie');
    const cookies = Object.fromEntries(
      cookieHeader?.split(';').map((c) => c.trim().split('=')) ?? [],
    );
    const cookie = cookies[options.cookieName ?? ''];

    if (!token || !cookie || token !== cookie) {
      logger.logSecurityEvent('CSRF token validation failed', 'high', {
        method: req.method,
        url: new URL(req.url).pathname,
        headers: Object.fromEntries(req.headers.entries()),
      });

      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
      });
    }

    next();
  };
};

// Add to API utility
export const addCsrfToken = (headers: Headers): Headers => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    headers.append('X-XSRF-TOKEN', token);
  }

  return headers;
};
