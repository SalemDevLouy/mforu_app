"use client";
import React, { useState } from "react";
import { Card } from "@heroui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableCell, TableColumn,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { CompletedService } from "../types";
import { updateService, deleteService } from "../model/Services";
import { toFixed2 } from "@/lib/math";

interface CompletedServicesTableProps {
  readonly completedServices: CompletedService[];
  readonly loadingCompleted: boolean;
  readonly todayTotal: number;
  readonly selectedDate: string;
  readonly setSelectedDate: (date: string) => void;
  readonly onRefresh: () => void;
}

export default function CompletedServicesTable({
  completedServices,
  loadingCompleted,
  todayTotal,
  selectedDate,
  setSelectedDate,
  onRefresh,
}: CompletedServicesTableProps) {
  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editTarget, setEditTarget] = useState<CompletedService | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const openEdit = (service: CompletedService) => {
    setEditTarget(service);
    setEditPrice(String(service.price_total));
    setEditNotes(service.notes ?? "");
    setEditError(null);
  };

  const closeEdit = () => { setEditTarget(null); setEditError(null); };

  const handleSave = async () => {
    if (!editTarget) return;
    const price = Number.parseFloat(editPrice);
    if (Number.isNaN(price) || price <= 0) {
      setEditError("يجب إدخال سعر صحيح وأكبر من صفر");
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      await updateService(editTarget.service_id, {
        price_total: price,
        notes: editNotes.trim() || null,
      });
      closeEdit();
      onRefresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete state ───────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<CompletedService | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDelete = (service: CompletedService) => {
    setDeleteTarget(service);
    setDeleteError(null);
  };

  const closeDelete = () => { setDeleteTarget(null); setDeleteError(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteService(deleteTarget.service_id);
      closeDelete();
      onRefresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-none border border-default-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">الخدمات المكتملة</h2>
              <p className="text-sm text-default-400">
                {new Date(selectedDate).toLocaleDateString("ar-DZ", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-default-300 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="text-right">
                <p className="text-xs text-default-400">إجمالي اليوم</p>
                <p className="text-xl font-bold text-success">
                  {toFixed2(todayTotal)} دج
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          {(() => {
            if (loadingCompleted) {
              return (
                <div className="flex flex-col items-center py-12 text-default-400 gap-3">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                  جاري التحميل...
                </div>
              );
            }
            if (completedServices.length === 0) {
              return (
                <div className="text-center py-12 text-default-400">
                  لا توجد خدمات مسجّلة في هذا اليوم
                </div>
              );
            }
            return (
            <Table removeWrapper aria-label="الخدمات المكتملة">
              <TableHeader>
                <TableColumn>العميل</TableColumn>
                <TableColumn>الخدمات</TableColumn>
                <TableColumn>الموظفون</TableColumn>
                <TableColumn>الوقت</TableColumn>
                <TableColumn>الإجمالي</TableColumn>
                <TableColumn>إجراءات</TableColumn>
              </TableHeader>
              <TableBody>
                {completedServices.map((service) => (
                  <TableRow key={service.service_id}>
                    <TableCell>
                      <div className="font-medium text-sm">{service.client_name}</div>
                      {service.client_phone && (
                        <div className="text-xs text-default-400">{service.client_phone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.categories.map((cat) => (
                          <Chip key={cat} size="sm" color="primary" variant="flat">{cat}</Chip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.employees.map((emp) => (
                          <Chip key={emp} size="sm" variant="flat">{emp}</Chip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-default-500 whitespace-nowrap">
                      {new Date(service.date).toLocaleTimeString("ar-DZ", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-success text-sm">
                        {toFixed2(service.price_total)} دج
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => openEdit(service)}
                          aria-label="تعديل الخدمة"
                        >
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => openDelete(service)}
                          aria-label="حذف الخدمة"
                        >
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            );
          })()}
        </div>
      </Card>

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      <Modal isOpen={!!editTarget} onOpenChange={(open) => { if (!open) closeEdit(); }} size="sm">
        <ModalContent>
          <ModalHeader className="text-sm font-bold">
            تعديل الخدمة — {editTarget?.client_name}
          </ModalHeader>
          <ModalBody className="gap-3 pb-2">
            <Input
              label="السعر الإجمالي"
              type="number"
              size="sm"
              variant="bordered"
              value={editPrice}
              onValueChange={setEditPrice}
              endContent={<span className="text-default-400 text-xs">دج</span>}
              min={0}
              step={5}
            />
            <Textarea
              label="ملاحظات"
              size="sm"
              variant="bordered"
              value={editNotes}
              onValueChange={setEditNotes}
              placeholder="أضف ملاحظة..."
              minRows={2}
            />
            {editError && (
              <p className="text-danger text-xs">{editError}</p>
            )}
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button size="sm" variant="flat" onPress={closeEdit} isDisabled={saving}>
              إلغاء
            </Button>
            <Button size="sm" color="primary" onPress={handleSave} isLoading={saving}>
              حفظ التعديلات
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      <Modal isOpen={!!deleteTarget} onOpenChange={(open) => { if (!open) closeDelete(); }} size="sm">
        <ModalContent>
          <ModalHeader className="text-sm font-bold text-danger">
            تأكيد الحذف
          </ModalHeader>
          <ModalBody className="pb-2">
            <p className="text-sm text-default-600">
              {`هل أنت متأكد من حذف خدمة `}
              <span className="font-semibold text-default-900">{deleteTarget?.client_name}</span>
              {` بقيمة `}
              <span className="font-semibold text-danger">
                {deleteTarget ? `${toFixed2(deleteTarget.price_total)} دج` : ""}
              </span>
              {`؟`}
            </p>
            <p className="text-xs text-default-400 mt-1">لا يمكن التراجع عن هذا الإجراء.</p>
            {deleteError && (
              <p className="text-danger text-xs mt-1">{deleteError}</p>
            )}
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button size="sm" variant="flat" onPress={closeDelete} isDisabled={deleting}>
              إلغاء
            </Button>
            <Button size="sm" color="danger" onPress={handleDelete} isLoading={deleting}>
              نعم، احذف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

