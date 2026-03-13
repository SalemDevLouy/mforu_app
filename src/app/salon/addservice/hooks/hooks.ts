"use client";
import { useState, useEffect } from "react";
import { ServiceFormData } from "../types";
import { useCategories } from "./useCategories";
import { useEmployees } from "./useEmployees";
import { useCompletedServices } from "./useCompletedServices";
import { useClientSearch } from "./useClientSearch";
import { useTasks } from "./useTasks";
import { submitService } from "../model/Services";
import { parseAmount, sub } from "@/lib/math";

export function useAddService() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [salonId, setSalonId] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setSalonId(user.salon_id || "");
      } catch {
        // ignore
      }
    }
  }, []);

  const [formData, setFormData] = useState<ServiceFormData>({
    clientName: "",
    clientPhone: "",
    paidAmount: "",
    notes: "",
  });

  // ── Sub-hooks ─────────────────────────────────────────────────────────────
  const { categories, loadingCategories } = useCategories();
  const { employees, loadingEmployees } = useEmployees(salonId);
  const completedState = useCompletedServices(salonId, refreshKey);
  const { tasks, addTask, removeTask, handleTaskChange, getTotalPrice, resetTasks } = useTasks();
  const { clientData, searchingClient, doSearch, clearClient } = useClientSearch(
    salonId,
    (name) => setFormData((prev) => ({ ...prev, clientName: name }))
  );

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData((prev) => ({ ...prev, clientPhone: phone }));
    if (phone.length === 10) doSearch(phone);
    else if (phone.length < 10) clearClient();
  };

  const getRemainingAmount = () =>
    sub(getTotalPrice(), parseAmount(formData.paidAmount));

  const resetForm = () => {
    setFormData({ clientName: "", clientPhone: "", paidAmount: "", notes: "" });
    resetTasks();
    clearClient();
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tasks.some((t) => !t.catId || t.employeeIds.length === 0)) {
      alert("يجب اختيار نوع الخدمة وموظف واحد على الأقل لكل خدمة");
      return;
    }
    const total = getTotalPrice();
    const paid = parseAmount(formData.paidAmount);
    if (paid < 0) { alert("المبلغ المدفوع لا يمكن أن يكون سالباً"); return; }

    setSubmitting(true);
    try {
      const data = await submitService({
        salon_id: salonId,
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim() || undefined,
        clientId: clientData?.client?.client_id || undefined,
        paidAmount: paid,
        notes: formData.notes.trim() || undefined,
        tasks: tasks.map((t) => ({
          cat_id: t.catId,
          price: parseAmount(t.price),
          employeeIds: t.employeeIds,
        })),
      });

      const remaining = sub(total, paid);
      let msg = `✓ تم تسجيل الخدمة بنجاح\n\nالعميل: ${data.client_name}\nالإجمالي: ${total.toFixed(2)} دج\nالمدفوع: ${paid.toFixed(2)} دج`;
      const appliedExistingCreditToOldDebts = Number(data.applied_existing_credit_to_old_debts || 0);
      const appliedExistingCreditToCurrentService = Number(data.applied_existing_credit_to_current_service || 0);
      const appliedSurplusToOldDebts = Number(data.applied_surplus_to_old_debts || 0);
      const newPendingDebt = Number(data.new_pending_debt || 0);
      const newCreditBalance = Number(data.new_credit_balance || 0);

      if (appliedExistingCreditToOldDebts > 0) {
        msg += `\n\n💳 تم استخدام فكة سابقة لتخفيض ديون قديمة: ${appliedExistingCreditToOldDebts.toFixed(2)} دج`;
      }
      if (appliedExistingCreditToCurrentService > 0) {
        msg += `\n\n💳 تم استخدام فكة سابقة لتغطية جزء من الخدمة الحالية: ${appliedExistingCreditToCurrentService.toFixed(2)} دج`;
      }
      if (appliedSurplusToOldDebts > 0) {
        msg += `\n\n📉 فائض الدفع خُصم من ديون سابقة: ${appliedSurplusToOldDebts.toFixed(2)} دج`;
      }

      if (newPendingDebt > 0) msg += `\n\n⚠️ دين مُسجَّل على العميل: ${newPendingDebt.toFixed(2)} دج`;
      else if (newCreditBalance > 0) msg += `\n\n💰 فكة متبقية للعميل: ${newCreditBalance.toFixed(2)} دج`;
      else if (remaining === 0 || appliedExistingCreditToCurrentService > 0 || appliedSurplusToOldDebts > 0) msg += "\n\n✓ تمت التسوية بدون رصيد متبقٍ";
      else msg += "\n\n✓ تم الدفع الكامل";

      alert(msg);
      resetForm();
      setShowAddModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showAddModal, setShowAddModal,
    categories, loadingCategories,
    employees, loadingEmployees,
    clientData, searchingClient,
    formData, handleChange, handlePhoneChange,
    tasks, addTask, removeTask, handleTaskChange,
    getTotalPrice, getRemainingAmount,
    submitting, handleSubmit, resetForm,
    ...completedState,
  };
}
