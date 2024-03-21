import { Resend } from "resend";

const resend = new Resend('re_WVgMm9nA_FvzVt2aFPQT4UL7HQ9uYisKB');

const sendEmail = async () => {
  await resend.emails.send({
    from: "Admin <admin@pap-miguel.online>",
    to: ["afonso.fresco@gmail.com"],
    subject: "hello world",
    text: "it works!",
  });
};
