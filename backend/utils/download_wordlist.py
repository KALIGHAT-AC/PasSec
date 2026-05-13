"""
Fetch or build backend/data/common_passwords.txt (top common passwords).
Default URL: SecLists 10-million-password-list-top-100000.txt
Examples:
  python utils/download_wordlist.py
  python utils/download_wordlist.py --from-rockyou "C:\\path\\to\\rockyou.txt"
"""

import argparse
import os
import sys
import ssl
import urllib.request
from typing import Iterable

WORDLIST_URL = (
    "https://raw.githubusercontent.com/danielmiessler/SecLists/master"
    "/Passwords/Common-Credentials/10-million-password-list-top-100000.txt"
)
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "common_passwords.txt")


def _iter_passwords_from_file(path: str) -> Iterable[str]:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            pw = line.strip()
            if pw:
                yield pw


def _write_top_n(passwords: Iterable[str], output: str, n: int) -> int:
    seen: set[str] = set()
    count = 0
    with open(output, "w", encoding="utf-8", newline="\n") as out:
        for pw in passwords:
            key = pw.lower()
            if key in seen:
                continue
            seen.add(key)
            out.write(pw + "\n")
            count += 1
            if count >= n:
                break
    return count


def download(output_path: str, top_n: int = 100_000) -> None:
    ssl._create_default_https_context = ssl._create_unverified_context
    output = os.path.abspath(output_path)
    os.makedirs(os.path.dirname(output), exist_ok=True)

    if os.path.exists(output):
        print(f"[✓] Wordlist already exists at: {output}")
        print("    Delete the file and re-run to force a fresh download.")
        return

    print(f"[→] Downloading wordlist from:\n    {WORDLIST_URL}\n")

    def progress(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            pct = min(downloaded / total_size * 100, 100)
            bar = "█" * int(pct // 2) + "░" * (50 - int(pct // 2))
            sys.stdout.write(f"\r    [{bar}] {pct:.1f}%")
            sys.stdout.flush()

    try:
        urllib.request.urlretrieve(WORDLIST_URL, output, reporthook=progress)
        print(f"\n\n[✓] Saved to: {output}")

        with open(output, "r", encoding="utf-8", errors="ignore") as f:
            count = sum(1 for line in f if line.strip())
        print(f"[✓] Loaded {count:,} passwords.")

    except Exception as e:
        print(f"\n[✗] Download failed: {e}")
        print("    You can manually place a newline-delimited password list at:")
        print(f"    {output}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create the wordlist used for dictionary checks.")
    parser.add_argument("--output", default=OUTPUT_PATH, help="Output path (default: backend/data/common_passwords.txt)")
    parser.add_argument("--top", type=int, default=100_000, help="Max passwords (default: 100000).")
    parser.add_argument(
        "--from-rockyou",
        dest="rockyou_path",
        default="",
        help="Build from a local rockyou.txt instead of downloading.",
    )
    args = parser.parse_args()

    if args.rockyou_path:
        rockyou = os.path.abspath(args.rockyou_path)
        if not os.path.exists(rockyou):
            print(f"[✗] rockyou.txt not found at: {rockyou}")
            sys.exit(1)

        output = os.path.abspath(args.output)
        os.makedirs(os.path.dirname(output), exist_ok=True)
        if os.path.exists(output):
            print(f"[✓] Wordlist already exists at: {output}")
            print("    Delete the file and re-run to force a fresh build.")
            sys.exit(0)

        print(f"[→] Building top {args.top:,} from local rockyou.txt:\n    {rockyou}\n")
        count = _write_top_n(_iter_passwords_from_file(rockyou), output, args.top)
        print(f"[✓] Saved to: {output}")
        print(f"[✓] Loaded {count:,} passwords.")
        sys.exit(0)

    download(args.output, top_n=args.top)
