from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle

# Import the class used in the pickle file.
# Replace `pipeline` with the actual module where `WebsiteCreaterPipeline` is defined.
from pipeline import WebsiteCreaterPipeline
from pipeline_followup import  FollowUpCodePipeline

# Load the serialized model
try:
    with open("website_creator_pipeline.pkl", "rb") as f:
        model = pickle.load(f)
    with open("followup_pipeline.pkl", "rb") as f:
        model2 = pickle.load(f)
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

class FollowUpRequest(BaseModel):
    prompt: str  # Follow-up only requires a new prompt


followup_cache = {
    'latest_code': """<html>
<head><title>Homepage</title></head>
<body>
    <header><h1>Welcome to my homepage</h1></header>
    <p>This is a simple homepage with a header and a paragraph.</p>
</body>
</html>"""
}




@app.post("/predict/")
async def predict_text(request: PromptRequest):
    """Predict website code from user input prompt."""
    prompt = request.prompt

    # Perform prediction
    try:
        output = model.predict(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")

    followup_cache['latest_code'] = output
    return {output}



@app.post("/followup/")
async def followup_text(request: FollowUpRequest):
    """Handle follow-up requests and return improved code."""
    prompt = request.prompt

    previous_code = followup_cache['latest_code']
    print("Previous code:", previous_code)

    # Perform follow-up prediction using the last generated code and the new prompt
    try:
        output = model2.predict(prompt, previous_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")

    # Save the updated result for future follow-ups
    followup_cache['latest_code'] = output

    return {"updated_code": output}


@app.post("/readme/")
async def generate_reademe():


    previous_code = followup_cache['latest_code']

    try:
        output = model.readme(previous_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")


    return {"readme": output}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
