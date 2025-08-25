"use client";

import React, { ReactNode } from "react";

// ✅ Import i18n once here so it's initialized globally
import "./i18n/i18n";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return <>{children}</>; // just pass children, i18n is already active
}
