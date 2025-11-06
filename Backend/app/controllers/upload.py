"""Business logic for upload related operations.

Controllers should encapsulate logic that could be reused across routes,
such as formatting, database access, or integration with other services.
"""

def upload_pdf_text(pdf_text: pdfUploadText) -> str:
    """Upload a PDF file and return the text."""
    print(pdf_text.text)
    return "PDF text uploaded successfully"

