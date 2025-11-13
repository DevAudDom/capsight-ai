from fastapi import APIRouter
from app.models.upload import pdfUploadText
from app.controllers.upload import  upload_pdf_text

router = APIRouter(tags=["upload"])

# @router.post("/upload", response_model=pdfUploadText)
# def upload(pdf_text: pdfUploadText) -> pdfUploadText:
#     return upload_pdf_text(pdf_text)