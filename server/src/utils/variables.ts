const { env } = process as { env: { [key: string]: string } }

export const {
  MONGO_URI,
  PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  APP_EMAIL,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
} = env
