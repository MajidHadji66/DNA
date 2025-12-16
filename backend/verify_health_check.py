import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from api import app

# Create test client
client = TestClient(app)

def test_health():
    with open("verification_result.txt", "w") as f:
        print("Testing /health endpoint...", file=f)
        try:
            response = client.get("/health")
            print(f"Status Code: {response.status_code}", file=f)
            print(f"Response: {response.json()}", file=f)
            
            if response.status_code in [200, 503]:
                print("PASS: Endpoint is reachable and returned valid status.", file=f)
            else:
                print("FAIL: Unexpected status code.", file=f)
                sys.exit(1)
        except Exception as e:
            print(f"FAIL: Exception during request: {e}", file=f)
            sys.exit(1)

if __name__ == "__main__":
    try:
        test_health()
    except Exception as e:
        print(f"FAIL: Exception occurred: {e}")
        sys.exit(1)
