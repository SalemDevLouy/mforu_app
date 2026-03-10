"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Category, CategoryRate } from "../../../category/types";

interface CategoryCardProps {
  cat: Category;
  existingRate: CategoryRate | undefined;
  selectedSalon: string;
  isEditingName: boolean;
  isEditingRate: boolean;
  editingCatName: string;
  editingRateValue: string;
  formatRate: (rate: number) => string;
  onCatNameChange: (name: string) => void;
  onRateValueChange: (value: string) => void;
  onSaveEditName: () => void;
  onCancelEditName: () => void;
  onSaveRate: () => void;
  onCancelEditRate: () => void;
  onDeleteRate: () => void;
  onStartEditName: () => void;
  onStartEditRate: () => void;
  onDelete: () => void;
}

export default function CategoryCard({
  cat,
  existingRate,
  selectedSalon,
  isEditingName,
  isEditingRate,
  editingCatName,
  editingRateValue,
  formatRate,
  onCatNameChange,
  onRateValueChange,
  onSaveEditName,
  onCancelEditName,
  onSaveRate,
  onCancelEditRate,
  onDeleteRate,
  onStartEditName,
  onStartEditRate,
  onDelete,
}: Readonly<CategoryCardProps>) {
  return (
    <Card
      className={`hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border ${
        existingRate ? "border-success/30" : "border-default-200"
      }`}
    >
      {/* Accent bar */}
      <div
        className={`h-1 w-full rounded-t-xl ${
          existingRate
            ? "bg-linear-to-r from-success to-success/40"
            : "bg-linear-to-r from-default-300 to-default-100"
        }`}
      />

      <CardBody className="p-4 space-y-3">
        {/* Icon + name */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
              existingRate ? "bg-success/10" : "bg-default-100"
            }`}
          >
            🏷️
          </div>
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <input
                autoFocus
                className="w-full px-2 py-1 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={editingCatName}
                onChange={(e) => onCatNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveEditName();
                  if (e.key === "Escape") onCancelEditName();
                }}
              />
            ) : (
              <p className="font-semibold text-sm truncate text-default-900">{cat.cat_name}</p>
            )}
          </div>
        </div>

        {/* Rate section */}
        {selectedSalon && (
          <>
            <Divider />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-default-400 shrink-0">نسبة الموظف:</span>
              {isEditingRate ? (
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="w-28 px-2 py-1 border border-primary rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-left"
                  placeholder="0.33"
                  value={editingRateValue}
                  onChange={(e) => onRateValueChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveRate();
                    if (e.key === "Escape") onCancelEditRate();
                  }}
                />
              ) : (
                <Chip size="sm" variant="flat" color={existingRate ? "success" : "default"}>
                  {existingRate ? formatRate(existingRate.rate) : "غير محددة"}
                </Chip>
              )}
            </div>
          </>
        )}
      </CardBody>

      <CardFooter className="px-4 pb-3 pt-0 gap-1 flex-wrap">
        {isEditingName && (
          <>
            <Button size="sm" color="success" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onSaveEditName}>حفظ</Button>
            <Button size="sm" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onCancelEditName}>إلغاء</Button>
          </>
        )}
        {!isEditingName && isEditingRate && (
          <>
            <Button size="sm" color="success" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onSaveRate}>حفظ</Button>
            <Button size="sm" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onCancelEditRate}>إلغاء</Button>
            {existingRate && (
              <Button size="sm" color="danger" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onDeleteRate}>حذف النسبة</Button>
            )}
          </>
        )}
        {!isEditingName && !isEditingRate && (
          <>
            <Button size="sm" color="primary" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onStartEditName}>✏️ تعديل</Button>
            {selectedSalon && (
              <Button size="sm" color="warning" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onStartEditRate}>
                {existingRate ? "تعديل النسبة" : "تعيين النسبة"}
              </Button>
            )}
            <Button size="sm" color="danger" variant="flat" className="text-xs h-7 min-w-0 px-3" onPress={onDelete}>🗑️</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
