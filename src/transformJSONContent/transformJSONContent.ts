import { async, entries, fp, fromEntries, type JSONEntry, type JSONRecord } from '@redneckz/json-op';
import type { TransformationOptions } from './TransformationOptions';
import * as transformAttachment from './transformAttachment';
import * as transformAttachmentLink from './transformAttachmentLink';
import * as transformHTML from './transformHTML';
import * as transformMarkdown from './transformMarkdown';
import * as transformPicture from './transformPicture';

export async function transformJSONContent<C extends JSONRecord>(
  content: C,
  options: TransformationOptions
): Promise<C> {
  const mapper = fp.table<[JSONEntry], JSONEntry[] | Promise<JSONEntry[]>>(
    [transformMarkdown.precondition, transformMarkdown.transform],
    [transformHTML.precondition, transformHTML.transform],
    [transformAttachmentLink.precondition, transformAttachmentLink.transform(options)],
    [transformAttachment.precondition, transformAttachment.transform(options)],
    [transformPicture.precondition, transformPicture.transform(options)],
    [fp.Predicate.trueF, () => []]
  );

  const transformedEntries = await flatMapEntries(content, async entry => {
    try {
      return await mapper(entry);
    } catch (ex) {
      console.warn(`Error while transforming field "${entry[0].join('.')}" on page: ${content.title ?? content.slug}`);
      console.error(ex);
    }
    return [];
  });

  return fromEntries(content, transformedEntries) as C;
}

const flatMapEntries = async (
  data: JSONRecord,
  mapper: (entry: JSONEntry) => JSONEntry[] | Promise<JSONEntry[]>
): Promise<JSONEntry[]> => (await async.fulfilled(entries(data).map(mapper))).flat();
