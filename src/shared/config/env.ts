// env.ts
import "dotenv/config";

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error('Misssing environment variable: ${key}');
    return value;
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),
    
  // später aktivieren, wenn wir DB anschließen:
  // mongoUri: requireEnv("MONGO_URI"),

  // später für JWT:
  // accessTokenSecret: requireEnv("ACCESS_TOKEN_SECRET"),
  // refreshTokenSecret: requireEnv("REFRESH_TOKEN_SECRET"),

} as const;