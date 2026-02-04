import os
import sys

# Add 'backend' directory to sys.path so that 'app' can be imported
# Structure:
# repo_root/
#   backend/
#     app/
#   api/
#     py/
#       index.py

current_dir = os.path.dirname(os.path.abspath(__file__))
# Navigate: api/py -> api -> root -> backend
backend_dir = os.path.join(current_dir, '..', '..', 'backend')
sys.path.append(backend_dir)

try:
    from app.main import app
except ImportError as e:
    # Fallback/Debug response if import fails
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/health")
    def health_fallback():
        return {"status": "error", "detail": str(e), "path": sys.path, "cwd": os.getcwd()}

# Set root path for Vercel rewrites
app.root_path = "/api/py"
