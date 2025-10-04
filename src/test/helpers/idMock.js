// test/helpers/idMock.js
import * as ids from '../../model/ids.js';
import { vi } from 'vitest';

export function mockIds(seq = ['id1','id2','id3','id4','id5']) {
  let i = 0;
  vi.spyOn(ids, 'makeId').mockImplementation(() => seq[i++] ?? `id${i}`);
}
