import { type FileAPI } from '../api/FileAPI';
import { inheritJSONDocContent } from './inheritJSONDocContent';

describe('inheritJSONDocContent', () => {
  it('should return original JSON if no parent doc is defined', async () => {
    expect.assertions(1);

    const api = {
      listFiles: async () => [],
      readJSON: async () => ({})
    } as FileAPI;

    expect(await inheritJSONDocContent(api)({ foo: 123 })).toEqual({
      foo: 123
    });
  });

  it('should merge (inherit) parent JSON with the original one', async () => {
    expect.assertions(1);

    const content = { _extends: '/content/parent.json', foo: 123 };
    const parentContent = { foo: 111, bar: 456 };

    const api = {
      listFiles: async () => [],
      readJSON: async () => parentContent
    } as FileAPI;

    expect(await inheritJSONDocContent(api)(content)).toEqual({
      _extends: '/content/parent.json',
      foo: 123,
      bar: 456
    });
  });
});
