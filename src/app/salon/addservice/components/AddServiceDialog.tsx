"use client";
import React from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Category, Employee, ClientData, TaskItem, ServiceFormData } from "../types";
import ClientInfoCard from "./ClientInfoCard";
import ServiceTasksCard from "./ServiceTasksCard";
import PaymentSummaryCard from "./PaymentSummaryCard";

interface AddServiceDialogProps {
  readonly onClose: () => void;
  readonly formData: ServiceFormData;
  readonly handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  readonly handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleSubmit: (e: React.FormEvent) => void;
  readonly clientData: ClientData | null;
  readonly searchingClient: boolean;
  readonly tasks: TaskItem[];
  readonly addTask: () => void;
  readonly removeTask: (id: number) => void;
  readonly handleTaskChange: (id: number, field: string, value: string | string[]) => void;
  readonly categories: Category[];
  readonly employees: Employee[];
  readonly loadingCategories: boolean;
  readonly loadingEmployees: boolean;
  readonly getTotalPrice: () => number;
  readonly getRemainingAmount: () => number;
  readonly submitting: boolean;
  readonly onReset: () => void;
}

export default function AddServiceDialog({
  onClose,
  formData,
  handleChange,
  handlePhoneChange,
  handleSubmit,
  clientData,
  searchingClient,
  tasks,
  addTask,
  removeTask,
  handleTaskChange,
  categories,
  employees,
  loadingCategories,
  loadingEmployees,
  getTotalPrice,
  getRemainingAmount,
  submitting,
  onReset,
}: AddServiceDialogProps) {
  return (
    <Modal
      isOpen
      onOpenChange={(open) => { if (!open) onClose(); }}
      size="xl"
      scrollBehavior="inside"
      classNames={{
        base: "sm:mx-auto mx-0 sm:my-auto my-0 sm:rounded-2xl rounded-t-2xl sm:max-h-[90dvh] max-h-[95dvh]",
        body: "p-0",
      }}
      placement="bottom"
    >
      <ModalContent>
        {/* ── Header ── */}
        <ModalHeader className="flex items-center gap-3 py-3 border-b border-default-100">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
            ✂️
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-default-900">إضافة خدمة جديدة</h2>
            <p className="text-xs text-default-400">
              {tasks.length} خدمة · الإجمالي {getTotalPrice().toFixed(2)} دج
            </p>
          </div>
        </ModalHeader>

        {/* ── Scrollable body ── */}
        <ModalBody>
          <ScrollShadow hideScrollBar>
            <form id="add-service-form" onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3">
              <ClientInfoCard
                formData={formData}
                handleChange={handleChange}
                handlePhoneChange={handlePhoneChange}
                searchingClient={searchingClient}
                clientData={clientData}
              />

              <ServiceTasksCard
                tasks={tasks}
                categories={categories}
                employees={employees}
                loadingCategories={loadingCategories}
                loadingEmployees={loadingEmployees}
                addTask={addTask}
                removeTask={removeTask}
                handleTaskChange={handleTaskChange}
              />

              <PaymentSummaryCard
                formData={formData}
                handleChange={handleChange}
                getTotalPrice={getTotalPrice}
                getRemainingAmount={getRemainingAmount}
                onReset={onReset}
                submitting={submitting}
              />
            </form>
          </ScrollShadow>
        </ModalBody>

        {/* ── Footer submit ── */}
        <ModalFooter className="border-t border-default-100 py-3 gap-2">
          <Button variant="flat" size="sm" onPress={onReset}>
            إعادة تعيين
          </Button>
          <Button
            type="submit"
            form="add-service-form"
            color="primary"
            size="sm"
            isLoading={submitting}
            className="flex-1"
          >
            تسجيل الخدمة
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
