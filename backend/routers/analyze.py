from fastapi import APIRouter, Request
from pydantic import BaseModel, field_validator

from utils.dictionary import DictionaryAttackEngine
from utils.entropy import BruteForceEngine
from utils.scorer import PasswordScorer

router = APIRouter(tags=["analysis"])


class PasswordRequest(BaseModel):
    password: str

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Password must not be empty.")
        if len(v) > 512:
            raise ValueError("Password must be 512 characters or fewer.")
        return v


class DictionaryResult(BaseModel):
    breached: bool


class BruteForceResult(BaseModel):
    combinations: float
    time_to_crack_seconds: float
    human_readable_time: str


class AnalysisResponse(BaseModel):
    length: int
    pool_size: int
    entropy_bits: float
    has_lowercase: bool
    has_uppercase: bool
    has_digits: bool
    has_symbols: bool
    dictionary_attack: DictionaryResult
    brute_force_attack: BruteForceResult
    overall_score: str
    recommendations: list[str]


@router.post("/analyze-password", response_model=AnalysisResponse)
async def analyze_password(payload: PasswordRequest, request: Request):
    password = payload.password
    dictionary_engine: DictionaryAttackEngine = request.app.state.dictionary_engine

    is_breached = dictionary_engine.check(password)
    bf = BruteForceEngine(password).calculate()
    score, recs = PasswordScorer(
        password=password,
        entropy_bits=bf["entropy_bits"],
        is_breached=is_breached,
        has_lowercase=bf["has_lowercase"],
        has_uppercase=bf["has_uppercase"],
        has_digits=bf["has_digits"],
        has_symbols=bf["has_symbols"],
    ).evaluate()

    return AnalysisResponse(
        length=len(password),
        pool_size=bf["pool_size"],
        entropy_bits=bf["entropy_bits"],
        has_lowercase=bf["has_lowercase"],
        has_uppercase=bf["has_uppercase"],
        has_digits=bf["has_digits"],
        has_symbols=bf["has_symbols"],
        dictionary_attack=DictionaryResult(breached=is_breached),
        brute_force_attack=BruteForceResult(
            combinations=bf["combinations"],
            time_to_crack_seconds=bf["time_to_crack_seconds"],
            human_readable_time=bf["human_readable_time"],
        ),
        overall_score=score,
        recommendations=recs,
    )
