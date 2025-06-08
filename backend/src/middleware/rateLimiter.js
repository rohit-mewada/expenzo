import ratelimit from "../config/upstash.js";

/**
 * Rate limiter middleware using Upstash.
 */
const ratelimiter = async (req, res, next) => {
    try {
        // TODO: Use a real identifier (e.g., user IP or user ID)
        const { success } = await ratelimit.limit("identifier");
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        next();
    } catch (error) {
        console.error("Rate limit error", error);
        next(error);
    }
};

export default ratelimiter;