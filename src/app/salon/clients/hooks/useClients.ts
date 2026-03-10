"use client";

import { useState, useEffect, useCallback } from "react";
import { Client, ClientFormData } from "../types";
import {
  fetchClients as fetchClientsApi,
  createClient,
  updateClient,
  deleteClient,
} from "../model/clients.model";

export function useClients() {
  const [salonId, setSalonId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);

  // Form
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    phone: "",
    notes: "",
  });

  // Load salonId from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setSalonId(user.salon_id || "");
    }
  }, []);

  const fetchClients = useCallback(async () => {
    if (!salonId) return;
    try {
      setLoading(true);
      const data = await fetchClientsApi(salonId, searchQuery || undefined);
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("فشل تحميل بيانات العملاء");
    } finally {
      setLoading(false);
    }
  }, [salonId, searchQuery]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ name: "", phone: "", notes: "" });
    setShowClientModal(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({ name: client.name, phone: client.phone, notes: client.notes });
    setShowClientModal(true);
  };

  const closeClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
    setFormData({ name: "", phone: "", notes: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient.client_id, formData);
        alert("تم تحديث بيانات العميل بنجاح");
      } else {
        await createClient(salonId, formData);
        alert("تم إضافة العميل بنجاح");
      }
      closeClientModal();
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
      alert(error instanceof Error ? error.message : "فشل حفظ البيانات");
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteClientId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteClientId(null);
  };

  const handleDelete = async () => {
    if (!deleteClientId) return;
    try {
      await deleteClient(deleteClientId);
      alert("تم حذف العميل بنجاح");
      closeDeleteModal();
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      alert(error instanceof Error ? error.message : "فشل حذف العميل");
    }
  };

  return {
    salonId,
    clients,
    loading,
    searchQuery,
    setSearchQuery,
    fetchClients,
    // Client modal
    showClientModal,
    editingClient,
    formData,
    setFormData,
    openAddModal,
    openEditModal,
    closeClientModal,
    handleSubmit,
    // Delete modal
    showDeleteModal,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  };
}
