"use client";
import React from "react";
import { Button } from "@heroui/button";
import { useAddService } from "./hooks/hooks";
import AddServiceDialog from "./components/AddServiceDialog";
import CompletedServicesTable from "./components/CompletedServicesTable";

export default function Page() {
  const {
    showAddModal,
    setShowAddModal,
    categories,
    loadingCategories,
    employees,
    loadingEmployees,
    clientData,
    searchingClient,
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    tasks,
    addTask,
    removeTask,
    handleTaskChange,
    handleEmployeeToggle,
    getTotalPrice,
    getRemainingAmount,
    submitting,
    resetForm,
    completedServices,
    loadingCompleted,
    todayTotal,
    selectedDate,
    setSelectedDate,
  } = useAddService();

  return (
    <div className="">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">إدارة الخدمات</h1>
          <p className="text-gray-600">إضافة خدمة جديدة أو عرض الخدمات المكتملة</p>
        </div>
        <Button color="primary" onPress={() => setShowAddModal(true)}>
          + إضافة خدمة جديدة
        </Button>
      </div>

      {showAddModal && (
        <AddServiceDialog
          onClose={() => setShowAddModal(false)}
          formData={formData}
          handleChange={handleChange}
          handlePhoneChange={handlePhoneChange}
          handleSubmit={handleSubmit}
          clientData={clientData}
          searchingClient={searchingClient}
          tasks={tasks}
          addTask={addTask}
          removeTask={removeTask}
          handleTaskChange={handleTaskChange}
          handleEmployeeToggle={handleEmployeeToggle}
          categories={categories}
          employees={employees}
          loadingCategories={loadingCategories}
          loadingEmployees={loadingEmployees}
          getTotalPrice={getTotalPrice}
          getRemainingAmount={getRemainingAmount}
          submitting={submitting}
          onReset={resetForm}
        />
      )}

      <CompletedServicesTable
        completedServices={completedServices}
        loadingCompleted={loadingCompleted}
        todayTotal={todayTotal}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
