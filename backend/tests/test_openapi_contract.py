"""OpenAPI contract tests — response schemas must stay concrete and complete."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.main import app
from app.schemas import CONTRACT_REQUIRED_PROPERTIES, DATA_ROUTE_RESPONSE_MODELS

FRONTEND_OPENAPI = (
    Path(__file__).resolve().parents[2] / "frontend" / "src" / "contracts" / "openapi.json"
)
FRONTEND_REQUIRED = (
    Path(__file__).resolve().parents[2]
    / "frontend"
    / "src"
    / "contracts"
    / "required-properties.json"
)


def _resolve_schema(openapi: dict[str, Any], schema: dict[str, Any]) -> dict[str, Any]:
    if "$ref" in schema:
        ref = schema["$ref"]
        assert ref.startswith("#/components/schemas/")
        name = ref.rsplit("/", 1)[-1]
        return openapi["components"]["schemas"][name]
    if "allOf" in schema and len(schema["allOf"]) == 1:
        return _resolve_schema(openapi, schema["allOf"][0])
    return schema


def test_data_routes_expose_concrete_response_schemas(client) -> None:
    openapi = client.get("/openapi.json").json()
    paths = openapi["paths"]

    for path, model in DATA_ROUTE_RESPONSE_MODELS.items():
        assert path in paths, f"missing path {path}"
        success = paths[path]["get"]["responses"]["200"]
        content = success["content"]["application/json"]["schema"]
        resolved = _resolve_schema(openapi, content)

        # Bare `{additionalProperties: true, type: object}` is the failure mode in AWT-23.
        assert resolved.get("type") == "object"
        assert "properties" in resolved and resolved["properties"], (
            f"{path} 200 schema has no properties (still a generic object)"
        )
        assert resolved.get("title") == model.__name__ or path == "/api/health"


def test_openapi_component_properties_match_contract(client) -> None:
    openapi = client.get("/openapi.json").json()
    components = openapi["components"]["schemas"]

    for name, required_props in CONTRACT_REQUIRED_PROPERTIES.items():
        assert name in components, f"missing component schema {name}"
        props = set(components[name].get("properties", {}))
        missing = set(required_props) - props
        assert not missing, f"{name} missing properties in OpenAPI: {sorted(missing)}"


def test_committed_frontend_openapi_matches_live_app() -> None:
    """Fail if schemas change without re-running export_openapi_contract.py."""
    live = app.openapi()
    committed = json.loads(FRONTEND_OPENAPI.read_text())
    assert committed["components"]["schemas"].keys() >= set(
        name for name in CONTRACT_REQUIRED_PROPERTIES
    )
    for name in CONTRACT_REQUIRED_PROPERTIES:
        live_props = set(live["components"]["schemas"][name]["properties"])
        committed_props = set(committed["components"]["schemas"][name]["properties"])
        assert live_props == committed_props, (
            f"{name} drifted — run backend/scripts/export_openapi_contract.py"
        )

    required = json.loads(FRONTEND_REQUIRED.read_text())
    assert required == CONTRACT_REQUIRED_PROPERTIES
