import nodemailer from "nodemailer"
import path from "path"
import { APP_EMAIL, MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL } from "./variables"
import { generateTemplate } from "@/mail/template"

interface IProfile {
  email: string
  name: string
  userId: string
}

interface IOptions {
  email: string
  link: string
}

const generateMailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  })
}

export const sendVerificationEmail = async (
  token: string,
  profile: IProfile
) => {
  const transport = generateMailTransporter()

  const { email } = profile

  const WELCOME_MESSAGE = `Welcome to Rhythm! Please verify your email address using the code below:`

  transport.sendMail({
    from: APP_EMAIL,
    to: email,
    subject: "Verify your email address",
    html: generateTemplate({
      title: "Welcome to Rhythm",
      message: WELCOME_MESSAGE,
      logo: "cid:logo",
      banner: "cid:banner",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "logo",
      },
      {
        filename: "banner.png",
        path: path.join(__dirname, "../assets/banner.png"),
        cid: "banner",
      },
    ],
  })
}

export const sendForgotPasswordLink = async (options: IOptions) => {
  const transport = generateMailTransporter()

  const { email, link } = options

  const MESSAGE = `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click the link below to reset your password.`

  transport.sendMail({
    from: APP_EMAIL,
    to: email,
    subject: "Reset Password",
    html: generateTemplate({
      title: "Forgot Password?",
      message: MESSAGE,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../assets/forget_password.png"),
        cid: "forget_password",
      },
    ],
  })
}

export const sendResetSuccessEmail = async (name: string, email: string) => {
  const transport = generateMailTransporter()

  const MESSAGE = `Dear ${name}, Your password has been successfully updated. If you did not make this change, please contact us immediately.`

  transport.sendMail({
    from: APP_EMAIL,
    to: email,
    subject: "Password Reset Success",
    html: generateTemplate({
      title: "Password Reset Success",
      message: MESSAGE,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Login Now",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../assets/forget_password.png"),
        cid: "forget_password",
      },
    ],
  })
}
