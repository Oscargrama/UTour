import fs from "node:fs/promises"
import path from "node:path"
import { Client } from "pg"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config()

function exitWith(message: string) {
  console.error(message)
  process.exit(1)
}

async function main() {
  const args = process.argv.slice(2)
  const fileArg = args[0]

  if (!fileArg) {
    exitWith("Uso: npm run db:seed scripts/archivo.sql")
  }

  const scriptsDir = path.resolve(process.cwd(), "scripts")
  const resolvedPath = path.resolve(process.cwd(), fileArg)

  if (!resolvedPath.startsWith(scriptsDir + path.sep)) {
    exitWith("Por seguridad, solo se permiten archivos dentro de /scripts.")
  }

  if (!resolvedPath.endsWith(".sql")) {
    exitWith("El archivo debe tener extensión .sql")
  }

  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL
  if (!databaseUrl) {
    exitWith("Falta DATABASE_URL en variables de entorno (Supabase > Settings > Database > Connection String).")
  }

  const sql = await fs.readFile(resolvedPath, "utf-8")
  if (!sql.trim()) {
    exitWith("El archivo SQL está vacío.")
  }

  let connectionString = databaseUrl
  try {
    const parsed = new URL(databaseUrl)
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require")
    }
    connectionString = parsed.toString()
    console.log(`Conectando a ${parsed.hostname}:${parsed.port || "5432"}`)
  } catch {
    // keep original if URL parsing fails
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    await client.query("BEGIN")
    await client.query(sql)
    await client.query("COMMIT")
    console.log(`SQL ejecutado correctamente: ${path.relative(process.cwd(), resolvedPath)}`)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error ejecutando SQL:", error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

void main()
