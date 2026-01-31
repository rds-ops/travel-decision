import sys
import os

# Add the 'backend' directory to the Python path so that 'app' can find its modules
path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(path)

from app.main import app
