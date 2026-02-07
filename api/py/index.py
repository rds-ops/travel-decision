import os
import sys
import traceback

# Add 'backend' directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, '..', '..', 'backend'))
sys.path.append(backend_dir)

# Debug: Print paths to Vercel logs
print(f"DEBUG: Current Dir: {current_dir}", file=sys.stderr)
print(f"DEBUG: Backend Dir: {backend_dir}", file=sys.stderr)
print(f"DEBUG: Sys Path: {sys.path}", file=sys.stderr)
print(f"DEBUG: Directory contents of backend_dir: {os.listdir(backend_dir) if os.path.exists(backend_dir) else 'NOT FOUND'}", file=sys.stderr)

try:
    from app.main import app
except Exception as e:
    # Catastrophic failure fallback
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI()
    
    error_msg = f"Failed to import app.main: {str(e)}"
    trace = traceback.format_exc()
    print(error_msg, file=sys.stderr)
    print(trace, file=sys.stderr)

    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def catch_all(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "detail": error_msg,
                "traceback": trace.split('\n'),
                "cwd": os.getcwd(),
                "sys_path": sys.path
            }
        )

# Set root path for Vercel rewrites
app.root_path = "/api/py"
