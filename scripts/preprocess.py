import os
import sys
import requests
import zipfile
import tarfile
import gzip
import shutil

def download_wordlists(repo_url, dest_folder):
    os.makedirs(dest_folder, exist_ok=True)
    
    response = requests.get(repo_url)
    files = response.json()

    for file_info in files:
        if file_info['name'].endswith('.txt') or file_info['name'].endswith(('.tar.gz', '.tar', '.zip', '.gz')):
            download_url = file_info['download_url']
            file_path = os.path.join(dest_folder, file_info['name'])
            print(f"Downloading {file_info['name']}...")
            with requests.get(download_url, stream=True) as r:
                with open(file_path, 'wb') as f:
                    shutil.copyfileobj(r.raw, f)

    print(f"Downloaded wordlists to {dest_folder}")

def extract_file(file_path, dest_folder):
    extracted_files = []
    if file_path.endswith('.tar.gz') or file_path.endswith('.tar'):
        with tarfile.open(file_path, 'r:*') as tar:
            tar.extractall(path=dest_folder)
            extracted_files = tar.getnames()
    elif file_path.endswith('.zip'):
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(dest_folder)
            extracted_files = zip_ref.namelist()
    elif file_path.endswith('.gz'):
        with gzip.open(file_path, 'rb') as f_in:
            output_path = os.path.join(dest_folder, os.path.basename(file_path[:-3]))
            with open(output_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
            extracted_files.append(output_path)

    return [os.path.join(dest_folder, f) for f in extracted_files if f.endswith('.txt')]

def load_wordlists(folder_path):
    word_set = set()
    for root, _, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line in f:
                        word_set.add(line.strip())
            elif file.endswith(('.tar.gz', '.tar', '.zip', '.gz')):
                extracted_files = extract_file(file_path, root)
                for extracted_file in extracted_files:
                    with open(extracted_file, 'r', encoding='utf-8', errors='ignore') as f:
                        for line in f:
                            word_set.add(line.strip())
    print(f"Loaded {len(word_set)} unique words from downloaded wordlists")
    return word_set

def remove_duplicates(new_wordlist_path, word_set, output_path):
    total_words = 0
    deleted_words = 0

    with open(new_wordlist_path, 'r', encoding='utf-8', errors='ignore') as f_in, open(output_path, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            word = line.strip()
            total_words += 1
            if word not in word_set:
                f_out.write(word + '\n')
            else:
                deleted_words += 1

    print(f"Filtered wordlist saved to {output_path}")
    print(f"Total words processed: {total_words}")
    print(f"Number of words deleted: {deleted_words}")

def cleanup_directory(directory_path):
    if os.path.exists(directory_path):
        shutil.rmtree(directory_path)
        print(f"Deleted directory: {directory_path}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 preprocess.py newwordlist.txt")
        sys.exit(1)

    new_wordlist_path = sys.argv[1]
    output_path = './filtered_wordlist.txt'
    repo_url = 'https://api.github.com/repos/chaseleto/gf_bruteforcing/contents/wordlists'
    dest_folder = './downloaded_wordlists'
    download_wordlists(repo_url, dest_folder)
    word_set = load_wordlists(dest_folder)
    remove_duplicates(new_wordlist_path, word_set, output_path)
    cleanup_directory(dest_folder)

if __name__ == "__main__":
    main()
