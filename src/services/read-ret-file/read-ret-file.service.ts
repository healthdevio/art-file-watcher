import { Readable } from 'node:stream';

export class ReadRetFileService {
  constructor() {}

  async indentifyFile(filePath: string): Promise<any> {}

  async readFile(file: string | Buffer | Readable): Promise<any> {}

  private async readFileStream(fileStream: Readable): Promise<any> {}

  private async readFileBuffer(fileBuffer: Buffer): Promise<any> {}

  private async readFileString(filePath: string): Promise<any> {}
}
