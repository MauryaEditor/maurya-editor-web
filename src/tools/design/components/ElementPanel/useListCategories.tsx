import { useEffect, useState } from "react";
import { DesignElementRegistry } from "../../registry/DesignElementRegistry";
import { DesignElementCategory } from "../../types/DesignElementCategory";

export const useListCategories = () => {
  const [categories, setCategories] = useState<DesignElementCategory[]>([]);
  useEffect(() => {
    const subscription = DesignElementRegistry.subscribe({
      next: (v) => {
        setCategories(v);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setCategories]);
  return categories;
};
