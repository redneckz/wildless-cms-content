import { async, fp, type JSONRecord } from '@redneckz/json-op';
import { collectRef } from '@redneckz/json-ref';
import { type FileReaderAPI } from './api/FileAPI';
import { type TransformationOptions } from './transformJSONContent/TransformationOptions';
import { transformJSONDocContent } from './transformJSONContent/transformJSONDocContent';

export type Fallback = JSONRecord;

export const computeAPIFallback =
  (api: FileReaderAPI) =>
  async (data: JSONRecord, options: TransformationOptions): Promise<Fallback> =>
    Object.fromEntries(
      await async.fulfilled(
        collectRef(data).map(async ref => fp.pair(ref, await transformJSONDocContent(api)(ref, options)))
      )
    );
