from pydantic import BaseModel, Field


class PromptBody(BaseModel):
    prompt: str = Field(min_length=1)


class ImprovementBody(BaseModel):
    prompt: str = Field(min_length=1)
    code: str = Field(min_length=1)


class ReadmeBody(BaseModel):
    code: str = Field(min_length=1)
