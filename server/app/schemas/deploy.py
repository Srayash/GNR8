from pydantic import BaseModel


class File(BaseModel):
    name: str
    content: str


class DeployBody(BaseModel):
    files: list[File]
