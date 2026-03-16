export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;

  return base ? `${base}${normalizedPath}` : normalizedPath;
}
