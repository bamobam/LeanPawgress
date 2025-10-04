export const makeId = () =>
    (globalThis.crypto?.randomUUID?.() ??
     ('id_' + Math.random().toString(36).slice(2)));
  