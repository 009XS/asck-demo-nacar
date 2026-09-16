#!/usr/bin/env python3
"""Despliega nacar-dental por la API de Coolify y espera a `finished`.

La configuración de nginx de este sitio vive en el REPO (`nginx.conf`, copiado a
la imagen por el Dockerfile), no en Coolify: comprobado el 2026-09-15, la app
tiene `build_pack=dockerfile` y `custom_nginx_configuration` vacío. Por eso aquí
no se sincroniza nginx por API — pero sí se verifica esa premisa antes de
desplegar: si algún día alguien pega una configuración en el panel, esa ganaría
y las cabeceras de caché de `/film/**` dejarían de ser las del repo sin que nadie
se entere. Nunca imprime tokens ni configuración privada.
"""
import sys
import time

sys.path.insert(0, r"C:\Users\anara\Desktop\ASCK_WORKSPACE\00_CENTRO_DE_MANDO\vps")
from _cf import api

APP = "ar9athq8375g243vh3s7t49b"

status, app = api("GET", f"/api/v1/applications/{APP}")
if not isinstance(app, dict):
    print("ABORT: no pude leer la app:", str(app)[:200])
    raise SystemExit(1)
print(
    f"APP: {app.get('name')} | fqdn: {app.get('fqdn')} | rama: {app.get('git_branch')} "
    f"| build_pack: {app.get('build_pack')}",
    flush=True,
)
if app.get("name") != "nacar-dental":
    print("ABORT: el uuid NO corresponde a nacar-dental. No toco nada.")
    raise SystemExit(1)
if app.get("build_pack") != "dockerfile":
    print("ABORT: build_pack ya no es dockerfile; el nginx.conf del repo podría no servirse.")
    raise SystemExit(1)
if (app.get("custom_nginx_configuration") or "").strip():
    print(
        "ABORT: la app tiene custom_nginx_configuration en Coolify. Esa configuración "
        "mandaría sobre nginx.conf del repo (incluido el Cache-Control de /film/**). "
        "Sincronízala con el patrón de vps/_portfolio_deploy.py antes de desplegar."
    )
    raise SystemExit(1)
print("nginx: lo sirve la imagen desde nginx.conf del repo (Coolify sin override)", flush=True)

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
