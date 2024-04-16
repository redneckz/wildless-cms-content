import { type FileReaderAPI } from './FileAPI';

export const composeFileReaderAPI = (primary: FileReaderAPI, secondary: FileReaderAPI): FileReaderAPI => ({
  async readJSON(filePath) {
    try {
      return await primary.readJSON(filePath);
    } catch (ex) {
      return secondary.readJSON(filePath);
    }
  }
});
