from pydantic import BaseModel, EmailStr


class SignupBody(BaseModel):
    email: EmailStr
    password: str
    confirmPassword: str


class SigninBody(BaseModel):
    email: EmailStr
    password: str
