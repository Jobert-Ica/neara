"use client";

import { Toaster } from "sonner";
import { NotificationProvider } from "./NotificationProvider";

export function AppProviders({
  children,
  userId,
  initialNotifications = [],
}: {
  children: React.ReactNode;
  userId?: string | null;
  initialNotifications?: any[];
}) {
  return (
    <>
      <Toaster position="top-right" theme="dark" />
      {userId ? (
        <NotificationProvider userId={userId} initialNotifications={initialNotifications}>
          {children}
        </NotificationProvider>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
