"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Pencil, Trash2, Upload } from "lucide-react";

import {
  createFoodPhoto,
  deleteFoodPhoto,
  updateFoodPhoto,
  type FoodPhotoActionState,
} from "@/app/admin/food-photos/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { FOOD_CATEGORIES, foodCategoryLabel } from "@/lib/foodCategories";
import type { Database } from "@/lib/database.types";

type Photo = Database["public"]["Tables"]["food_photos"]["Row"];

const initialState: FoodPhotoActionState = { status: "idle", message: "" };

const inputClass =
  "mt-2 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

// Downscale + re-encode an image in the browser before upload so stored files
// are web-sized (typically 1.7MB -> ~150-300KB). Falls back to the original on
// any failure or if it's already small.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const maxDim = 1600;
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= 600 * 1024) {
      bitmap.close?.();
      return file;
    }
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8)
    );
    if (!blob || blob.size >= file.size) return file;
    const name = `${file.name.replace(/\.[^.]+$/, "")}.jpg`;
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function ActionMessage({ state }: { state: FoodPhotoActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      className={
        state.status === "success"
          ? "rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700"
          : "rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

export function FoodPhotosManager({ photos }: { photos: Photo[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);

  const [createState, createAction, isCreating] = useActionState(createFoodPhoto, initialState);

  // Reset the upload form after a successful upload.
  useEffect(() => {
    if (createState.status === "success") {
      formRef.current?.reset();
    }
  }, [createState]);

  // Compress the chosen image in the browser, then dispatch the upload action.
  // FormData is read synchronously (before the event target is recycled), the
  // async compression runs, then the dispatch is wrapped in a *synchronous*
  // startTransition so the action stays in a transition (isCreating updates).
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      const compressed = await compressImage(file);
      formData.set("file", compressed, compressed.name);
    }
    startTransition(() => createAction(formData));
  };

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div className="card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card sm:p-6">
        <div className="flex items-center gap-2">
          <ImagePlus aria-hidden="true" className="size-4 text-stone-400" />
          <h2 className="text-base font-semibold text-stone-900">Upload a photo</h2>
        </div>
        <form ref={formRef} onSubmit={handleUpload} className="mt-5 space-y-4" suppressHydrationWarning>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Category</span>
              <select className={inputClass} name="category" required defaultValue={FOOD_CATEGORIES[0].value}>
                {FOOD_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Caption</span>
              <input className={inputClass} name="title" placeholder="e.g. Sunday special thali" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Image file</span>
            <input
              className="mt-2 w-full cursor-pointer rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 shadow-xs file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-stone-700"
              name="file"
              type="file"
              accept="image/*"
              required
            />
            <span className="mt-1 block text-xs text-stone-400">JPG, PNG or WebP up to 5 MB.</span>
          </label>
          <ActionMessage state={createState} />
          <div className="flex justify-end">
            <Button disabled={isCreating} type="submit">
              <Upload aria-hidden="true" className="size-4" />
              {isCreating ? "Uploading..." : "Upload photo"}
            </Button>
          </div>
        </form>
      </div>

      {/* Gallery grouped by category */}
      {FOOD_CATEGORIES.map((category) => {
        const items = photos
          .filter((photo) => photo.category === category.value)
          .sort((a, b) => a.sort_order - b.sort_order);

        return (
          <div key={category.value} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-stone-700">{category.label}</h3>
              <span className="text-xs text-stone-400">
                {items.length} {items.length === 1 ? "photo" : "photos"}
              </span>
            </div>
            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((photo) => (
                  <div
                    key={photo.id}
                    className="group overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-card"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100">
                      <Image
                        src={photo.image_url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized={photo.image_url.startsWith("http")}
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button
                          aria-label="Edit photo"
                          type="button"
                          onClick={() => setEditingPhoto(photo)}
                          className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-stone-700 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm transition-colors hover:bg-white"
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          aria-label="Delete photo"
                          type="button"
                          onClick={() => setDeletingPhoto(photo)}
                          className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm transition-colors hover:bg-white"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="truncate px-3 py-2 text-xs text-stone-500" title={photo.title}>
                      {photo.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-stone-200 text-sm text-stone-400">
                No photos in {category.label} yet
              </div>
            )}
          </div>
        );
      })}

      {editingPhoto ? (
        <Modal title="Edit photo" onClose={() => setEditingPhoto(null)}>
          <ActionForm
            key={editingPhoto.id}
            action={updateFoodPhoto}
            onSuccess={() => setEditingPhoto(null)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <input name="id" type="hidden" value={editingPhoto.id} />
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                  <Image
                src={editingPhoto.image_url}
                alt={editingPhoto.title}
                fill
                className="object-cover"
                sizes="400px"
                unoptimized={editingPhoto.image_url.startsWith("http")}
              />
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Caption</span>
                  <input className={inputClass} name="title" defaultValue={editingPhoto.title} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Category</span>
                    <select className={inputClass} name="category" defaultValue={editingPhoto.category}>
                      {FOOD_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Sort order</span>
                    <input className={inputClass} name="sort_order" type="number" step="1" defaultValue={editingPhoto.sort_order} />
                  </label>
                </div>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingPhoto(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deletingPhoto ? (
        <Modal title="Delete photo" onClose={() => setDeletingPhoto(null)}>
          <ActionForm action={deleteFoodPhoto} onSuccess={() => setDeletingPhoto(null)} className="space-y-4">
            {(state, pending) => (
              <>
                <input name="id" type="hidden" value={deletingPhoto.id} />
                <input name="image_url" type="hidden" value={deletingPhoto.image_url} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete this photo from{" "}
                  <span className="font-semibold text-stone-900">{foodCategoryLabel(deletingPhoto.category)}</span>? It
                  will be removed from the public Food page immediately.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeletingPhoto(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete photo"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}
    </div>
  );
}
