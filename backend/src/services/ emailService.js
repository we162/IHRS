const SibApiV3Sdk = require("sib-api-v3-sdk");

/* ─── Club constants ─────────────────────────────────────────── */
const CLUB_NAME = "IHRS — Indian Horse Riding School";
const CLUB_ADDRESS = "Dundigal, Domara Pocham Pally, Telangana 500043, India";
const CLUB_MAPS_URL = "https://maps.app.goo.gl/BoDFFJCEHtrzKvcb7";
const CLUB_PHONE = "+91 7416245607";
const CLUB_EMAIL = "ihrsdundigal@gmail.com";
const CLUB_WEBSITE = "https://ihrs.club";
const SLOT_DURATION = 30; // minutes

/* ─── Helpers ────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/* ─── Main function ──────────────────────────────────────────── */
const sendBookingEmail = async (email, booking) => {
  if (!process.env.BREVO_API_KEY) {
    console.log("⚠️  BREVO_API_KEY not configured — skipping email notification");
    return;
  }

  /* SDK auth setup */
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "no-reply@ihrs.club";
  const senderName = process.env.BREVO_SENDER_NAME || CLUB_NAME;

  /* ── Email payload ── */
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { name: senderName, email: senderEmail };
  sendSmtpEmail.to = [{ email, name: booking.name }];
  sendSmtpEmail.subject = `✅ Booking Confirmed — ${formatDate(booking.date)} at ${booking.start_time}`;
  sendSmtpEmail.htmlContent = buildEmailHTML(booking);

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Confirmation email sent to ${email} | MessageId: ${result?.messageId}`);
  } catch (err) {
    console.error("❌ Brevo email error:", err?.response?.body || err?.message || err);
    throw err;
  }
};

/* ─── HTML Builder ───────────────────────────────────────────── */
const buildEmailHTML = (booking) => {
  const year = new Date().getFullYear();
  const displayDate = formatDate(booking.date);
  const rideType = booking.ride_type || "Arena Training";
  const expLevel = booking.experience_level || "Beginner";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation — IHRS</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;background:#141414;box-shadow:0 24px 80px rgba(0,0,0,0.6);">

          <!-- ══ HEADER BANNER ══ -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0a00 0%,#2d1200 40%,#1a0a00 100%);padding:0;position:relative;">
              <!-- Gold top bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:4px;background:linear-gradient(90deg,#c8922a,#f0c040,#c8922a);"></td></tr>
              </table>
              <!-- Logo + heading area -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 32px 32px;">
                    <!-- SVG Horse Logo -->
                    <div style="margin-bottom:20px;">
                      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="36" cy="36" r="36" fill="#c8922a" fill-opacity="0.15"/>
                        <circle cx="36" cy="36" r="34" stroke="#c8922a" stroke-width="1.5" fill="none"/>
                        <!-- Horse silhouette -->
                        <text x="36" y="50" text-anchor="middle" font-size="36" fill="#f0c040">🐎</text>
                      </svg>
                    </div>
                    <!-- Club name -->
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c8922a;font-weight:600;">Indian Horse Riding School</p>
                    <h1 style="margin:8px 0 0;font-size:32px;font-weight:800;color:#f0f0f0;letter-spacing:-0.5px;line-height:1.2;">Booking Confirmed</h1>
                    <p style="margin:12px 0 0;font-size:15px;color:#a0a0a0;">Your adventure is locked in and ready to go!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ GREEN CONFIRMATION STRIP ══ -->
          <tr>
            <td style="background:linear-gradient(90deg,#0a2e18,#0f4023,#0a2e18);padding:16px 32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="background:#1a7a3a;border-radius:30px;padding:10px 28px;">
                    <span style="color:#6effa4;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">✓ &nbsp; Reservation Secured</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ GREETING ══ -->
          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#f0f0f0;">Hello, ${escapeHtml(booking.name)}! 👋</p>
              <p style="margin:8px 0 0;font-size:14px;color:#888;line-height:1.7;">
                Thank you for choosing IHRS. Below are your complete booking details. Please save this email for your records.
              </p>
            </td>
          </tr>

          <!-- ══ BOOKING DETAILS CARD ══ -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#1e1e1e;border-radius:12px;border:1px solid #2e2e2e;overflow:hidden;">
                <!-- Card header -->
                <tr>
                  <td style="padding:16px 24px;background:#252525;border-bottom:1px solid #2e2e2e;">
                    <span style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c8922a;font-weight:700;">📋 &nbsp; Booking Details</span>
                  </td>
                </tr>
                <!-- Rows -->
                ${detailRow("📅", "Date", displayDate)}
                ${detailRow("⏰", "Time Slot", `${booking.start_time}&nbsp;<span style='font-size:11px;color:#888;background:#2a2a2a;padding:2px 8px;border-radius:10px;'>${SLOT_DURATION} min session</span>`)}
                ${detailRow("🪑", "Seats Booked", `${booking.slots} ${Number(booking.slots) > 1 ? "riders" : "rider"}`)}
                ${detailRow("🏇", "Ride Type", rideType)}
                ${detailRow("🎯", "Experience Level", expLevel)}
                ${detailRow("📞", "Contact Number", escapeHtml(String(booking.phone)))}
                ${detailRow("✅", "Booking Status", '<span style="background:#1a7a3a;color:#6effa4;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;">CONFIRMED</span>')}
              </table>
            </td>
          </tr>

          <!-- ══ ARRIVAL NOTICE ══ -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:linear-gradient(135deg,#1a1000,#2a1a00);border-radius:10px;border:1px solid #3a2800;">
                <tr>
                  <td style="width:4px;background:linear-gradient(180deg,#f0c040,#c8922a);border-radius:4px 0 0 4px;"></td>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#f0c040;">⏱️ &nbsp; Important Reminder</p>
                    <p style="margin:0;font-size:13px;color:#c0a060;line-height:1.6;">
                      Please arrive <strong style="color:#f0c040;">15 minutes before</strong> your session for registration, gear fitting, and your safety briefing. Late arrivals may result in a shortened ride.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ LOCATION CARD ══ -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#1a1a1a;border-radius:12px;border:1px solid #2e2e2e;overflow:hidden;">
                <tr>
                  <td style="padding:16px 24px;background:#252525;border-bottom:1px solid #2e2e2e;">
                    <span style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c8922a;font-weight:700;">📍 &nbsp; Club Location</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <!-- Map PIN icon area -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:16px;">
                          <div style="width:44px;height:44px;background:#2a1800;border-radius:50%;text-align:center;line-height:44px;font-size:20px;border:1px solid #3a2800;">📍</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#f0f0f0;">Indian Horse Riding School</p>
                          <p style="margin:0 0 12px;font-size:13px;color:#888;line-height:1.5;">${CLUB_ADDRESS}</p>
                          <a href="${CLUB_MAPS_URL}" target="_blank"
                             style="display:inline-block;background:linear-gradient(135deg,#c8922a,#f0c040);color:#0d0d0d;text-decoration:none;font-size:12px;font-weight:800;padding:9px 20px;border-radius:8px;letter-spacing:0.5px;">
                            🗺️ &nbsp; Open in Google Maps
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ WHAT TO BRING ══ -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#1a1a1a;border-radius:12px;border:1px solid #2e2e2e;overflow:hidden;">
                <tr>
                  <td style="padding:16px 24px;background:#252525;border-bottom:1px solid #2e2e2e;">
                    <span style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c8922a;font-weight:700;">🎽 &nbsp; What to Bring</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" style="vertical-align:top;padding-bottom:8px;">
                          <span style="color:#888;font-size:13px;">✔ &nbsp; <span style="color:#c0c0c0;">Comfortable trousers / jeans</span></span>
                        </td>
                        <td width="50%" style="vertical-align:top;padding-bottom:8px;">
                          <span style="color:#888;font-size:13px;">✔ &nbsp; <span style="color:#c0c0c0;">Closed-toe shoes / boots</span></span>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="vertical-align:top;padding-bottom:8px;">
                          <span style="color:#888;font-size:13px;">✔ &nbsp; <span style="color:#c0c0c0;">Government ID (original)</span></span>
                        </td>
                        <td width="50%" style="vertical-align:top;padding-bottom:8px;">
                          <span style="color:#888;font-size:13px;">✔ &nbsp; <span style="color:#c0c0c0;">Water bottle &amp; sunscreen</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ DIVIDER ══ -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #2a2a2a;margin:0;" />
            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background:#0f0f0f;padding:32px 40px;text-align:center;">
              <!-- Logo text -->
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#c8922a;font-weight:600;">IHRS</p>
              <p style="margin:0 0 16px;font-size:13px;color:#555;">Indian Horse Riding School</p>
              <!-- Contact line -->
              <p style="margin:0 0 8px;font-size:12px;color:#555;">
                📞 &nbsp;<a href="tel:${CLUB_PHONE.replace(/\s/g, '')}" style="color:#888;text-decoration:none;">${CLUB_PHONE}</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                ✉️ &nbsp;<a href="mailto:${CLUB_EMAIL}" style="color:#888;text-decoration:none;">${CLUB_EMAIL}</a>
              </p>
              <p style="margin:0 0 16px;font-size:12px;color:#555;">
                🌐 &nbsp;<a href="${CLUB_WEBSITE}" style="color:#888;text-decoration:none;">${CLUB_WEBSITE}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#3a3a3a;line-height:1.7;">
                © ${year} Indian Horse Riding School. All rights reserved.<br/>
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- Gold bottom bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#c8922a,#f0c040,#c8922a);"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};

/* ─── Helpers ── */
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const detailRow = (icon, label, value) => `
  <tr>
    <td style="padding:14px 24px;border-bottom:1px solid #252525;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:50%;vertical-align:middle;">
            <span style="font-size:13px;color:#666;">${icon} &nbsp; ${label}</span>
          </td>
          <td style="width:50%;text-align:right;vertical-align:middle;">
            <span style="font-size:14px;font-weight:600;color:#e0e0e0;">${value}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

module.exports = sendBookingEmail;