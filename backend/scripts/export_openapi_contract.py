"""Regenerate frontend OpenAPI contract fixtures from the FastAPI app.

Run from repo root or backend/:

    backend/.venv/bin/python backend/scripts/export_openapi_contract.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_ROOT.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app  # noqa: E402
from app.schemas import CONTRACT_REQUIRED_PROPERTIES  # noqa: E402

OUT_DIR = REPO_ROOT / "frontend" / "src" / "contracts"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    openapi = app.openapi()
    (OUT_DIR / "openapi.json").write_text(json.dumps(openapi, indent=2) + "\n")
    (OUT_DIR / "required-properties.json").write_text(
        json.dumps(CONTRACT_REQUIRED_PROPERTIES, indent=2) + "\n"
    )
    print(f"Wrote {OUT_DIR / 'openapi.json'}")
    print(f"Wrote {OUT_DIR / 'required-properties.json'}")


if __name__ == "__main__":
    main()
