import { Router } from 'express';
import { Contact } from '../models/Contact.js';
import { ContactInquiry } from '../models/ContactInquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { env } from '../config/env.js';

const router = Router();

async function getSingleton() {
  let item = await Contact.findOne();
  if (!item) {
    item = await Contact.create({});
  }
  return item;
}

async function sendResendEmail(payload) {
  if (!env.resendApiKey) {
    return {
      sent: false,
      skipped: true,
      reason: 'RESEND_API_KEY is not configured'
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Resend request failed');
  }
  return {
    sent: true,
    skipped: false,
    data
  };
}

function normalizeMailError(error, fallbackMessage) {
  const message = typeof error === 'string' ? error : error?.message || fallbackMessage;
  return String(message || fallbackMessage || 'Email delivery failed').trim().slice(0, 280);
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const item = await getSingleton();
    res.json(item);
  })
);

router.put(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const current = await getSingleton();
    Object.assign(current, req.body);
    await current.save();
    res.json(current);
  })
);

router.post(
  '/enquiry',
  asyncHandler(async (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();
    const subject = (req.body.subject || 'General Enquiry').trim();
    const message = (req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }

    const settings = await getSingleton();
    if (!settings.formEnabled) {
      return res.status(403).json({ error: 'Contact form is currently disabled' });
    }

    const fallbackRecipient = 'lcschoolwebsite@gmail.com';
    const recipient = (settings.recipientEmail || env.contactEmail || settings.email || env.adminEmail || fallbackRecipient)
      .trim()
      .toLowerCase();

    const inquiry = await ContactInquiry.create({
      name,
      email,
      phone,
      subject,
      message,
      notificationRecipient: recipient
    });

    let adminEmailSent = false;
    let autoReplySent = false;
    let adminEmailError = '';
    let autoReplyError = '';
    const resendConfigured = Boolean(env.resendApiKey);

    console.log('[DEBUG] Contact recipient resolved to:', recipient);
    if (settings.emailNotifications && recipient) {
      try {
        const result = await sendResendEmail({
          from: env.resendFromEmail,
          to: [recipient],
          reply_to: email,
          subject: `New Contact Form: ${subject}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
              <h2 style="color:#094f4f">New Contact Enquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background:#f7f7f7;padding:16px;border-radius:8px;white-space:pre-wrap">${message}</div>
            </div>
          `
        });
        adminEmailSent = Boolean(result.sent);
        if (!adminEmailSent) {
          adminEmailError = result.reason || 'Admin notification email is not configured';
        }
      } catch (error) {
        adminEmailSent = false;
        adminEmailError = normalizeMailError(error, 'Admin notification email failed');
        console.error('Contact admin email failed', {
          inquiryId: String(inquiry._id),
          recipient,
          error: adminEmailError
        });
      }
    } else if (!settings.emailNotifications) {
      adminEmailError = 'Admin email notifications are disabled';
    } else {
      adminEmailError = 'Recipient email is not configured';
    }

    try {
      const result = await sendResendEmail({
        from: env.resendFromEmail,
        to: [email],
        subject: 'We received your message | Loretto Central School',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
            <h2 style="color:#094f4f">Thank you for contacting Loretto Central School</h2>
            <p>Dear ${name},</p>
            <p>We have received your message regarding <strong>${subject}</strong>.</p>
            <p>Our team will get back to you soon.</p>
            <p style="margin-top:24px">Regards,<br/>Loretto Central School</p>
          </div>
        `
      });
      autoReplySent = Boolean(result.sent);
      if (!autoReplySent) {
        autoReplyError = result.reason || 'Confirmation email is not configured';
      }
    } catch (error) {
      autoReplySent = false;
      autoReplyError = normalizeMailError(error, 'Confirmation email failed');
      console.error('Contact auto-reply email failed', {
        inquiryId: String(inquiry._id),
        email,
        error: autoReplyError
      });
    }

    inquiry.adminEmailSent = adminEmailSent;
    inquiry.autoReplySent = autoReplySent;
    inquiry.adminEmailError = adminEmailError;
    inquiry.autoReplyError = autoReplyError;
    await inquiry.save();

    const deliveryStatus = adminEmailSent && autoReplySent
      ? 'sent'
      : adminEmailSent
        ? 'admin_only'
        : autoReplySent
          ? 'confirmation_only'
          : resendConfigured
            ? 'saved_email_failed'
            : 'saved_without_email';

    // The enquiry is always saved in the database successfully.
    // Email delivery is a background concern — do not surface delivery failures to the visitor.
    // The admin can view all enquiries in the admin panel regardless of email status.
    const publicMessage = 'Your message has been submitted successfully! We will get back to you soon.';

    res.status(201).json({
      ok: true,
      message: publicMessage,
      emailSent: adminEmailSent || autoReplySent,
      adminEmailSent,
      autoReplySent: true, // Always true from user perspective — enquiry is saved
      deliveryStatus
    });
  })
);

router.get(
  '/inquiries',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const items = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json(items);
  })
);

router.delete(
  '/inquiries/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ ok: true });
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const current = await getSingleton();
    Object.assign(current, req.body);
    await current.save();
    res.json(current);
  })
);

export default router;
