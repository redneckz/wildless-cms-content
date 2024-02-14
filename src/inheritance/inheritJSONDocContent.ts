import { isString, type JSONRecord } from '@redneckz/json-op';
import { type FileAPI } from '../api/FileAPI';
import { mergeJSON } from './mergeJSON';

const DEFAULT_PARENT_CONTENT = {};

export const inheritJSONDocContent =
  (api: FileAPI) =>
  async <C extends JSONRecord>(content: C): Promise<C> =>
    content?._extends && isString(content._extends)
      ? mergeJSON((await api.readJSON<C>(content._extends)) ?? DEFAULT_PARENT_CONTENT, content)
      : content;
