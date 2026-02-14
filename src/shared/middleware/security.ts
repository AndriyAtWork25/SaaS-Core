//security.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const helmetMiddleware = helmet();

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, //max 300 requests per IP per windowMs
    standardHeaders: "draft-7", //sends rate limit info in Headers
    legacyHeaders: false, 
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
})
