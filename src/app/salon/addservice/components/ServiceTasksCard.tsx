"use client";
import React, { useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Category, Employee, TaskItem } from "../types";
import { HiMagnifyingGlass, HiScissors, HiPlus } from "react-icons/hi2";

interface ServiceTasksCardProps {
  tasks: TaskItem[];
  categories: Category[];
  employees: Employee[];
  loadingCategories: boolean;
  loadingEmployees: boolean;
  addTask: () => void;
  removeTask: (id: number) => void;
  handleTaskChange: (id: number, field: string, value: string | string[]) => void;
}

/** Per-task employee dropdown with built-in search */
function EmployeeMultiSelect({
  selectedIds,
  employees,
  onChange,
}: {
  readonly selectedIds: string[];
  readonly employees: Employee[];
  readonly onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = employees.filter((e) =>
    e.emp_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Search input above the select */}
      <Input
        size="sm"
        placeholder="بحث عن موظف..."
        value={search}
        onValueChange={setSearch}
        variant="bordered"
        startContent={<HiMagnifyingGlass className="text-default-400 text-sm" />}
        classNames={{ input: "text-sm" }}
        aria-label="بحث عن موظف"
      />
      <Select
        aria-label="اختر الموظفين"
        placeholder="اختر الموظفين..."
        selectionMode="multiple"
        selectedKeys={new Set(selectedIds)}
        onSelectionChange={(keys) => {
          if (keys !== "all") onChange(Array.from(keys as Set<string>));
        }}
        variant="bordered"
        size="sm"
        classNames={{
          trigger: "min-h-10",
          listbox: "max-h-48",
        }}
        renderValue={(items) => (
          <div className="flex flex-wrap gap-1 py-0.5">
            {items.map((item) => (
              <Chip key={item.key} size="sm" color="primary" variant="flat">
                {item.textValue}
              </Chip>
            ))}
          </div>
        )}
      >
        {filtered.map((emp) => (
          <SelectItem key={emp.emp_id} textValue={emp.emp_name}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {emp.emp_name[0]}
              </div>
              <span className="text-sm">{emp.emp_name}</span>
            </div>
          </SelectItem>
        ))}
      </Select>
      {selectedIds.length > 0 && (
        <p className="text-xs text-default-400">
          {selectedIds.length} موظف{selectedIds.length > 1 ? "ين" : ""} محدد
        </p>
      )}
    </div>
  );
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
}: Readonly<ServiceTasksCardProps>) {
  return (
    <Card className="shadow-none border border-default-200">
      <div className="p-3 sm:p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiScissors className="text-base text-default-500" />
            <h2 className="text-sm font-semibold text-default-700">تفاصيل الخدمات</h2>
          </div>
          <Button
            type="button"
            size="sm"
            variant="flat"
            color="primary"
            onPress={addTask}
            startContent={<HiPlus />}
          >
            خدمة جديدة
          </Button>
        </div>

        {/* Task rows */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="rounded-xl border border-default-200 bg-default-50 p-3 space-y-3"
            >
              {/* Row header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                  الخدمة {index + 1}
                </span>
                {tasks.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeTask(task.id)}
                  >
                    حذف
                  </Button>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <Select
                  label="نوع الخدمة"
                  placeholder="اختر..."
                  size="sm"
                  variant="bordered"
                  isRequired
                  isLoading={loadingCategories}
                  selectedKeys={task.catId ? new Set([task.catId]) : new Set()}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys as Set<string>)[0] ?? "";
                    handleTaskChange(task.id, "catId", val);
                  }}
                  aria-label="نوع الخدمة"
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.cat_id} textValue={cat.cat_name}>
                      {cat.cat_name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Price */}
                <Input
                  label="السعر (دج)"
                  type="number"
                  size="sm"
                  variant="bordered"
                  isRequired
                  value={task.price}
                  onValueChange={(v) => handleTaskChange(task.id, "price", v)}
                  placeholder="0.00"
                  min="0"
                  step="5"
                  startContent={<span className="text-default-400 text-xs">دج</span>}
                />

                {/* Employees — spans full width */}
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-default-600 mb-1.5">
                    الموظفين <span className="text-danger">*</span>
                  </p>
                  {(() => {
                    if (loadingEmployees) return <div className="text-xs text-default-400 py-2">جاري التحميل...</div>;
                    if (employees.length === 0) return <div className="text-xs text-danger py-2">لا يوجد موظفين مسجلين</div>;
                    return (
                      <EmployeeMultiSelect
                        selectedIds={task.employeeIds}
                        employees={employees}
                        onChange={(ids) => handleTaskChange(task.id, "employeeIds", ids)}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
