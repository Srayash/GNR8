import os

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    reload = os.environ.get("ENV", "dev") == "dev"
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=reload)
