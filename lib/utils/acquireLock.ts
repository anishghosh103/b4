const keys = new Map<string, Promise<any>>();

export async function acquireLock(key: string): Promise<() => void> {
  if (keys.has(key)) {
    await keys.get(key);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const releaseLock = await acquireLock(key);
        resolve(releaseLock);
      }, 0);
    });
  }
  let releaseLock = () => {};
  const promise = new Promise((resolve) => {
    releaseLock = () => {
      keys.delete(key);
      resolve(null);
    };
  });
  keys.set(key, promise);
  return releaseLock;
}

export async function asyncLock<T, Params = any>(
  key: string,
  asyncCallback: (...params: Params[]) => Promise<T>,
  ...params: Params[]
) {
  const releaseLock = await acquireLock(key);
  try {
    const result = await asyncCallback(...params);
    return result;
  } catch (err) {
    throw err;
  } finally {
    releaseLock();
  }
}
