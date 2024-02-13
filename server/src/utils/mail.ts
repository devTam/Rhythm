import nodemailer from "nodemailer"
import path from "path"
import { APP_EMAIL, MAILTRAP_PASS, MAILTRAP_USER } from "./variables"
import EmailVerificationToken from "@/models/emailVerificationToken"
import { generateTemplate } from "@/mail/template"

interface IProfile {
  email: string
  name: string
  userId: string
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

export const sendVerificationEmail = async (token: string, profile: IProfile) => {
  const transport = generateMailTransporter()

  const { email, userId } = profile

  await EmailVerificationToken.create({
    owner: userId,
    token,
  })

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
