"use client";
import React from "react";
import { Category, Employee, ClientData, TaskItem, ServiceFormData } from "../types";
import ClientInfoCard from "./ClientInfoCard";
import ServiceTasksCard from "./ServiceTasksCard";
import PaymentSummaryCard from "./PaymentSummaryCard";

interface AddServiceDialogProps {
  onClose: () => void;
  // form
  formData: ServiceFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  // client
  clientData: ClientData | null;
  searchingClient: boolean;
  // tasks
  tasks: TaskItem[];
  addTask: () => void;
  removeTask: (id: number) => void;
  handleTaskChange: (id: number, field: string, value: string | string[]) => void;
  handleEmployeeToggle: (taskId: number, employeeId: string) => void;
  // categories & employees
  categories: Category[];
  employees: Employee[];
  loadingCategories: boolean;
  loadingEmployees: boolean;
  // calculations
  getTotalPrice: () => number;
  getRemainingAmount: () => number;
  // submit
  submitting: boolean;
  onReset: () => void;
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
  handleEmployeeToggle,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          type="button"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">إضافة خدمة جديدة</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            handleEmployeeToggle={handleEmployeeToggle}
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
      </div>
    </div>
  );
}
