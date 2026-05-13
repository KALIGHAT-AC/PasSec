import re

ENTROPY_WEAK = 28
ENTROPY_MODERATE = 50
ENTROPY_STRONG = 70
ENTROPY_VERY_STRONG = 100


class PasswordScorer:
    def __init__(
        self,
        password: str,
        entropy_bits: float,
        is_breached: bool,
        has_lowercase: bool,
        has_uppercase: bool,
        has_digits: bool,
        has_symbols: bool,
    ):
        self.password = password
        self.entropy = entropy_bits
        self.is_breached = is_breached
        self.has_lower = has_lowercase
        self.has_upper = has_uppercase
        self.has_digits = has_digits
        self.has_symbols = has_symbols
        self.length = len(password)

    def _score_label(self) -> str:
        if self.is_breached:
            return "Breached"
        if self.entropy < ENTROPY_WEAK:
            return "Weak"
        if self.entropy < ENTROPY_MODERATE:
            return "Moderate"
        if self.entropy < ENTROPY_STRONG:
            return "Strong"
        return "Very Strong"

    def _build_recommendations(self) -> list[str]:
        recs: list[str] = []

        if self.is_breached:
            recs.append(
                "🚨 This password appears in known breach databases. "
                "Change it immediately on every site where it's used."
            )

        if self.length < 8:
            recs.append(
                f"Your password is only {self.length} characters long. "
                "Increasing to 12+ characters is the single highest-impact improvement you can make."
            )
        elif self.length < 12:
            recs.append(
                f"At {self.length} characters your password is below the recommended minimum. "
                "Aim for 16+ characters to achieve Strong entropy."
            )
        elif self.length < 16:
            recs.append(
                "Good length! Stretching to 16+ characters would push your entropy into "
                "the 'Very Strong' tier — try adding a random word or two."
            )

        missing: list[str] = []
        if not self.has_upper:
            missing.append("uppercase letters (A–Z)")
        if not self.has_digits:
            missing.append("digits (0–9)")
        if not self.has_symbols:
            missing.append("symbols (!@#$%^&*)")

        if missing:
            joined = ", ".join(missing)
            recs.append(
                f"Your password is missing: {joined}. Each new character class "
                "exponentially expands the attacker's search space."
            )

        if self._has_keyboard_walk():
            recs.append(
                "Detected a keyboard-walk pattern (e.g., 'qwerty', 'asdf'). "
                "Attackers include these in their first-pass dictionaries."
            )

        if self._has_repeated_chars():
            recs.append(
                "Repeated characters (e.g., 'aaa', '111') reduce effective entropy. "
                "Use a random mix instead."
            )

        if self._has_common_substitutions():
            recs.append(
                "Common leet-speak substitutions (@ for 'a', 3 for 'e') are well-known "
                "to attackers and add minimal real security."
            )

        if self.entropy >= ENTROPY_STRONG and not self.is_breached:
            recs.append(
                "✅ Strong entropy! For maximum security, use a password manager "
                "to generate and store a fully random 20+ character password."
            )

        if self.entropy < ENTROPY_MODERATE:
            recs.append(
                "Consider a passphrase — 4 random words joined by symbols "
                "(e.g., 'cloud!river$mountain#lake') is memorable and far stronger."
            )

        return recs[:5]

    def _has_keyboard_walk(self) -> bool:
        walks = ["qwerty", "asdf", "zxcv", "1234", "4321", "abcd", "qazwsx", "12345"]
        lower_pw = self.password.lower()
        return any(w in lower_pw for w in walks)

    def _has_repeated_chars(self) -> bool:
        return bool(re.search(r"(.)\1{2,}", self.password))

    def _has_common_substitutions(self) -> bool:
        common = {"@": "a", "3": "e", "1": "i", "0": "o", "5": "s", "$": "s"}
        lower = self.password.lower()
        for symbol, letter in common.items():
            if symbol in lower and letter in lower:
                return True
        return False

    def evaluate(self) -> tuple[str, list[str]]:
        return self._score_label(), self._build_recommendations()
