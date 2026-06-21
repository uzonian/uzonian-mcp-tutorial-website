"""Request-scoped delegated bearer token management.

The token is stored in a ContextVar so each async request has its own value.
Middleware (or the server entrypoint) sets it from the Authorization header.
"""

from contextvars import ContextVar

_current_token: ContextVar[str | None] = ContextVar("_current_token", default=None)


def set_token(token: str) -> None:
    """Set the bearer token for the current request scope."""
    _current_token.set(token)


def get_token() -> str:
    """Return the current request's delegated bearer token.

    Raises:
        RuntimeError: If no token has been set for this request.
    """
    token = _current_token.get()
    if not token:
        raise RuntimeError(
            "No delegated bearer token found for the current request. "
            "Ensure the Authorization header is set and middleware has run."
        )
    return token


def clear_token() -> None:
    """Clear the token at the end of the request."""
    _current_token.set(None)
