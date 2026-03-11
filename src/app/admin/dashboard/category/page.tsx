"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Category, CategoryRate, Salon } from "./types";
import AddCatDialog from "../components/Dialoges/Category/AddCatDialog";
import CategoryCard from "@/app/admin/dashboard/components/Dialoges/Category/CategoryCard";
import { parseAmount } from "@/lib/math";
import { DashCard } from "@/components/common/DashCard";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<string>("");
  const [rates, setRates] = useState<CategoryRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New category form

  // Per-card inline edit state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  // Per-card inline rate edit
  const [editingRateCatId, setEditingRateCatId] = useState<string | null>(null);
  const [editingRateValue, setEditingRateValue] = useState("");

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSalons();
  }, []);

  useEffect(() => {
    if (selectedSalon) fetchRates(selectedSalon);
  }, [selectedSalon]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalons = async () => {
    try {
      const res = await fetch("/api/admin/salons");
      if (res.ok) {
        const data: Salon[] = await res.json();
        setSalons(data);
        if (data.length > 0) setSelectedSalon(data[0].salon_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRates = async (salonId: string) => {
    try {
      const res = await fetch(`/api/admin/category-rates?salon_id=${salonId}`);
      if (res.ok) setRates(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const getRateForCat = (catId: string): CategoryRate | undefined =>
    rates.find((r) => r.cat_id === catId);

  const formatRate = (rate: number) => {
    if (Math.abs(rate - 1 / 3) < 0.001) return "33% (١/٣)";
    if (rate === 0.25) return "25% (١/٤)";
    if (rate === 0.5) return "50% (١/٢)";
    if (Math.abs(rate - 2 / 3) < 0.001) return "67% (٢/٣)";
    if (rate === 0.75) return "75% (٣/٤)";
    return `${(rate * 100).toFixed(0)}%`;
  };

  // ── Inline rename ─────────────────────────────────────────
  const startEditCat = (cat: Category) => {
    setEditingCatId(cat.cat_id);
    setEditingCatName(cat.cat_name);
    setEditingRateCatId(null);
  };

  const saveEditCat = async (catId: string) => {
    if (!editingCatName.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: catId, category_name: editingCatName.trim() }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      setEditingCatId(null);
      fetchCategories();
    } catch {
      alert("فشل في تحديث الفئة");
    }
  };

  // ── Delete category ───────────────────────────────────────
  const handleDeleteCat = async (catId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: catId }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      fetchCategories();
      if (selectedSalon) fetchRates(selectedSalon);
    } catch {
      alert("فشل في حذف الفئة");
    }
  };

  // ── Inline rate edit ──────────────────────────────────────
  const startEditRate = (cat: Category) => {
    const existing = getRateForCat(cat.cat_id);
    setEditingRateCatId(cat.cat_id);
    setEditingRateValue(existing ? existing.rate.toString() : "");
    setEditingCatId(null);
  };

  const saveRate = async (catId: string) => {
    if (!selectedSalon) { alert("اختر صالون أولاً"); return; }
    const rate = parseAmount(editingRateValue);
    if (Number.isNaN(rate) || rate < 0 || rate > 1) {
      alert("النسبة يجب أن تكون بين 0 و 1 (مثال: 0.33)");
      return;
    }
    try {
      const existing = getRateForCat(catId);
      if (existing) {
        await fetch("/api/admin/category-rates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rate_id: existing.rate_id, rate }),
        });
      } else {
        const res = await fetch("/api/admin/category-rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: selectedSalon, cat_id: catId, rate }),
        });
        if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      }
      setEditingRateCatId(null);
      fetchRates(selectedSalon);
    } catch {
      alert("فشل في حفظ النسبة");
    }
  };

  const deleteRate = async (catId: string) => {
    const existing = getRateForCat(catId);
    if (!existing || !confirm("هل تريد حذف نسبة هذه الفئة؟")) return;
    try {
      await fetch(`/api/admin/category-rates?rate_id=${existing.rate_id}`, { method: "DELETE" });
      fetchRates(selectedSalon);
    } catch {
      alert("فشل في حذف النسبة");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة الفئات</h1>
          <p className="text-default-500 text-sm mt-1">إضافة وتعديل الفئات ونسب الموظفين لكل صالون</p>
        </div>
        <Button color="primary" onPress={() => setIsAddDialogOpen(true)}>
          + إضافة فئة جديدة
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <DashCard title="إجمالي الفئات" value={categories.length} icon="📂" />
        <DashCard title="الصالونات" value={salons.length} icon="🏪" />
        <DashCard title="فئات لها نسبة" value={rates.length} icon="✅" />
      </div>

      {/* Salon selector */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 max-w-sm">
              <Select
                placeholder="اختر الصالون"
                variant="bordered"
                size="sm"
                startContent={<span className="text-default-400">🏪</span>}
                selectedKeys={selectedSalon ? new Set([selectedSalon]) : new Set()}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  if (val) setSelectedSalon(val);
                }}
                items={salons.map((s) => ({
                  key: s.salon_id,
                  label: s.name + (s.site ? ` — ${s.site}` : ""),
                }))}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            </div>
            {selectedSalon && (
              <div className="flex items-center gap-2 pb-1">
                <Chip size="sm" variant="flat" color="success">
                  {rates.length} فئة لها نسبة
                </Chip>
                <Chip size="sm" variant="flat" color="default">
                  {categories.length - rates.length} بدون نسبة
                </Chip>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Categories grid */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <Card>
          <CardBody className="py-16 flex flex-col items-center gap-3 text-default-400">
            <span className="text-5xl">📂</span>
            <p className="font-medium">لا توجد فئات</p>
            <p className="text-sm">أضف فئة جديدة بالضغط على الزر أعلاه</p>
          </CardBody>
        </Card>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const existingRate = getRateForCat(cat.cat_id);
            const isEditingName = editingCatId === cat.cat_id;
            const isEditingRate = editingRateCatId === cat.cat_id;

            return (
              <CategoryCard
                key={cat.cat_id}
                cat={cat}
                existingRate={existingRate}
                selectedSalon={selectedSalon}
                isEditingName={isEditingName}
                isEditingRate={isEditingRate}
                editingCatName={editingCatName}
                editingRateValue={editingRateValue}
                formatRate={formatRate}
                onCatNameChange={setEditingCatName}
                onRateValueChange={setEditingRateValue}
                onSaveEditName={() => saveEditCat(cat.cat_id)}
                onCancelEditName={() => setEditingCatId(null)}
                onSaveRate={() => saveRate(cat.cat_id)}
                onCancelEditRate={() => setEditingRateCatId(null)}
                onDeleteRate={() => deleteRate(cat.cat_id)}
                onStartEditName={() => startEditCat(cat)}
                onStartEditRate={() => startEditRate(cat)}
                onDelete={() => handleDeleteCat(cat.cat_id)}
              />
            );
          })}
        </div>
      )}

      <AddCatDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
