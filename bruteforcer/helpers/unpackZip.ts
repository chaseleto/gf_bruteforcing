import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

export const unpackZip = async (zipPath: string): Promise<string[]> => {
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
            //@ts-expect-error
            .on('finish', () => resolve(extractedFiles))
            .on('error', reject);
    });

    return extractedFiles;
};
