import { create } from "zustand";

export interface UploadItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "processing" | "done";
}

interface UploadState {
  uploads: UploadItem[];
  addUpload: (file: UploadItem) => void;
  markDone: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: [],
  addUpload: (file) =>
    set((state) => ({ uploads: [file, ...state.uploads] })),
  markDone: (id) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "done" } : u
      ),
    })),
}));
