import { JSONRecord, async, fp } from '@redneckz/json-op';
import { collectRef } from '@redneckz/json-ref';
import { TransformationOptions } from './transformJSONContent/TransformationOptions';
import { transformJSONDocContent } from './transformJSONContent/transformJSONDocContent';
import { type FileAPI } from './api/FileAPI';

export type Fallback = JSONRecord;

export const computeAPIFallback =
  (api: FileAPI) =>
  async (data: JSONRecord, options: TransformationOptions): Promise<Fallback> =>
    Object.fromEntries(
      await async.fulfilled(
        collectRef(data).map(async ref => fp.pair(ref, await transformJSONDocContent(api)(ref, options)))
      )
    );
