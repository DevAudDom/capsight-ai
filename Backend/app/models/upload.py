"""Pydantic models (schemas) for upload endpoints.

Schemas provide a single source of truth for I/O data shapes. They help
with validation and automatic OpenAPI documentation.
"""

from pydantic import BaseModel


class pdfUploadText(BaseModel):
    text: str