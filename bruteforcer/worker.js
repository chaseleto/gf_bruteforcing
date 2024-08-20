const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { parentPort, workerData } = require('worker_threads');

const url = "https://codes.thisisnotawebsitedotcom.com/";
const validCodeUrl = "https://haykam.com/notawebsite/submit";

const appendFileAsync = fs.promises.appendFile;
const maxRetries = 3;
const retryDelay = 1000;

const tryCode = async (code, reverseWords, verbose, attempt = 1) => {
    if (reverseWords) {
        code = code.split('').reverse().join('');
    }

    const form = new FormData();
    form.append('code', code);

    try {
        const response = await axios.post(url, form, {
            headers: form.getHeaders(),
        });

        if (response.status === 200) {
            if (verbose) {
                console.log(`Valid code found: ${code}`);
            }
            await appendFileAsync('valid_codes.txt', `${code}\n`);
            await axios.post(validCodeUrl, { code });
        } else if (response.status === 429) {
            if (verbose) {
                console.log(`Too many requests for code: ${code}, retrying...`);
            }
            throw new Error('Too many requests');
        } else if (response.status === 404) {
            return;
        } else if (response.status >= 500 && response.status < 600) {
            if (verbose) {
                console.log(`Server error for code: ${code}, retrying...`);
            }
            throw new Error(`Server error ${response.status}`);
        }
    } catch (error) {
        if (attempt < maxRetries && error.response?.status !== 404) {
            await new Promise(res => setTimeout(res, retryDelay));
            return tryCode(code, reverseWords, attempt + 1);
        }
    }

    parentPort.postMessage({ type: 'progress' })
};

const workerJob = async ({ words, reverseOption }) => {
    for (const word of words) {
        await tryCode(word, reverseOption);
    }
    parentPort.postMessage({ type: 'done' })
};

workerJob(workerData);
