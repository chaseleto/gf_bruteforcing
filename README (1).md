
# NotAWebsite Brute Force Used Wordlists

A central repository for all wordlists that have already been bruteforced, along with essential scripts to streamline your brute forcing process. This repository is designed to help you efficiently manage your wordlists and ensure that you’re not wasting time on words that have already been tested.

## Features

### Wordlist Processing Script
- **Removes Duplicate Entries:** Filters out words that have already been tested in previous brute force attempts, ensuring that your new wordlist only contains unique, untested words.
- **Supports Multiple Formats:** The script can handle `.txt`, `.tar.gz`, `.tar`, `.zip`, and `.gz` files, automatically extracting and processing them.
- **Automatic Cleanup:** After processing, the script deletes the downloaded wordlists to conserve disk space.
- **Detailed Output:** Provides a summary of the total words processed, the number of words deleted, and the number of words kept.

### JavaScript-Based Bruteforcer
- **Parallel Processing**: Utilizes multiple worker threads to process word lists concurrently.
- **Batch Processing**: Configurable batch sizes for processing words in chunks.
- **Word Reversing**: Optional feature to reverse each word before processing.
- **Progress Bar**: Real-time progress bar showing percentage complete, words per second, and active workers.
- **Automatic Code Reporting**: Automatically sends each found code to a central repository (https://haykam.com/notawebsite/) so you do not need to worry about losing your valid_codes.txt file.
- **.gz, .zip, .tar unpacker**: Automatically unpacks .gz, .zip and .tar files and uses the text inside for ease of use.

## How to Use the Wordlist Processing Script

### Prerequisites
- Python 3 installed on your system.
- An active internet connection to download wordlists from the repository.

### Step-by-Step Instructions

1. **Clone the Repository:**
   - Clone the repository to your local machine:

     ```bash
     git clone https://github.com/chaseleto/gf_bruteforcing
     cd gf_bruteforcing
     ```

2. **Prepare Your New Wordlist:**
   - Place your new wordlist (e.g., \`mynewwordlist.txt\`) in the same directory as the \`preprocess.py\` script.

3. **Run the Script:**
   - Execute the script with your new wordlist as an argument:

     ```bash
     python3 preprocess.py mynewwordlist.txt
     ```

   - This will download the existing wordlists, filter out any words that have already been tested, and save the filtered list as \`filtered_wordlist.txt\`.

4. **Review the Output:**
   - The script will provide a summary of the process, including how many words were deleted and how many were kept in the final list.

5. **Automatic Cleanup:**
   - The \`downloaded_wordlists\` folder, which contains the wordlists downloaded from the repository, is automatically deleted after processing to save space.

## Using the JavaScript Bruteforcer

- **Instructions on the README.md in /bruteforcer:** After filtering your wordlist, you can use the included in this repository for the actual brute forcing. It's optimized for performance and designed specifically for the NotAWebsite platform. Read the README.md in the bruteforcer folder for more information.

### Important Note If you are using your own bruteforcer
- **Community Collaboration:** Ensure that the bruteforcer hits the endpoint for \`https://haykam.com/notawebsite/\` on every 200 response to help track valid codes together with the community.

If you prefer to use a Python-based bruteforcer, one is available at [this GitHub link](https://github.com/eetnaviation/notawebsite-bruteforce)

## Troubleshooting

- **Script Issues:** If the script doesn’t download the wordlists, check your internet connection and ensure that the GitHub repository is accessible.
- **Wordlist Size:** For very large wordlists, consider breaking them into smaller chunks for faster processing.
- **Bruteforcer Performance:** If you encounter rate limiting or performance issues, consider adjusting the rate of requests or using proxies.
