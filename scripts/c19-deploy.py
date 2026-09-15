#!/usr/bin/env python3
import sys
import time

sys.path.insert(0, r"C:\Users\anara\Desktop\ASCK_WORKSPACE\00_CENTRO_DE_MANDO\vps")
from _cf import api

APP = "ar9athq8375g243vh3s7t49b"
status, response = api("POST", f"/api/v1/deploy?uuid={APP}")
deployment = (
    response.get("deployments", [{}])[0].get("deployment_uuid")
    if isinstance(response, dict)
    else None
)
print(f"enqueue_http={status} deployment={deployment}", flush=True)
if not deployment:
    print(response)
    raise SystemExit(2)

last = None
for elapsed in range(0, 901, 5):
    status, data = api("GET", f"/api/v1/deployments/{deployment}")
    state = data.get("status") if isinstance(data, dict) else "unknown"
    if state != last:
        print(f"elapsed={elapsed}s http={status} status={state}", flush=True)
        last = state
    if state == "finished":
        raise SystemExit(0)
    if state in {"failed", "cancelled-by-user"}:
        raise SystemExit(3)
    time.sleep(5)
raise SystemExit(4)
