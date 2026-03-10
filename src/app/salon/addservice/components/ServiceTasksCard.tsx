"use client";
import React from "react";
import { Card } from "@heroui/card";
import { Category, Employee, TaskItem } from "../types";

interface ServiceTasksCardProps {
  tasks: TaskItem[];
  categories: Category[];
  employees: Employee[];
  loadingCategories: boolean;
  loadingEmployees: boolean;
  addTask: () => void;
  removeTask: (id: number) => void;
  handleTaskChange: (id: number, field: string, value: string | string[]) => void;
  handleEmployeeToggle: (taskId: number, employeeId: string) => void;
}

export default function ServiceTasksCard({
  tasks,
  categories,
  employees,
  loadingCategories,
  loadingEmployees,
  addTask,
  removeTask,
  handleTaskChange,
  handleEmployeeToggle,
}: ServiceTasksCardProps) {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-medium">تفاصيل الخدمات</h2>
          <button
            type="button"
            onClick={addTask}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium w-full sm:w-auto"
          >
            + إضافة خدمة
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <Card key={task.id} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">الخدمة {index + 1}</h3>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    حذف
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Service Name */}
                <div>
                  <label
                    htmlFor={`service-${task.id}`}
                    className="block text-sm font-medium mb-2"
                  >
                    نوع الخدمة <span className="text-red-600">*</span>
                  </label>
                  <select
                    id={`service-${task.id}`}
                    value={task.catId}
                    onChange={(e) =>
                      handleTaskChange(task.id, "catId", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">اختر نوع الخدمة</option>
                    {loadingCategories ? (
                      <option disabled>جاري التحميل...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>
                          {category.cat_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor={`price-${task.id}`}
                    className="block text-sm font-medium mb-2"
                  >
                    السعر (دج) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id={`price-${task.id}`}
                    type="number"
                    value={task.price}
                    onChange={(e) =>
                      handleTaskChange(task.id, "price", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100.00"
                    min="0"
                    step="5"
                    required
                  />
                </div>

                {/* Employees Selection */}
                <div className="md:col-span-2">
                  <div className="block text-sm font-medium mb-2">
                    الموظفين <span className="text-red-600">*</span>
                  </div>

                  {loadingEmployees && (
                    <div className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg bg-gray-50">
                      جاري التحميل...
                    </div>
                  )}

                  {!loadingEmployees && employees.length === 0 && (
                    <div className="px-3 py-2 text-sm text-red-500 border border-red-300 rounded-lg bg-red-50">
                      لا يوجد موظفين
                    </div>
                  )}

                  {!loadingEmployees && employees.length > 0 && (
                    <div className="space-y-3">
                      {/* Selected Employees Display */}
                      {task.employeeIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          {task.employeeIds.map((empId) => {
                            const employee = employees.find(
                              (e) => e.emp_id === empId
                            );
                            return employee ? (
                              <div
                                key={empId}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm"
                              >
                                <span>{employee.emp_name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEmployeeToggle(task.id, empId)
                                  }
                                  className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                                  aria-label="إزالة"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Available Employees Grid */}
                      <div className="flex gap-2">
                        {employees.map((employee) => {
                          const isSelected = task.employeeIds.includes(
                            employee.emp_id
                          );
                          if (isSelected) return null;

                          return (
                            <button
                              key={employee.emp_id}
                              type="button"
                              onClick={() =>
                                handleEmployeeToggle(task.id, employee.emp_id)
                              }
                              className="flex items-center justify-between gap-2 px-3 py-2.5 border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-right bg-white"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {employee.emp_name}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
