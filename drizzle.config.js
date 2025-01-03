/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",  // Make sure this path is correct
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://neondb_owner:e95RCoGYnrSA@ep-restless-cake-a1b5ur35.ap-southeast-1.aws.neon.tech/ai-mock-interview?sslmode=require",
    }
  };
  