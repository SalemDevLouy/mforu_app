"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

type DialogKind = "alert" | "confirm";

interface DialogOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

interface DialogRequest extends DialogOptions {
  id: number;
  kind: DialogKind;
  message: string;
  resolve?: (value: boolean) => void;
}

interface AppDialogContextValue {
  showAlert: (message: unknown, options?: DialogOptions) => void;
  showConfirm: (message: unknown, options?: DialogOptions) => Promise<boolean>;
}

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

const DEFAULT_ALERT_TITLE = "تنبيه";
const DEFAULT_CONFIRM_TITLE = "تأكيد";

function toDialogMessage(message: unknown): string {
  if (message instanceof Error) return message.message;
  if (typeof message === "string") return message;
  if (message == null) return "";

  try {
    return JSON.stringify(message, null, 2);
  } catch {
    return "حدث تنبيه جديد.";
  }
}

export function AppDialogProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const nextIdRef = useRef(1);
  const originalAlertRef = useRef<typeof globalThis.alert | null>(null);

  const enqueue = useCallback(
    (request: Omit<DialogRequest, "id">) => {
      setQueue((current) => [
        ...current,
        {
          ...request,
          id: nextIdRef.current++,
        },
      ]);
    },
    []
  );

  const showAlert = useCallback(
    (message: unknown, options?: DialogOptions) => {
      enqueue({
        kind: "alert",
        message: toDialogMessage(message),
        title: options?.title ?? DEFAULT_ALERT_TITLE,
        confirmText: options?.confirmText ?? "حسناً",
      });
    },
    [enqueue]
  );

  const showConfirm = useCallback(
    (message: unknown, options?: DialogOptions) =>
      new Promise<boolean>((resolve) => {
        enqueue({
          kind: "confirm",
          message: toDialogMessage(message),
          title: options?.title ?? DEFAULT_CONFIRM_TITLE,
          confirmText: options?.confirmText ?? "تأكيد",
          cancelText: options?.cancelText ?? "إلغاء",
          resolve,
        });
      }),
    [enqueue]
  );

  const closeCurrentDialog = useCallback((confirmed: boolean) => {
    setQueue((current) => {
      if (current.length === 0) return current;

      const [activeDialog, ...remainingDialogs] = current;
      activeDialog.resolve?.(confirmed);
      return remainingDialogs;
    });
  }, []);

  useLayoutEffect(() => {
    originalAlertRef.current = globalThis.alert;
    globalThis.alert = (message?: unknown) => {
      showAlert(message);
    };

    return () => {
      if (originalAlertRef.current) {
        globalThis.alert = originalAlertRef.current;
      }
    };
  }, [showAlert]);

  const currentDialog = queue[0] ?? null;

  const contextValue = useMemo<AppDialogContextValue>(
    () => ({ showAlert, showConfirm }),
    [showAlert, showConfirm]
  );

  return (
    <AppDialogContext.Provider value={contextValue}>
      {children}

      <Modal
        isOpen={!!currentDialog}
        onOpenChange={(open) => {
          if (!open && currentDialog) {
            closeCurrentDialog(false);
          }
        }}
        placement="center"
        hideCloseButton={currentDialog?.kind === "alert"}
        isDismissable={currentDialog?.kind === "confirm"}
        classNames={{
          base: "mx-4",
          backdrop: "bg-slate-900/45 backdrop-blur-[2px]",
          body: "pt-1 pb-2",
          footer: "pt-2",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-start gap-3 border-b border-default-100 pb-4">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl",
                currentDialog?.kind === "confirm"
                  ? "bg-warning-100 text-warning-700"
                  : "bg-primary/10 text-primary",
              ].join(" ")}
            >
              {currentDialog?.kind === "confirm" ? "؟" : "!"}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-default-900">
                {currentDialog?.title}
              </h2>
              <p className="text-sm text-default-500">
                {currentDialog?.kind === "confirm"
                  ? "يرجى تأكيد الإجراء قبل المتابعة."
                  : "معلومة مهمة تحتاج انتباهك."}
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            <p className="whitespace-pre-line text-sm leading-7 text-default-700">
              {currentDialog?.message}
            </p>
          </ModalBody>

          <ModalFooter className="gap-2 border-t border-default-100">
            {currentDialog?.kind === "confirm" && (
              <Button variant="flat" onPress={() => closeCurrentDialog(false)}>
                {currentDialog.cancelText ?? "إلغاء"}
              </Button>
            )}

            <Button
              color="primary"
              onPress={() => closeCurrentDialog(true)}
            >
              {currentDialog?.confirmText ?? "حسناً"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AppDialogContext.Provider>
  );
}

export function useAppDialog() {
  const context = useContext(AppDialogContext);

  if (!context) {
    throw new Error("useAppDialog must be used within AppDialogProvider");
  }

  return context;
}