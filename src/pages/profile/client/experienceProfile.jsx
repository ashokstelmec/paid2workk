"use client";

import { useState } from "react";
import {
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

export default function Experience() {
  const [settings, setSettings] = useState({
    tasklistPush: true,
    newsEmails: true,
    projectAwardEmails: true,
    milestoneRequestEmails: true,
    topBidderEmails: true,
    freemarketActivityEmails: true,
    contactRequestEmails: true,
    groupInviteEmails: true,
    tasklistInviteEmails: true,
    marketingEmails: true,
    dealsEmails: true,
    newsletterEmails: true,
    communityDigestEmails: true,
    referralProgramEmails: true,
    projectUpdateSMS: true,
    marketingSMS: true,
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <div className="space-y-4 p-4">
      <Section title="Push Notifications for Tasklists">
        <FormControlLabel
          control={<Switch size="small" checked={settings.tasklistPush} disabled />}
          label={
            <span className="text-black/50pl-2 text-sm">
              Tasklist push notifications
            </span>
          }
        />
      </Section>

      <Section title="Individual Emails">
        {[
          {
            key: "newsEmails",
            label: "News and announcements from Freelancer.com",
          },
          { key: "projectAwardEmails", label: "You are awarded a project" },
          {
            key: "milestoneRequestEmails",
            label: "A freelancer requests you to release a milestone payment",
          },
          {
            key: "topBidderEmails",
            label: "We notify you of the top bidder for your project",
          },
          {
            key: "freemarketActivityEmails",
            label: "We notify you of the latest activity regarding Freemarket",
          },
          {
            key: "contactRequestEmails",
            label: "A freelancer requests you as a contact",
          },
          {
            key: "groupInviteEmails",
            label: "When you are invited to a group",
          },
          {
            key: "tasklistInviteEmails",
            label: "When you are invited to a tasklist",
          },
        ].map((item) => (
          <FormControlLabel
            key={item.key}
            control={<Switch size="small" checked={settings[item.key]} disabled />}
            label={
              <span className="text-black/50pl-2 text-sm">
                {item.label}
              </span>
            }
          />
        ))}
      </Section>

      <Section title="Other Emails">
        {[
          { key: "marketingEmails", label: "Marketing emails" },
          { key: "dealsEmails", label: "Freelancer.com deals" },
          { key: "newsletterEmails", label: "Monthly newsletter" },
          { key: "communityDigestEmails", label: "Weekly Community Digest" },
          {
            key: "referralProgramEmails",
            label: "Referral Program Notifications",
          },
        ].map((item) => (
          <FormControlLabel
            key={item.key}
            control={<Switch size="small" checked={settings[item.key]} disabled />}
            label={
              <span className="text-black/50pl-2 text-sm">
                {item.label}
              </span>
            }
          />
        ))}
      </Section>

      <Section title="SMS Notifications">
        {[
          {
            key: "projectUpdateSMS",
            label: "SMS notifications for project updates",
          },
          {
            key: "marketingSMS",
            label: "SMS notifications for marketing and promotions",
          },
        ].map((item) => (
          <FormControlLabel
            key={item.key}
            control={<Switch size="small" checked={settings[item.key]} disabled />}
            label={
              <span className="text-black/50pl-2 text-sm">
                {item.label}
              </span>
            }
          />
        ))}
      </Section>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-1">
      <h6 className="text-black font-medium">{title}</h6>
      <div className="border-b border-gray-200 my-2" />
      <div className="flex flex-col gap-1 text-sm">
        {children}
      </div>
    </div>
  );
}
