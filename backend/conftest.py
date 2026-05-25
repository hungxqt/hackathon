import os
import sys

# Add the backend directory to sys.path so tests can import main.py directly
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
