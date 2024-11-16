// utils/features.ts
import { toast } from "react-hot-toast";
import { NextRouter } from "next/router";

export const responseToast = (res: any, router: NextRouter, path: string) => {
  if ('data' in res && res.data.success) {
    toast.success(res.data.message);
    router.push(path);
  } else {
    toast.error(res.error?.data?.message || "Something went wrong");
  }
};

export const slugify = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};


export const unSlugify = (slug: string) => {
  return slug
    .replace(/-/g, " ") 
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


