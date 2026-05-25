from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_funny_endpoint():
    response = client.get("/api/funny")
    assert response.status_code == 200
    data = response.json()
    assert "joke" in data
    assert len(data["joke"]) > 0
