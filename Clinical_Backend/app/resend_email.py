import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_reset_email(to_email: str, reset_link: str):
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Password Reset",
        "html": f"""
        <h2>Reset Your Password</h2>
        <p>Click the button below to set a new password:</p>

        <a href="{reset_link}" 
        style="padding:10px 20px;
               background:#2563eb;
               color:white;
               text-decoration:none;
               border-radius:6px;">
               Reset Password
        </a>
        """
    })
