import { type JSONRecord } from '@redneckz/json-op';
import { type FileReaderAPI } from '../api/FileAPI';
import { inheritJSONDocContent } from '../inheritance/inheritJSONDocContent';
import type { TransformationOptions } from './TransformationOptions';
import { transformJSONContent } from './transformJSONContent';

export const transformJSONDocContent =
  (api: FileReaderAPI) =>
  async <C extends JSONRecord>(docPath: string, options: TransformationOptions): Promise<C> =>
    transformJSONContent(await inheritJSONDocContent(api)(await api.readJSON(docPath)), options);
