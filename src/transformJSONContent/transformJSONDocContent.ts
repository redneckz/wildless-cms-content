import { type JSONRecord } from '@redneckz/json-op';
import type { TransformationOptions } from './TransformationOptions';
import { inheritJSONDocContent } from '../inheritance/inheritJSONDocContent';
import { transformJSONContent } from './transformJSONContent';
import { type FileAPI } from '../api/FileAPI';

export const transformJSONDocContent =
  (api: FileAPI) =>
  async <C extends JSONRecord>(docPath: string, options: TransformationOptions): Promise<C> =>
    transformJSONContent(await inheritJSONDocContent(api)(await api.readJSON(docPath)), options);
