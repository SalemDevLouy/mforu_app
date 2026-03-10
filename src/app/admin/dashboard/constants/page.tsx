"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Salon, Constant } from "./types";
import { ConstantFormData } from "./data";
import { DashCard as ConstantCard } from "@/components/common/DashCard";
import ConstantTable from "../components/tables/ConstantTable";
import AddConstantModal from "../components/Dialoges/Constants/AddConstantModal";
import DeleteModal from "../components/Dialoges/Constants/DeleteModal";

export default function AdminConstantsPage() {
  const [constants, setConstants] = useState<Constant[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingConstant, setEditingConstant] = useState<Constant | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [filterSalon, setFilterSalon] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const blankForm: ConstantFormData = {
    salon_id:    "",
    const_name:  "",
    const_value: "",
    repetation:  "monthly",
    status:      "active",
    started_at:  new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState<ConstantFormData>(blankForm);

  /* ── fetch ── */
  useEffect(() => { fetchSalons(); }, []);
  useEffect(() => {
    fetchConstants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSalon, filterStatus]);

  const fetchSalons = async () => {
    try {
      const res = await fetch("/api/admin/salons");
      const data = await res.json();
      if (Array.isArray(data)) setSalons(data);
    } catch (err) { console.error("Error fetching salons:", err); }
  };

  const fetchConstants = async () => {
    try {
      setLoading(true);
      let url = "/api/admin/constant";
      const params: string[] = [];
      if (filterSalon)  params.push(`salon_id=${filterSalon}`);
      if (filterStatus) params.push(`status=${filterStatus}`);
      if (params.length) url += "?" + params.join("&");
      const res  = await fetch(url);
      const data = await res.json();
      if (data.success) setConstants(data.constants);
    } catch (err) { console.error("Error fetching constants:", err); }
    finally { setLoading(false); }
  };

  /* ── handlers ── */
  const openAdd = () => {
    setEditingConstant(null);
    setFormData({ ...blankForm, salon_id: filterSalon });
    setShowModal(true);
  };

  const handleEdit = (c: Constant) => {
    setEditingConstant(c);
    setFormData({
      salon_id:    c.salon?.salon_id ?? "",
      const_name:  c.const_name,
      const_value: String(c.const_value),
      repetation:  c.repetation,
      status:      c.status || "active",
      started_at:  new Date(c.started_at).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const method = editingConstant ? "PUT" : "POST";
      const body   = editingConstant
        ? { ...formData, const_id: editingConstant.const_id }
        : { ...formData };
      const res  = await fetch("/api/admin/constant", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingConstant(null);
        fetchConstants();
      } else { alert(data.error || "فشل حفظ البيانات"); }
    } catch (err) {
      console.error("Error saving constant:", err);
      alert("فشل حفظ البيانات");
    } finally { setSubmitting(false); }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setShowDeleteModal(true); };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res  = await fetch(`/api/admin/constant?const_id=${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        setDeleteId(null);
        fetchConstants();
      } else { alert(data.error || "فشل الحذف"); }
    } catch (err) { console.error("Error deleting constant:", err); }
  };

  /* ── derived stats ── */
  const activeConstants = constants.filter((c) => c.status === "active");
  const monthlyTotal    = activeConstants.filter((c) => c.repetation === "monthly").reduce((s, c) => s + c.const_value, 0);
  const yearlyTotal     = activeConstants.filter((c) => c.repetation === "yearly").reduce((s, c) => s + c.const_value, 0);

  const salonSummary = salons.map((s) => {
    const sc = constants.filter((c) => c.salon?.salon_id === s.salon_id && c.status === "active");
    return {
      ...s,
      monthly: sc.filter((c) => c.repetation === "monthly").reduce((a, c) => a + c.const_value, 0),
      yearly:  sc.filter((c) => c.repetation === "yearly").reduce((a, c) => a + c.const_value, 0),
      count:   sc.length,
    };
  }).filter((s) => s.count > 0);

  return (
    <div className="space-y-4" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة الثوابت والالتزامات</h1>
          <p className="text-default-500">إيجار الصالونات، رواتب ثابتة، فواتير دورية…</p>
        </div>
        <Button color="primary" onPress={openAdd}>+ إضافة ثابت</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ConstantCard title="إجمالي الثوابت"   value={constants.length}       />
        <ConstantCard title="الثوابت النشطة"   value={activeConstants.length}  />
        <ConstantCard title="التزامات شهرية"   value={monthlyTotal}            />
        <ConstantCard title="التزامات سنوية"   value={yearlyTotal}             />
      </div>

      {/* Table + Salon summary */}
      <ConstantTable
        constants={constants}
        salons={salons}
        salonSummary={salonSummary}
        loading={loading}
        filterSalon={filterSalon}
        filterStatus={filterStatus}
        setFilterSalon={setFilterSalon}
        setFilterStatus={setFilterStatus}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />

      {/* Add / Edit Modal */}
      <AddConstantModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingConstant(null); }}
        onSubmit={handleSubmit}
        salons={salons}
        editingConstant={editingConstant}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteId(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
}