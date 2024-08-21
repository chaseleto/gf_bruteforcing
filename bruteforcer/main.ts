import { loadWordLists } from "./helpers/loadWordLists";
//@ts-expect-error
import { processWordLists } from "./spawnWorkers";

const parseArguments = () => {
    const args = process.argv.slice(2);
    const options: { [key: string]: any } = {};

    args.forEach(arg => {
        const [key, value] = arg.split('=');
        options[key] = value === 'true' ? true : value === 'false' ? false : value;
    });

    return options;
};
const main = async () => {
    const args = parseArguments();
    console.log(args);
    const wordLists = await loadWordLists(args.wordfistfolder || './wordlists');
    
    await processWordLists(wordLists, args.reversewords, args.batchsize, args.verbose);
};

main()