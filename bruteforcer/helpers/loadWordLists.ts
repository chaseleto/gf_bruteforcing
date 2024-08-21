import fs from 'fs';
import path from 'path';
import { unpackTar } from './unpackTar';
import { unpackZip } from './unpackZip';

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
