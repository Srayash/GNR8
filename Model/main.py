from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle

# Import the class used in the pickle file
# Replace `pipeline` with the actual module where `WebsiteCreaterPipeline` is defined
from pipeline import WebsiteCreaterPipeline

# Load the serialized model
try:
    with open("website_creator_pipeline.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise RuntimeError("Model file not found. Ensure 'website_creator_pipeline.pkl' is in the working directory.")
except AttributeError as e:
    raise RuntimeError(
        f"AttributeError during deserialization. Ensure the class definition is accessible. Details: {str(e)}"
    )

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origin(s) if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body
class PromptRequest(BaseModel):
    prompt: str


@app.post("/predict/")
async def predict_text(request: PromptRequest):
    """Predict website code from user input prompt."""
    prompt = request.prompt

    # Perform prediction
    try:
        output = model.predict(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")

    return {"prediction": output}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
