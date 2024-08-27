const fs = require('fs');
const readline = require('readline');
const { Worker, isMainThread } = require('worker_threads');
const ProgressBar = require('progress');

let batchSize = 10000;
let reverseOption = false;
let totalTasks = 0;
let completedTasks = 0;
let activeWorkers = 0;
let startTime = Date.now();
let verbose = false;
let atbashOption = false;
const workers = [];

const processWordLists = (filePaths, reverse = false, batchsize = 10000, verbose = false, atbash = false) => {
    console.log(`Settings: Batch size: ${batchsize}, Reverse words: ${reverse}, Atbash: ${atbash}, Verbose: ${verbose}`);
    if (reverse) {
        console.log("Reversing words enabled..");
        reverseOption = true;
    }
    if (atbash) {
        console.log("Atbash enabled..");
        atbashOption = true;
    }
    batchSize = batchsize;
    verbose = verbose;
    console.log(`Processing ${filePaths.length} files...`);

    const progressBar = new ProgressBar('[:bar] :percent :current/:total words done (:wps wps) | Workers: :workers', {
        total: 0,
        width: 40,
        renderThrottle: 1000,
        workers: activeWorkers
    });

    if (isMainThread) {
        filePaths.forEach(filePath => {
            const rl = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: process.stdout,
                terminal: false
            });

            let wordsBuffer = [];

            rl.on('line', (line) => {
                wordsBuffer.push(line);
                if (wordsBuffer.length >= batchSize) {
                    rl.pause();
                    spawnWorker(wordsBuffer, progressBar); 
                    wordsBuffer = [];
                    rl.resume();
                }
            });

            rl.on('close', () => {
                if (wordsBuffer.length > 0) {
                    spawnWorker(wordsBuffer, progressBar);
                }
            });
        });
    }
};

const spawnWorker = (words, progressBar) => {
    totalTasks += words.length;
    progressBar.total = totalTasks;
    activeWorkers++;

    const worker = new Worker('./worker.js', {
        workerData: { words, reverseOption, verbose, atbashOption }
    });

    worker.on('message', (message) => {
        if (message.type === 'progress') {
            completedTasks++;
            const elapsedSeconds = (Date.now() - startTime) / 1000;
            const wordsPerSecond = (completedTasks / elapsedSeconds).toFixed(2);
            progressBar.tick({
                wps: wordsPerSecond,
                workers: activeWorkers
            });
        }
    });

    worker.on('exit', (code) => {
        activeWorkers--;
        if (verbose) {
            console.log(`Worker finished processing ${words.length} words.`);
        }
        progressBar.tick({ workers: activeWorkers });

        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });

    workers.push(worker);
    if (verbose) {
        console.log(`Worker ${workers.length} spawned to process ${words.length} words.`);
    }
    progressBar.tick({ workers: activeWorkers });
};

module.exports = { processWordLists };
