import fs, { createReadStream, ReadStream } from 'fs';
import path from 'path';
import zlib, { Gunzip } from 'zlib';
import tarStream from 'tar-stream';
import unzipper from 'unzipper';

export const loadWordLists = async (folderPath: string = "./wordlists") => {
    const wordList: string[] = [];
    const wordListNames: string[] = [];
    let wordCount: number = 0;
    const fullPath = path.resolve(folderPath);

    for (const file of fs.readdirSync(fullPath)) {
        const filePath = path.join(fullPath, file);
        const filename = path.basename(filePath);

        if (fs.statSync(filePath).isFile()) {
            if (filename.endsWith('.txt')) {
                wordList.push(filePath);
                wordListNames.push(filename);
                wordCount += fs.readFileSync(filePath, 'utf-8').split('\n').length;
            } else if (filename.endsWith('.tar.gz') || filename.endsWith('.tar')) {
                const baseFilename = filename.replace(/\.tar\.gz$|\.tar$/, '');
                const extractedFilePath = path.join(fullPath, baseFilename);
                
                if (fs.existsSync(extractedFilePath)) {
                    continue;
                }

                const extractedFiles = await unpackTar(filePath, filename.endsWith('.tar.gz'));
                wordList.push(...extractedFiles);
                wordListNames.push(...extractedFiles.map(file => path.basename(file)));
                wordCount += extractedFiles.reduce((count, file) => {
                    return count + fs.readFileSync(file, 'utf-8').split('\n').length;
                }, 0);
            } else if (filename.endsWith('.zip')) {
                const baseFilename = filename.replace(/\.zip$/, '');
                const extractedFilePath = path.join(fullPath, baseFilename);

                if (fs.existsSync(extractedFilePath)) {
                    console.log(`Skipping ${filename} as ${baseFilename} already exists.`);
                    continue;
                }

                const extractedFiles = await unpackZip(filePath);
                wordList.push(...extractedFiles);
                wordListNames.push(...extractedFiles.map(file => path.basename(file)));
                wordCount += extractedFiles.reduce((count, file) => {
                    return count + fs.readFileSync(file, 'utf-8').split('\n').length;
                }, 0);
            }
        }
    }

    console.log(`Loaded ${wordCount} words from ${wordList.length} files\nWord Lists: ${wordListNames.join(', ')}`);
    return wordList;
};

const unpackTar = async (tarPath: string, isGzipped: boolean): Promise<string[]> => {
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

const unpackZip = async (zipPath: string): Promise<string[]> => {
    const extractedFiles: string[] = [];
    const extractPath = path.dirname(zipPath);

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('entry', (entry: any) => {
                const filePath = path.join(extractPath, entry.path);
                if (entry.type === 'File' && filePath.endsWith('.txt')) {
                    extractedFiles.push(filePath);
                }
            })
            //@ts-ignore
            .on('finish', () => resolve(extractedFiles))
            .on('error', reject);
    });

    return extractedFiles;
};
