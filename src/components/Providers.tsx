"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppDialogProvider } from "@/components/dialogs/AppDialogProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDialogProvider>{children}</AppDialogProvider>
    </QueryClientProvider>
  );
}
