import pickle
import sys
from pathlib import Path

from app.agents import pipeline, pipeline_followup

# The pickle artifacts were created when `pipeline` and `pipeline_followup` were
# top-level modules. Alias them in sys.modules so pickle.load resolves the
# original import paths without re-pickling the model.
sys.modules.setdefault("pipeline", pipeline)
sys.modules.setdefault("pipeline_followup", pipeline_followup)

_ARTIFACTS = Path(__file__).resolve().parents[2] / "artifacts"

with open(_ARTIFACTS / "website_creator_pipeline.pkl", "rb") as f:
    model = pickle.load(f)

with open(_ARTIFACTS / "followup_pipeline.pkl", "rb") as f:
    model2 = pickle.load(f)
