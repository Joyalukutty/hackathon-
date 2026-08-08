import httpx
r = httpx.post("http://127.0.0.1:8000/api/triage", data={"vitals_json": '{"patient_id": "PT-1002"}'}, timeout=30.0)
print(r.status_code)
print(r.text)
