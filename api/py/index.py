from app.main import app

# Vercel needs the application instance to be available at module level
# We don't wrap it in a handler function, Vercel's python runtime handles ASGI apps automatically if 'app' is exposed.

# Important: When running behind a rewrite like /api/py/*, 
# FastAPI needs to know it's not at the root.
app.root_path = "/api/py"
