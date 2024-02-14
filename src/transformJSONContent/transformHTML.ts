import { JSONPath, fp } from '@redneckz/json-op';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { JSONEntryTransformPrecondition, entryValueTransform } from './JSONEntryTransform';
import { adjustHTML } from './adjustHTML';

export const precondition: JSONEntryTransformPrecondition = fp.t0(JSONPath.endsWith(['__html']));

export const transform = entryValueTransform(async html => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const extendedSchema = {
    ...defaultSchema,
    protocols: {
      ...defaultSchema.protocols,
      href: [...(defaultSchema?.protocols?.href || []), 'tel']
    }
  };

  const result = await unified()
    .use(rehypeParse)
    .use(rehypeSanitize, extendedSchema)
    .use(rehypeStringify)
    .process(html);

  return adjustHTML(result.toString('utf-8'));
});
