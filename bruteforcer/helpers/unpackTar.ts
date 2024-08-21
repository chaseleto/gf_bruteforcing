import fs, { createReadStream, ReadStream } from 'fs';
import path from 'path';
import zlib, { Gunzip } from 'zlib';
import tarStream from 'tar-stream';

export const unpackTar = async (tarPath: string, isGzipped: boolean): Promise<string[]> => {
    const extractedFiles: string[] = [];
    const extractPath = path.dirname(tarPath);
    const extract = tarStream.extract();

    return new Promise<string[]>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const filePath = path.join(extractPath, header.name);
            if (header.type === 'file' && filePath.endsWith('.txt')) {
                const outputFile = fs.createWriteStream(filePath);
                stream.pipe(outputFile);
                extractedFiles.push(filePath);
            }
            stream.on('end', next);
            stream.resume();
        });

        extract.on('finish', () => resolve(extractedFiles));
        extract.on('error', reject);

        let fileStream: ReadStream | Gunzip = createReadStream(tarPath);
        if (isGzipped) {
            fileStream = fileStream.pipe(zlib.createGunzip()) as unknown as ReadStream;
        }

        (fileStream as ReadStream).pipe(extract).on('error', reject);
    });
};
