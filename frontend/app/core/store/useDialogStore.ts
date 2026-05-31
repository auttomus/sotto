import * as React from "react";
import { create } from "zustand";

export type DialogVariant = "primary" | "destructive" | "success";
export type DialogType = "confirm" | "alert";

export interface DialogOptions {
  title: React.ReactNode;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

interface DialogState {
  isOpen: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  type: DialogType;
  confirmText: string;
  cancelText: string;
  variant: DialogVariant;
  maxWidth: "sm" | "md" | "lg" | "xl";
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, "cancelText">) => Promise<void>;
  onConfirm: () => void;
  onCancel: () => void;
}

// Keep the resolver callback reference outside the react lifecycle but accessible to get/set
let currentResolver: ((value: boolean) => void) | null = null;

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  type: "confirm",
  confirmText: "Konfirmasi",
  cancelText: "Batal",
  variant: "primary",
  maxWidth: "sm",

  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      currentResolver = resolve;
      set({
        isOpen: true,
        type: "confirm",
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || "Konfirmasi",
        cancelText: options.cancelText || "Batal",
        variant: options.variant || "primary",
        maxWidth: options.maxWidth || "sm",
      });
    });
  },

  alert: (options) => {
    return new Promise<void>((resolve) => {
      currentResolver = () => resolve();
      set({
        isOpen: true,
        type: "alert",
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || "OK",
        cancelText: "",
        variant: options.variant || "primary",
        maxWidth: options.maxWidth || "sm",
      });
    });
  },

  onConfirm: () => {
    if (currentResolver) {
      currentResolver(true);
      currentResolver = null;
    }
    set({ isOpen: false });
  },

  onCancel: () => {
    if (currentResolver) {
      currentResolver(false);
      currentResolver = null;
    }
    set({ isOpen: false });
  },
}));
