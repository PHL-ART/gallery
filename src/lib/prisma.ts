import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

function getDatabaseUrl() {
  const direct = process.env.DATABASE_URL;
  // Если dotenv/Next не развернул ${...} в DATABASE_URL, то это всё равно будет строка с плейсхолдерами.
  if (direct && !direct.includes("${")) return direct;

  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const db = process.env.POSTGRES_DB;
  const ip = process.env.POSTGRES_IP;
  const port = process.env.POSTGRES_PORT;
  const schema = process.env.POSTGRES_SCHEMA ?? "public";

  if (!user || !password || !db || !ip || !port) {
    throw new Error(
      "Missing required Postgres env vars (POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB/POSTGRES_IP/POSTGRES_PORT)",
    );
  }

  return `postgresql://${user}:${password}@${ip}:${port}/${db}?schema=${schema}`;
}

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: getDatabaseUrl() }),
  });

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

