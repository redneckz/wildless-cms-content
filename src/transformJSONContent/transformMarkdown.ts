import { JSONPath, fp } from '@redneckz/json-op';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { adjustHTML } from './adjustHTML';

export const precondition: JSONEntryTransformPrecondition = fp.t0(JSONPath.endsWith(['__md']));

export const transform = entryValueTransform(async markdown => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  const result = await unified().use(remarkParse).use(remarkHtml).process(markdown);
  return adjustHTML(result.toString('utf-8'));
});
