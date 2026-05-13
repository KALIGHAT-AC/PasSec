import logging
import os

logger = logging.getLogger(__name__)


class DictionaryAttackEngine:
    def __init__(self, wordlist_path: str):
        self.passwords: set[str] = set()
        self._load(wordlist_path)

    def _load(self, path: str) -> None:
        if not os.path.exists(path):
            logger.warning(
                f"Wordlist not found at '{path}'. Dictionary checks return False. "
                "Run: python utils/download_wordlist.py"
            )
            return

        count = 0
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                word = line.strip()
                if word:
                    self.passwords.add(word.lower())
                    count += 1

        logger.info(f"Dictionary engine loaded {count:,} passwords from '{path}'.")

    def check(self, password: str) -> bool:
        return password.lower() in self.passwords
