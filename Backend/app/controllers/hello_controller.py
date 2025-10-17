"""Business logic for hello-related operations.

Controllers should encapsulate logic that could be reused across routes,
such as formatting, database access, or integration with other services.
"""

from datetime import datetime, timezone


def get_greeting_message() -> str:
  	"""Generate a simple greeting with a timestamp.

    Keeping logic separate makes it easy to unit test without HTTP overhead.
    """
    now = datetime.now(timezone.utc).isoformat()
    return f"Hello from FastAPI! UTC time is {now}"


