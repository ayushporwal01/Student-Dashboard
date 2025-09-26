import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PrivacyPolicyModal({ open, onOpenChange }) {
  const privacyPolicyContent = [
    {
      type: "title",
      content: "Privacy Policy"
    },
    {
      type: "date",
      content: `Last Updated: ${new Date().toLocaleDateString()}`
    },
    {
      type: "paragraph",
      content: "Welcome to TrackMate. This Privacy Policy explains how we collect, use, and protect your personal information when you use our attendance application. By using the app, you agree to the terms of this policy."
    },
    {
      type: "section",
      content: "1. Information We Collect"
    },
    {
      type: "paragraph",
      content: "We may collect the following information when you use our app:"
    },
    {
      type: "list",
      content: [
        "Personal Details: Name, email, student/employee ID, department/class.",
        "Attendance Records: Check-in/check-out times, presence/absence status.",
        "Login Information: Username and encrypted password (if applicable).",
        "Location Data: Only if location/GPS is required for attendance.",
        "Device Information: Basic details such as browser type, operating system (for troubleshooting)."
      ]
    },
    {
      type: "section",
      content: "2. How We Use Your Information"
    },
    {
      type: "paragraph",
      content: "Your data is used to:"
    },
    {
      type: "list",
      content: [
        "Record and manage attendance.",
        "Generate reports for students, employees, or administrators.",
        "Verify identity and prevent misuse.",
        "Improve app performance and user experience."
      ]
    },
    {
      type: "section",
      content: "3. Data Sharing"
    },
    {
      type: "paragraph",
      content: "We do not sell or trade your personal information to third parties."
    },
    {
      type: "paragraph",
      content: "Data is only shared with authorized institution administrators (if required)."
    },
    {
      type: "section",
      content: "4. Data Security"
    },
    {
      type: "paragraph",
      content: "We take reasonable measures to protect your personal data, including encryption and restricted access. However, please note that no system is 100% secure."
    },
    {
      type: "section",
      content: "5. Data Retention"
    },
    {
      type: "paragraph",
      content: "Attendance data will be stored only as long as necessary (e.g., for the duration of the academic year or employment) unless required by the institution."
    },
    {
      type: "section",
      content: "6. User Rights"
    },
    {
      type: "paragraph",
      content: "You have the right to:"
    },
    {
      type: "list",
      content: [
        "Access your personal data.",
        "Request correction or updates.",
        "Request deletion of your data (subject to institutional policies)."
      ]
    },
    {
      type: "section",
      content: "7. Cookies & Tracking"
    },
    {
      type: "paragraph",
      content: "If you use the web version of our app, we may use cookies to maintain login sessions. These cookies do not collect unnecessary personal information."
    },
    {
      type: "section",
      content: "8. Changes to This Policy"
    },
    {
      type: "paragraph",
      content: "We may update this Privacy Policy from time to time. Any changes will be posted here with the updated date."
    },
    {
      type: "section",
      content: "9. Contact Us"
    },
    {
      type: "paragraph",
      content: "If you have any questions about this Privacy Policy or how we handle your data, please contact us at:"
    },
    {
      type: "contact",
      content: "📧 support@trackmate.com"
    }
  ];

  const renderContent = () => {
    return privacyPolicyContent.map((item, index) => {
      switch (item.type) {
        case "title":
          return (
            <h1 key={index} className="text-2xl font-bold text-foreground mb-2">
              {item.content}
            </h1>
          );
        case "date":
          return (
            <p key={index} className="text-sm text-muted-foreground mb-4">
              {item.content}
            </p>
          );
        case "section":
          return (
            <h2 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
              {item.content}
            </h2>
          );
        case "paragraph":
          return (
            <p key={index} className="text-sm text-foreground mb-3">
              {item.content}
            </p>
          );
        case "list":
          return (
            <ul key={index} className="list-disc list-inside mb-4 space-y-2 pt-1 pb-2">
              {item.content.map((listItem, listIndex) => (
                <li key={listIndex} className="text-sm text-foreground ml-4">
                  {listItem}
                </li>
              ))}
            </ul>
          );
        case "contact":
          return (
            <p key={index} className="text-sm font-medium text-foreground mt-2">
              {item.content}
            </p>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-1 py-2">
            {renderContent()}
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}