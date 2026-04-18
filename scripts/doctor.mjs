import fs from "node:fs";
import path from "node:path";
import net from "node:net";

const cwd = process.cwd();
const envPath = path.join(cwd, ".env");
const envExamplePath = path.join(cwd, ".env.example");
const prismaConfigPath = path.join(cwd, "prisma.config.ts");
const migrationPath = path.join(cwd, "prisma", "migrations", "202604170001_init", "migration.sql");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const result = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "");
    result[key] = value;
  }
  return result;
}

function parseDatabaseUrl(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return {
      ok: true,
      protocol: url.protocol.replace(":", ""),
      host: url.hostname,
      port: url.port || "(default)",
      database: url.pathname.replace(/^\//, "") || "(unknown)",
      search: url.search,
    };
  } catch {
    return { ok: false };
  }
}

function testPort(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let finished = false;

    const finish = (result) => {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(Number(port), host);
  });
}

async function main() {
  const env = loadEnvFile(envPath);
  const hasEnv = fs.existsSync(envPath);
  const hasEnvExample = fs.existsSync(envExamplePath);
  const hasPrismaConfig = fs.existsSync(prismaConfigPath);
  const hasMigration = fs.existsSync(migrationPath);
  const databaseUrl = env.DATABASE_URL || "";
  const nextAuthUrl = env.NEXTAUTH_URL || "";
  const nextAuthSecret = env.NEXTAUTH_SECRET || "";

  console.log("منصة إنجاز التعليمية - فحص البيئة");
  console.log("==================================");
  console.log(`.env موجود: ${hasEnv ? "نعم" : "لا"}`);
  console.log(`.env.example موجود: ${hasEnvExample ? "نعم" : "لا"}`);
  console.log(`prisma.config.ts موجود: ${hasPrismaConfig ? "نعم" : "لا"}`);
  console.log(`ملف migration الأولي موجود: ${hasMigration ? "نعم" : "لا"}`);

  if (!databaseUrl) {
    console.log("DATABASE_URL: غير مضبوط");
  } else {
    const parsed = parseDatabaseUrl(databaseUrl);
    if (!parsed.ok) {
      console.log("DATABASE_URL: غير صالح نحويًا");
    } else {
      console.log(`DATABASE_URL: ${parsed.protocol}://${parsed.host}:${parsed.port}/${parsed.database}`);
      if (parsed.port !== "(default)") {
        const reachable = await testPort(parsed.host, parsed.port);
        console.log(`فحص المنفذ ${parsed.host}:${parsed.port}: ${reachable ? "متاح" : "غير متاح"}`);

        const isSupabaseDirectHost = parsed.host.endsWith(".supabase.co") && parsed.host.startsWith("db.");
        if (isSupabaseDirectHost && !reachable) {
          console.log("");
          console.log("ملاحظة Supabase:");
          console.log("- يبدو أن رابط قاعدة البيانات المباشر على المضيف db.<project-ref>.supabase.co غير متاح من هذه البيئة.");
          console.log("- استخدم رابط Transaction Pooler من لوحة Supabase إن توفر، وغالبًا يكون على منفذ 6543.");
          console.log("- مثال تقريبي:");
          console.log(
            '  postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require&schema=public',
          );
        }
      }
    }
  }

  console.log(`NEXTAUTH_URL: ${nextAuthUrl || "غير مضبوط"}`);
  console.log(`NEXTAUTH_SECRET: ${nextAuthSecret ? "موجود" : "غير مضبوط"}`);
  console.log("");
  console.log("التوصية التالية:");

  if (!databaseUrl) {
    console.log("- اضبط DATABASE_URL أولًا ثم شغّل migrate و seed.");
    return;
  }

  console.log("- نفذ: npx prisma migrate deploy");
  console.log("- ثم: npm run prisma:seed");
  console.log("- ثم: npm run dev");
}

main();
