import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAgentWelcomeEmail(
  email,
  firstName,
  tempPassword
) {
  const mailOptions = {
    from: `"VEDA Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to VEDA",

    html: `
      <h2>Hello ${firstName},</h2>

      <p>Your VEDA Agent account has been created successfully.</p>

      <p><b>Email:</b> ${email}</p>

      <p><b>Temporary Password:</b> ${tempPassword}</p>

      <p>
        Login:
        <a href="http://localhost:3000/agent/login">
          VEDA Login
        </a>
      </p>

      <p>Please change your password after first login.</p>

      <br/>

      <p>Regards,<br/>VEDA Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  console.log("Email Sent Successfully");
}

export async function sendForgotPasswordOTP(
  email,
  firstName,
  otp
) {

  const mailOptions = {

    from: `"VEDA Team" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "VEDA Password Reset OTP",

    html: `
      <div style="font-family:Arial;padding:20px">

        <h2>Hello ${firstName},</h2>

        <p>
          We received a request to reset your VEDA Agent account password.
        </p>

        <p>Your OTP is:</p>

        <h1 style="
            color:#0f6b38;
            letter-spacing:6px;
            font-size:40px;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for
          <b>10 Minutes</b>.
        </p>

        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>

        <br/>

        <p>

        Regards,<br/>

        <b>VEDA Team</b>

        </p>

      </div>
    `,

  };

  await transporter.sendMail(mailOptions);

  console.log("OTP Email Sent Successfully");

}

export async function sendVendorWelcomeEmail(
  email,
  firstName,
  tempPassword
) {
  const mailOptions = {
    from: `"VEDA Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to VEDA Vendor Portal",

    html: `
      <h2>Hello ${firstName},</h2>

      <p>Your <b>VEDA Vendor</b> account has been created successfully.</p>

      <p><b>Email:</b> ${email}</p>

      <p><b>Temporary Password:</b> ${tempPassword}</p>

      <p>
        Login:
        <a href="http://localhost:3000/vendor/login">
          Vendor Login
        </a>
      </p>

      <p>
        Please change your password after your first login.
      </p>

      <br/>

      <p>
        Regards,<br/>
        <b>VEDA Team</b>
      </p>
    `,
  };

  console.log("Sending email to:", email);
  await transporter.sendMail(mailOptions);
  console.log(info);

  console.log("Vendor Welcome Email Sent Successfully");
}