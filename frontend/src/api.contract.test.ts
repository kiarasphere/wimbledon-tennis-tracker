/**
 * Frontend ↔ backend API contract drift checks.
 */
import { describe, expect, it } from 'vitest'
import openapi from './contracts/openapi.json' with { type: 'json' }
import requiredProperties from './contracts/required-properties.json' with { type: 'json' }

type OpenApiSchema = {
  type?: string
  properties?: Record<string, unknown>
  additionalProperties?: boolean
}

type OpenApiDoc = {
  paths: Record<
    string,
    {
      get: {
        responses: Record<
          string,
          {
            content?: {
              'application/json': {
                schema: { $ref?: string }
              }
            }
          }
        >
      }
    }
  >
  components: { schemas: Record<string, OpenApiSchema> }
}

const openapiDoc = openapi as OpenApiDoc
const requiredProps = requiredProperties as Record<string, string[]>

const FRONTEND_INTERFACE_KEYS: Record<string, string[]> = {
  SeasonContext: [
    'year',
    'tournament_id',
    'tournament_name',
    'tournament_official_name',
    'country_name',
    'location',
    'surface',
    'event_name',
    'date_start',
  ],
  PlayerStanding: [
    'position',
    'position_start',
    'player_id',
    'full_name',
    'name_acronym',
    'country',
    'country_colour',
    'photo_url',
    'points',
    'points_start',
  ],
  CountryStanding: [
    'position',
    'position_start',
    'country',
    'country_colour',
    'points',
    'points_start',
    'player_count',
  ],
  TournamentResult: [
    'position',
    'seed',
    'player_id',
    'full_name',
    'name_acronym',
    'country',
    'country_colour',
    'photo_url',
    'round_reached',
    'score',
    'retired',
    'walkover',
  ],
  PlayerProfile: [
    'player_id',
    'full_name',
    'name_acronym',
    'country',
    'country_colour',
    'photo_url',
  ],
  PlayerSeasonSummary: [
    'titles',
    'grand_slams',
    'best_result',
    'best_result_tournament',
    'matches_won',
    'matches_lost',
    'win_pct',
  ],
  PlayerSeasonRound: [
    'round',
    'tournament_id',
    'tournament_name',
    'date_start',
    'surface',
    'ranking_points',
    'ranking_position',
    'seed',
    'result',
    'opponent',
  ],
  PlayerRankingsResponse: ['context', 'standings'],
  CountryRankingsResponse: ['context', 'standings'],
  TournamentResultsResponse: ['context', 'results'],
  PlayerSeasonResponse: ['context', 'player', 'summary', 'trajectory'],
}

const DATA_PATHS = [
  '/api/rankings/atp',
  '/api/rankings/wta',
  '/api/rankings/countries',
  '/api/results/wimbledon',
  '/api/players/{player_id}/season',
] as const

function resolveRef(ref: string): OpenApiSchema {
  const name = ref.replace('#/components/schemas/', '')
  return openapiDoc.components.schemas[name]
}

describe('API OpenAPI contract', () => {
  it('exposes concrete (non-generic) 200 schemas for data routes', () => {
    for (const path of DATA_PATHS) {
      const schema = openapiDoc.paths[path].get.responses['200'].content?.['application/json'].schema
      expect(schema, path).toBeTruthy()
      expect(schema?.$ref, `${path} should $ref a named model`).toMatch(/^#\/components\/schemas\//)

      const resolved = resolveRef(schema!.$ref!)
      expect(resolved.type).toBe('object')
      expect(Object.keys(resolved.properties ?? {}).length).toBeGreaterThan(0)
      expect(
        resolved.additionalProperties === true && !resolved.properties,
        `${path} must not be a generic additionalProperties object`,
      ).toBe(false)
    }
  })

  it('keeps OpenAPI component properties aligned with frontend interfaces', () => {
    for (const [name, keys] of Object.entries(FRONTEND_INTERFACE_KEYS)) {
      const schemaProps = Object.keys(openapiDoc.components.schemas[name]?.properties ?? {}).sort()
      expect(schemaProps, name).toEqual([...keys].sort())
      expect([...requiredProps[name]].sort(), name).toEqual([...keys].sort())
    }
  })
})
