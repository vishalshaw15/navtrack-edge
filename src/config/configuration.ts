export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  mongodbUri: process.env.MONGODB_URI || "",
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRATION || "1d",
  },
});
