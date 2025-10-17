"""HTTP route definitions for the sample hello endpoint.

Routes should be thin wrappers that validate inputs and return responses,
delegating business logic to controllers.
"""

from fastapi import APIRouter
from app.controllers.hello_controller import get_greeting_message
from app.models.hello import HelloResponse

router = APIRouter(tags=["hello"])


@router.get("/hello", response_model=HelloResponse)
def hello() -> HelloResponse:
    """
    Returns a simple JSON payload.
    - response_model ensures output adheres to a defined schema
    - typing helps document and catch mismatches during development
    """
    message = get_greeting_message()
    return HelloResponse(message=message)


