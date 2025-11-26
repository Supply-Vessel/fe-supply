import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function sendResetConfirmationCode(email: string, code: string) {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your Reset Confirmation Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/favicon.ico" alt="Ship Hub Logo" width="120" />
                </div>
                <h2 style="text-align: center; color: #2d3748;">Welcome back to Ship Hub</h2>
                <p style="text-align: center;">Your 6-digit reset confirmation code is:</p>
                <p style="font-size: 28px; font-weight: bold; text-align: center; color: #4a90e2;">
                    ${code}
                </p>
                <p style="text-align: center; font-size: 14px; color: #888;">This code will expire in 24 hours.</p>
            </div>
        `,
    });
}

