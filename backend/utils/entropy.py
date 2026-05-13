import math
import re

GPU_SPEED = 100_000_000_000


class BruteForceEngine:
    def __init__(self, password: str):
        self.password = password

    def _analyze_pool(self) -> dict:
        pw = self.password
        has_lower = bool(re.search(r"[a-z]", pw))
        has_upper = bool(re.search(r"[A-Z]", pw))
        has_digits = bool(re.search(r"[0-9]", pw))
        has_symbols = bool(re.search(r"[^a-zA-Z0-9]", pw))

        pool = 0
        if has_lower:
            pool += 26
        if has_upper:
            pool += 26
        if has_digits:
            pool += 10
        if has_symbols:
            pool += 32
        pool = max(pool, 26)

        return {
            "has_lowercase": has_lower,
            "has_uppercase": has_upper,
            "has_digits": has_digits,
            "has_symbols": has_symbols,
            "pool_size": pool,
        }

    def _entropy(self, length: int, pool: int) -> float:
        if length == 0 or pool == 0:
            return 0.0
        return round(length * math.log2(pool), 2)

    @staticmethod
    def _human_readable(seconds: float) -> str:
        if seconds < 0.001:
            return "Instant (< 1ms)"
        if seconds < 1:
            return f"{seconds * 1000:.2f} Milliseconds"
        if seconds < 60:
            return f"{seconds:.2f} Seconds"
        if seconds < 3_600:
            return f"{seconds / 60:.1f} Minutes"
        if seconds < 86_400:
            return f"{seconds / 3_600:.1f} Hours"
        if seconds < 31_536_000:
            return f"{seconds / 86_400:.1f} Days"

        years = seconds / 31_536_000
        if years < 1_000:
            return f"{years:.1f} Years"
        if years < 1_000_000:
            return f"{years / 1_000:.1f} Thousand Years"
        if years < 1_000_000_000:
            return f"{years / 1_000_000:.1f} Million Years"
        if years < 1_000_000_000_000:
            return f"{years / 1_000_000_000:.2f} Billion Years"
        return f"{years / 1_000_000_000_000:.2f} Trillion Years"

    def calculate(self) -> dict:
        L = len(self.password)
        pool_data = self._analyze_pool()
        R = pool_data["pool_size"]
        entropy = self._entropy(L, R)

        try:
            combinations = float(R**L)
        except OverflowError:
            combinations = float("inf")

        if combinations == float("inf"):
            seconds = float("inf")
            human_time = "Heat death of the universe (∞)"
        else:
            seconds = combinations / GPU_SPEED
            human_time = self._human_readable(seconds)

        return {
            **pool_data,
            "entropy_bits": entropy,
            "combinations": combinations,
            "time_to_crack_seconds": seconds,
            "human_readable_time": human_time,
        }
