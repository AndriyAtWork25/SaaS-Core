// server.ts
import { app } from "./app"; 
import { env } from "./shared/config/env"; 
import { connectDb } from "./shared/config/db"; 

async function bootstrap() {
  await connectDb();

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}


bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
