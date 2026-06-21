"""Unit tests for trim.py — payload trimming utilities."""

import json

from cowork_mcp.trim import clip_text, trim_dict, trim_list


class TestClipText:
    def test_short_text_unchanged(self):
        text = "hello"
        assert clip_text(text, max_bytes=100) == "hello"

    def test_long_text_clipped(self):
        text = "a" * 200
        result = clip_text(text, max_bytes=50)
        assert len(result.encode("utf-8")) <= 50
        assert result.endswith("...")

    def test_unicode_boundary(self):
        # Emoji are multi-byte; ensure we don't break mid-character
        text = "😀" * 50
        result = clip_text(text, max_bytes=20)
        assert len(result.encode("utf-8")) <= 20

    def test_exact_boundary(self):
        text = "a" * 100
        assert clip_text(text, max_bytes=100) == text


class TestTrimDict:
    def test_small_dict_unchanged(self):
        data = {"key": "value", "num": 42}
        result = trim_dict(data, max_bytes=4096)
        assert result == data

    def test_long_value_clipped(self):
        data = {"content": "x" * 10000}
        result = trim_dict(data, max_bytes=200)
        assert len(json.dumps(result).encode("utf-8")) <= 200


class TestTrimList:
    def test_fits_in_budget(self):
        items = [{"a": "short"}, {"b": "also short"}]
        result = trim_list(items, max_bytes=4096)
        assert len(result) == 2

    def test_truncates_excess_items(self):
        items = [{"content": "x" * 500} for _ in range(100)]
        result = trim_list(items, max_bytes=1024)
        assert len(result) < 100
        total = len(json.dumps(result).encode("utf-8"))
        assert total <= 1024
