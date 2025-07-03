export function mergeHeaders(...sources: (HeadersInit | undefined)[]) {
  const result = new Headers();

  sources.forEach((source) => {
    const headers = new Headers(source);
    headers.forEach((value, key) => result.set(key, value));
  });

  return result;
}
