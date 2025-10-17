"""Pydantic models (schemas) for hello endpoints.

Schemas provide a single source of truth for I/O data shapes. They help
with validation and automatic OpenAPI documentation.
"""

from pydantic import BaseModel


class HelloResponse(BaseModel):
    message: str


