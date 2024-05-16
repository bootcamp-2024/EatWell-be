import dotenv from "dotenv";
dotenv.config();

const config = {
  DATABASE: {
    URI: process.env.MONGODB_URI,
  },
  FAST_API_URL: process.env.FAST_API_URL,
  GENDER: {
    MALE: "male",
    FEMALE: "female",
  },

  JWT_EXP_TIME: 60 * 60,
  JWT_SECRET: process.env.JWT_SECRET,
  NUMBER_BYTE_VERIFY_TOKEN: 256 / 8,
  NUMBER_BYTE_SALT: 16 / 8,

  PORT: process.env.PORT || 3001,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME,

  HASH_DIGIT: 12,

  COULDINARY_CONFIG: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  AVATAR_IMAGE_NUMBER_LIMIT: 1,
  CLOUDINARY_AVATAR_PATH: "eatwell/avatar/",
};

export default config;
