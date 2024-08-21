
# Gravity Falls thisisnotawebsite.com bruteforcer

This program processes large word lists in parallel using Node.js worker threads and attempts to send each one to the GF endpoint. It supports batch processing of words with options for reversing the words and setting batch sizes. The program also provides a real-time progress bar that shows the percentage of completion, words processed per second, and the number of active workers.

## Features

- **Parallel Processing**: Utilizes multiple worker threads to process word lists concurrently.
- **Batch Processing**: Configurable batch sizes for processing words in chunks.
- **Word Reversing**: Optional feature to reverse each word before processing.
- **Progress Bar**: Real-time progress bar showing percentage complete, words per second, and active workers.
- **Automatic Code Reporting**: Automatically sends each found code to a central repository (https://haykam.com/notawebsite/) so you do not need to worry about losing your valid_codes.txt file.
- **.gz, .zip, .tar unpacker**: Automatically unpacks .gz, .zip and .tar files and uses the text inside for ease of use.

## Prerequisites

- Node.js v14 or higher
- Yarn or npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/word-list-processor.git
   cd word-list-processor
   ```

2. Install the dependencies:

   If you're using Yarn:

   ```bash
   yarn install
   ```

   Or if you're using npm:

   ```bash
   npm install
   ```

## Usage

### Basic Usage

To process word lists, you need to place the word list files in the bruteforcer/wordlists directory OR pass a parameter 'wordlistfolder' and run the program:

```bash
yarn start
```

OR with optional directory override parameter:
```bash
yarn start wordListFolder='../wordlists'
```

By default, the program will process the word lists with a batch size of 10,000 words per worker.

### Command-Line Arguments

You can pass command-line arguments to customize the behavior of the program:

- **reversewords**: Reverse each word before processing.
- **batchsize**: Set the size of batches to process. REDUCING THIS NUMBER WILL SPEED UP THE PROCESSING BUT UTILIZE MORE RESOURCES. ADJUST ACCORDING TO YOUR SPECS.
- **wordlistfolder** Set the directory containing your wordlist(s)
- **verbose** Set the verbosity flag to display found codes and errors in the terminal

#### Example with Arguments

```bash
yarn start reversewords=true batchsize=5000 wordlistfolder='../wordlists' verbose=true
```

This command will reverse each word and process the word lists from the ../wordlists directory in batches of 5,000 words per worker, displaying errors and found codes.

### Parameters in Code

If you prefer to set parameters in the code instead of using command-line arguments, you can directly modify the `main.ts` file:

```typescript
import { loadWordLists } from "./helpers/loadWordLists";
import { processWordLists } from "./bruteforce";

const main = async () => {
    const wordLists = await loadWordLists('../wordlists');
    await processWordLists(wordLists, true, 5000);  // Reverse words and use batch size of 5000
}

main();
```

## Progress Bar

The progress bar provides the following information in real-time:

- **Percentage Complete**: How much of the total task is complete.
- **Words Processed**: The number of words processed so far.
- **Words Per Second**: The average speed of processing words.
- **Active Workers**: The current number of active workers processing tasks.

## Example Output

```
Processing 3 files...
Worker 1 spawned to process 10000 words.
[:bar]  30% 30000/100000 words done (500.00 wps) | Workers: 3
Worker 2 spawned to process 10000 words.
Worker 3 spawned to process 5000 words.
[:bar]  60% 60000/100000 words done (450.00 wps) | Workers: 2
```

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Contributions are always welcome!
