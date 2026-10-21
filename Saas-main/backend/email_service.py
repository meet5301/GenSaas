import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
from sqlalchemy.orm import Session
import models

def send_store_approval_email(to_email: str, store_name: str, store_slug: str, store_id: int = None, db: Session = None) -> bool:
    """
    Sends store approval notification email to the store owner.
    Falls back to DB EmailLog logging and stdout if SMTP credentials are missing/unreachable.
    """
    subject = f"🎉 Mubarak ho! Aapka Store '{store_name}' Approve Ho Gaya Hai!"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }}
        .header {{ background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; color: #38bdf8; }}
        .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; }}
        .badge {{ display: inline-block; background-color: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 15px; }}
        .store-card {{ background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }}
        .btn {{ display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; text-align: center; }}
        .footer {{ background-color: #f1f5f9; padding: 15px 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GenSaas Admin Team</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Store Activation Confirmation</p>
        </div>
        <div class="content">
          <div class="badge">✓ Approved & Created</div>
          <h2>Aapka Store Create Ho Gaya Hai!</h2>
          <p>Namaste,</p>
          <p>Humare Admin ne aapke store ki request ko review karke <strong>Approve</strong> kar diya hai. Aapka store ab fully active aur live hai!</p>
          
          <div class="store-card">
            <h3 style="margin: 0 0 8px 0; color: #0f172a;">{store_name}</h3>
            <p style="margin: 0; font-size: 14px; color: #64748b;">URL Slug: <code>{store_slug}</code></p>
          </div>

          <p>Aap ab apne dashboard par login karke products, inventory, billing aur sales manage kar sakte hain.</p>

          <div style="text-align: center;">
            <a href="#" class="btn">Apne Store Par Jayein</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 GenSaas Platform. Yeh message aapki store registration approval verification ke liye bheja gaya hai.</p>
        </div>
      </div>
    </body>
    </html>
    """

    smtp_host = os.getenv("SMTP_HOST") or os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "noreply@gensaas.com")

    sent_status = "simulated"

    if smtp_host and smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = smtp_from
            msg["To"] = to_email
            msg.attach(MIMEText(html_body, "html"))

            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, [to_email], msg.as_string())
            server.quit()
            sent_status = "sent"
            print(f"[EMAIL SERVICE] Successfully sent store approval email to {to_email}")
        except Exception as e:
            print(f"[EMAIL SERVICE WARNING] Failed to send via SMTP: {e}. Falling back to simulation log.")
            sent_status = "failed"
    else:
        print(f"[EMAIL SERVICE INFO] SMTP not configured. Logged store approval email for {to_email}: '{subject}'")

    # Record email log in DB if session provided
    if db:
        try:
            log_entry = models.EmailLog(
                to_email=to_email or "unknown@email.com",
                subject=subject,
                body=f"Store '{store_name}' (slug: {store_slug}) approval notification email.",
                status=sent_status,
                store_id=store_id,
                sent_at=datetime.datetime.utcnow()
            )
            db.add(log_entry)
            db.commit()
        except Exception as err:
            print(f"[EMAIL SERVICE DB LOG ERROR] {err}")

    return True
