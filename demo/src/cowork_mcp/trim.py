"""Payload trimming utilities — enforce a byte budget on outgoing responses.

All functions are pure and unit-testable.
"""

from __future__ import annotations

from .config import settings

MAX_RESPONSE_BYTES: int = settings.max_response_bytes


def clip_text(text: str, max_bytes: int = MAX_RESPONSE_BYTES) -> str:
    """Clip a string to fit within *max_bytes* UTF-8 bytes.

    If the text is already within budget it is returned unchanged.
    Otherwise it is truncated and an ellipsis marker is appended.
    """
    encoded = text.encode("utf-8")
    if len(encoded) <= max_bytes:
        return text
    # Truncate at byte boundary, decode safely, append marker
    truncated = encoded[: max_bytes - 3].decode("utf-8", errors="ignore")
    return truncated + "..."


def trim_dict(data: dict, max_bytes: int = MAX_RESPONSE_BYTES) -> dict:
    """Trim string values in a flat dict so the total JSON payload stays small.

    Long string values are individually clipped. Non-string values pass through.
    """
    import json

    budget = max_bytes
    result: dict = {}
    for key, value in data.items():
        if isinstance(value, str):
            # Reserve some bytes for the key + JSON overhead
            overhead = len(json.dumps({key: ""}).encode("utf-8"))
            available = max(64, budget - overhead)
            result[key] = clip_text(value, available)
        else:
            result[key] = value
        # Recompute remaining budget
        budget = max_bytes - len(json.dumps(result).encode("utf-8"))
        if budget <= 0:
            break
    return result


def trim_list(items: list[dict], max_bytes: int = MAX_RESPONSE_BYTES) -> list[dict]:
    """Trim a list of dicts to fit within the byte budget."""
    import json

    result: list[dict] = []
    total = 2  # opening/closing brackets
    for item in items:
        trimmed = trim_dict(item, max_bytes=max_bytes // max(len(items), 1))
        entry_size = len(json.dumps(trimmed).encode("utf-8")) + 1  # comma
        if total + entry_size > max_bytes:
            break
        result.append(trimmed)
        total += entry_size
    return result
