import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { Readable } from 'node:stream';
import * as readline from 'readline';
import { RetFileTypeEnum } from 'src/core/enums/ret-file-type.enum';

@Injectable()
export class IdentifyRetFileUseCase {
  constructor() { }

  async execute(fileStream: string | Readable): Promise<{
    fileType?: RetFileTypeEnum;
    error: boolean;
  }> {
    const stream = typeof fileStream === 'string' ? fs.createReadStream(fileStream) : fileStream;

    return new Promise((resolve, reject) => {
      const lines = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      const fileLines: string[] = [];
      let lineCount = 0;

      const cleanup = () => {
        lines.removeAllListeners();
        lines.close();
      };

      lines.on('line', (line: string) => {
        fileLines.push(line);
        lineCount++;

        if (lineCount >= 2) {
          cleanup();
          this.processFileIdentification(fileLines, resolve, reject);
        }
      });

      lines.on('error', (error) => {
        cleanup();
        reject(error);
      });

      lines.on('close', () => {
        if (lineCount < 2) {
          reject(
            new HttpException(
              'Arquivo inválido. Por favor envie um aquivo no formato correto ou entre em contato com o nosso suporte.',
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      });
    });
  }

  private processFileIdentification(
    fileLines: string[],
    resolve: (value: { fileType?: RetFileTypeEnum; error: boolean }) => void,
    reject: (reason?: any) => void,
  ): void {
    const firstLine = fileLines[0];
    const secondLine = fileLines[1];

    if (!firstLine || !secondLine) {
      reject(
        new HttpException(
          'Arquivo inválido. Por favor envie um aquivo no formato correto ou entre em contato com o nosso suporte.',
          HttpStatus.BAD_REQUEST,
        ),
      );
      return;
    }

    const recordType = firstLine.substring(0, 2);
    const fileType = firstLine.substring(2, 9);
    const registerId = secondLine.substring(0, 1);
    const isCnab400 = recordType === '02' && fileType === 'RETORNO' && registerId === '7';

    if (isCnab400) {
      resolve({
        fileType: RetFileTypeEnum.CNAB_400,
        error: false,
      });
      return;
    }

    const registerType = secondLine.substring(8, 9);
    const isCnab240 = fileType !== 'RETORNO' && registerType === 'T';

    if (isCnab240) {
      const fileCode = firstLine.substring(163, 166);
      const isCnab240_30 = fileCode === '030';
      const isCnab240_40 = fileCode === '040';

      if (!isCnab240_30 && !isCnab240_40) {
        reject(
          new HttpException(
            'Arquivo inválido. Por favor envie um aquivo no formato correto ou entre em contato com o nosso suporte.',
            HttpStatus.BAD_REQUEST,
          ),
        );
        return;
      }

      if (isCnab240_30) {
        resolve({
          fileType: RetFileTypeEnum.CNAB_240_30,
          error: false,
        });
        return;
      }

      if (isCnab240_40) {
        resolve({
          fileType: RetFileTypeEnum.CNAB_240_40,
          error: false,
        });
        return;
      }
    }

    resolve({
      error: true,
    });
  }
}
