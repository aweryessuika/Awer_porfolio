/**
 * One-shot signal fired when the preloader has finished and the page is
 * revealed. Hero / nav entrances wait on it so they play in view, not under
 * the loading curtain.
 */
type Callback = () => void;

let done = false;
const subscribers = new Set<Callback>();

export function markIntroDone() {
  if (done) return;
  done = true;
  subscribers.forEach((cb) => cb());
  subscribers.clear();
}

export function isIntroDone() {
  return done;
}

export function onIntroDone(cb: Callback): () => void {
  if (done) {
    cb();
    return () => undefined;
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
