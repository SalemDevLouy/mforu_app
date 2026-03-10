"use client";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { NewClientFormData } from "../types";

interface AddClientModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd: (data: NewClientFormData) => Promise<unknown>;
}

const BLANK = (): NewClientFormData => ({ name: "", phone: "" });

export function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState<NewClientFormData>(BLANK());
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setFormData(BLANK());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onAdd(formData);
      alert("تم إضافة العميل بنجاح");
      handleClose();
    } catch {
      alert("فشل إضافة العميل");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">إضافة عميل جديد</h3>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-client-name" className="block text-sm font-medium mb-2">
                  اسم العميل <span className="text-danger">*</span>
                </label>
                <input
                  id="new-client-name"
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="new-client-phone" className="block text-sm font-medium mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="new-client-phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={handleClose}>إلغاء</Button>
            <Button type="submit" color="primary" isLoading={submitting}>إضافة</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
