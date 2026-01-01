from fastapi import UploadFile

async def read_file(file: UploadFile):
    content = await file.read()
    return content.decode("utf-8", errors="ignore")
