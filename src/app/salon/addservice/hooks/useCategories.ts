"use client";
import { useState, useEffect } from "react";
import { Category } from "../types";
import { fetchCategories } from "../model/Categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  return { categories, loadingCategories };
}
