/**
 * DeepArchi skill pack — registers the skills shipped in `skills/` on the
 * session skill registry.
 *
 * The package depends on no `@deepseek-ai/*` module: it reads its own files and
 * calls the injected `ctx.skills` service, so it keeps working across harness
 * releases that keep the skill capability seam stable.
 */

import { readFileSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Skill directories shipped inside this package. */
const SKILL_NAMES = ['architecture-gap-analysis']

/**
 * Precedence rank for packaged skills. Mirrors `BUNDLED_SKILL_RANK` exported by
 * `@deepseek-ai/dsh-skill` (600); kept local so the package imports no harness
 * module at load time.
 */
const BUNDLED_SKILL_RANK = 600

/** Cordis plugin identity. */
export const name = 'deeparchi-skills'

/** Service this plugin requires. */
export const inject = ['skills']

/**
 * Parse the `name` and `description` scalars from a skill's YAML frontmatter.
 * @param raw - Full `SKILL.md` source.
 * @param path - File path, for error messages.
 * @returns The two required fields plus the body after the frontmatter.
 */
function parseSkill(raw, path) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (frontmatter?.[1] === undefined) throw new Error(`${name}: ${path} has no YAML frontmatter`)
  const fields = new Map()
  for (const line of frontmatter[1].split(/\r?\n/u)) {
    const entry = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/u.exec(line)
    if (entry === null) continue
    const value = entry[2].trim().replace(/^['"]|['"]$/gu, '')
    if (value.length > 0) fields.set(entry[1], value)
  }
  const skillName = fields.get('name')
  const description = fields.get('description')
  if (typeof skillName !== 'string' || skillName.length === 0) {
    throw new Error(`${name}: ${path} has no frontmatter name`)
  }
  if (typeof description !== 'string' || description.length === 0) {
    throw new Error(`${name}: ${path} has no frontmatter description`)
  }
  return { skillName, description, content: raw.slice(frontmatter[0].length).trim() }
}

/**
 * Register every shipped skill with the session skill registry.
 * @param ctx - Context carrying the `skills` service.
 */
export function apply(ctx) {
  const root = fileURLToPath(new URL('../skills/', import.meta.url))
  const candidates = SKILL_NAMES.map((directory) => {
    const skillDirectory = join(root, directory)
    const path = join(skillDirectory, 'SKILL.md')
    if (!statSync(path).isFile()) throw new Error(`${name}: expected a skill file at ${path}`)
    const parsed = parseSkill(readFileSync(path, 'utf8'), path)
    return {
      name: parsed.skillName,
      description: parsed.description,
      invocation: { modelInvocable: true, userInvocable: true },
      provider: name,
      source: 'bundled',
      rank: BUNDLED_SKILL_RANK,
      resourceBase: { kind: 'directory', path: skillDirectory },
      locator: path,
    }
  })

  ctx.skills.registerProvider(() => ({
    name,
    list: () => Promise.resolve(candidates),
    async get(candidate, options) {
      const { rank, locator, ...summary } = candidate
      const path = String(locator)
      const raw = await readFile(path, { encoding: 'utf8', signal: options?.signal })
      return { ...summary, content: parseSkill(raw, path).content }
    },
  }))
}
