import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
          <h1>Your 2FA token</h1>
          <p>Use the following code to log in:</p>
          <h3>${token}</h3>
      `,
  });
};

export async function sendVerificationEmail(email: string, token: string) {
  const confirmationLink = `${process.env.WEBSITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Please verify your email",
    html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address</p>
        <a href="${confirmationLink}">Verify email</a>
        `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.WEBSITE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password</p>
            <a href="${resetLink}">Reset password</a>
        `,
  });
}
