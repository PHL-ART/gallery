import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const env = dotenv.config();
dotenvExpand.expand(env);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // Базовые рубрики для стартовой витрины
  const categories = [
    { slug: "best", name: "Лучшее", description: "Мои лучшие работы." },
    { slug: "street", name: "Улица", description: "Городская фотография." },
    { slug: "nature", name: "Природа", description: "Пейзажи и природные кадры." },
  ] as const;

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { slug: c.slug, name: c.name, description: c.description },
    });
  }

  // Стартовые теги (их можно будет расширить через админку)
  const tags = [
    { slug: "portrait", name: "Портрет" },
    { slug: "landscape", name: "Пейзаж" },
    { slug: "black-white", name: "Ч/Б" },
    { slug: "long-exposure", name: "Длинная выдержка" },
  ] as const;

  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: { slug: t.slug, name: t.name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

