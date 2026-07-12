import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: baramati-classifieds-db.ctc60ggyc1kx.eu-north-1.rds.amazonaws.com
  }
});
