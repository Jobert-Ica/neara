import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  role: "CLIENT" | "PROFESSIONAL";
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Welcome to NEARA!",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #fff; font-size: 32px; font-weight: 800; letter-spacing: -1px;">NEARA</h1>
          <p style="color: #93C5FD; font-size: 14px;">Professional Marketplace</p>
        </div>
        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #fff; font-size: 24px; margin-bottom: 12px;">Welcome, ${params.name}! 👋</h2>
          <p style="color: #CBD5E1; line-height: 1.6;">
            ${params.role === "CLIENT"
              ? "You're now connected to a network of verified professionals ready to help bring your project to life."
              : "Your account has been created. Complete your profile to get verified and start receiving project opportunities."}
          </p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; background: #2563EB; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Get Started →
        </a>
        <p style="color: #64748B; font-size: 12px; margin-top: 32px; text-align: center;">
          © ${new Date().getFullYear()} NEARA. All rights reserved.
        </p>
      </div>
    `,
  });
}

export async function sendVerificationApprovedEmail(params: {
  to: string;
  name: string;
  profession: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "🎉 Your NEARA Profile is Verified!",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 64px; height: 64px; background: #10B981; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">✓</div>
          <h1 style="color: #fff; font-size: 28px; font-weight: 800;">Profile Approved!</h1>
        </div>
        <p style="color: #CBD5E1; line-height: 1.6;">
          Congratulations, ${params.name}! Your ${params.profession} profile has been verified on NEARA. You are now visible to clients and can start receiving project requests.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; background: #10B981; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
          View Your Profile →
        </a>
      </div>
    `,
  });
}

export async function sendVerificationRejectedEmail(params: {
  to: string;
  name: string;
  reason: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "NEARA — Profile Verification Update",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <h2 style="color: #F87171;">Verification Not Approved</h2>
        <p style="color: #CBD5E1; line-height: 1.6;">Hi ${params.name}, your NEARA profile verification was not approved for the following reason:</p>
        <div style="background: rgba(248,113,113,0.1); border: 1px solid #F87171; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #FCA5A5; margin: 0;">${params.reason}</p>
        </div>
        <p style="color: #CBD5E1;">Please update your documents and resubmit for review.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings"
           style="display: inline-block; background: #2563EB; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Update Profile →
        </a>
      </div>
    `,
  });
}

export async function sendRequestReceivedEmail(params: {
  to: string;
  professionalName: string;
  clientName: string;
  projectTitle: string;
  budgetRange: string;
  location: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `New Project Request: ${params.projectTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <h2 style="color: #60A5FA;">New Request Received</h2>
        <p style="color: #CBD5E1;">Hi ${params.professionalName}, you have a new project request!</p>
        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin: 16px 0;">
          <h3 style="color: #fff; margin-top: 0;">${params.projectTitle}</h3>
          <p style="color: #94A3B8; margin: 4px 0;"><strong style="color: #CBD5E1;">Client:</strong> ${params.clientName}</p>
          <p style="color: #94A3B8; margin: 4px 0;"><strong style="color: #CBD5E1;">Budget:</strong> ${params.budgetRange}</p>
          <p style="color: #94A3B8; margin: 4px 0;"><strong style="color: #CBD5E1;">Location:</strong> ${params.location}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/requests"
           style="display: inline-block; background: #2563EB; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Review Request →
        </a>
      </div>
    `,
  });
}

export async function sendRequestAcceptedEmail(params: {
  to: string;
  clientName: string;
  professionalName: string;
  profession: string;
  projectTitle: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `${params.professionalName} accepted your request!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <h2 style="color: #34D399;">Request Accepted! 🎉</h2>
        <p style="color: #CBD5E1;">
          Great news, ${params.clientName}! <strong>${params.professionalName}</strong> (${params.profession}) has accepted your request for <em>${params.projectTitle}</em>.
        </p>
        <p style="color: #CBD5E1;">You can now chat directly with them to discuss your project.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages"
           style="display: inline-block; background: #10B981; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Open Chat →
        </a>
      </div>
    `,
  });
}

export async function sendPaymentReceiptEmail(params: {
  to: string;
  name: string;
  amount: number;
  credits: number;
  packageName: string;
  txId: string;
  date: Date;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Payment Receipt — ${params.credits} Credits`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1B3D; color: #fff; border-radius: 12px;">
        <h2 style="color: #60A5FA;">Payment Confirmed</h2>
        <p style="color: #CBD5E1;">Hi ${params.name}, your payment has been processed successfully.</p>
        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94A3B8;">Package</span>
            <span style="color: #fff;">${params.packageName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94A3B8;">Credits Added</span>
            <span style="color: #34D399; font-weight: 700;">+${params.credits}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #94A3B8;">Amount Paid</span>
            <span style="color: #fff;">₱${params.amount.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
            <span style="color: #94A3B8;">Transaction ID</span>
            <span style="color: #CBD5E1; font-size: 12px;">${params.txId}</span>
          </div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/transactions"
           style="display: inline-block; background: #2563EB; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Transactions →
        </a>
      </div>
    `,
  });
}
