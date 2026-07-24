"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  createBlock,
  deleteBlock,
  updateBlock,
  type BlockActionState,
} from "@/app/admin/blocks/actions";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Block = Database["public"]["Tables"]["blocks"]["Row"];

const initialState: BlockActionState = { status: "idle", message: "" };

const inputClass =
  "mt-2 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

function ActionMessage({ state }: { state: BlockActionState }) {
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

function BlockFormFields({ block, includeRooms }: { block?: Block; includeRooms: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Block name / flat number</span>
        <input
          className={inputClass}
          name="block_name"
          required
          defaultValue={block?.block_name ?? ""}
          placeholder="Flat A"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-700">Type</span>
        <select
          className={inputClass}
          name="block_type"
          required
          defaultValue={block?.block_type ?? "2BHK"}
        >
          <option value="2BHK">2BHK</option>
          <option value="3BHK">3BHK</option>
          <option value="4BHK">4BHK</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-700">Floor</span>
        <input
          className={inputClass}
          name="floor"
          required
          type="number"
          step="1"
          defaultValue={block?.floor ?? 1}
        />
      </label>

      {includeRooms ? (
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Number of rooms</span>
          <input
            className={inputClass}
            name="total_rooms"
            required
            type="number"
            min="1"
            step="1"
            defaultValue={1}
          />
          <span className="mt-1 block text-xs text-stone-400">
            Each room is created with 1 bed. You can add or remove rooms later.
          </span>
        </label>
      ) : null}
    </div>
  );
}

// Each modal owns its action state and is mounted only while open, so the
// success/error message never lingers when reopened.
function CreateBlockModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(async (prev: BlockActionState, fd: FormData) => {
    const res = await createBlock(prev, fd);
    if (res.status === "success") onClose();
    return res;
  }, initialState);

  return (
    <Modal size="lg" title="Add block" onClose={onClose}>
      <form action={action} className="space-y-5">
        <BlockFormFields includeRooms />
        <ActionMessage state={state} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Saving..." : "Save block"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EditBlockModal({ block, onClose }: { block: Block; onClose: () => void }) {
  const [state, action, pending] = useActionState(async (prev: BlockActionState, fd: FormData) => {
    const res = await updateBlock(prev, fd);
    if (res.status === "success") onClose();
    return res;
  }, initialState);

  return (
    <Modal size="lg" title={`Edit ${block.block_name}`} onClose={onClose}>
      <form action={action} className="space-y-5">
        <input name="id" type="hidden" value={block.id} />
        <BlockFormFields block={block} includeRooms={false} />
        <ActionMessage state={state} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Saving..." : "Update block"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteBlockModal({ block, onClose }: { block: Block; onClose: () => void }) {
  const [state, action, pending] = useActionState(async (prev: BlockActionState, fd: FormData) => {
    const res = await deleteBlock(prev, fd);
    if (res.status === "success") onClose();
    return res;
  }, initialState);

  return (
    <Modal title="Delete block" onClose={onClose}>
      <form action={action} className="space-y-5">
        <input name="id" type="hidden" value={block.id} />
        <p className="text-sm leading-6 text-stone-600">
          Delete <span className="font-semibold text-stone-900">{block.block_name}</span>? This is
          only allowed when the block has no rooms.
        </p>
        <ActionMessage state={state} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={pending} type="submit" variant="destructive">
            {pending ? "Deleting..." : "Delete block"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function BlocksManager({ blocks }: { blocks: Block[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<Block | null>(null);

  return (
    <>
      <div>
        <div className="flex flex-col gap-3 border-b border-stone-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">Flats and units with room capacity.</p>
          <Button
            className="h-11 w-full sm:h-8 sm:w-auto"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add block
          </Button>
        </div>

        {/* Mobile: stacked cards */}
        <ul className="divide-y divide-stone-100 sm:hidden">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <li key={block.id} className="flex items-start justify-between gap-3 px-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">{block.block_name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                    <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-600">
                      {block.block_type}
                    </span>
                    <span>Floor {block.floor}</span>
                    <span>
                      {block.total_rooms} {block.total_rooms === 1 ? "room" : "rooms"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    aria-label={`Edit ${block.block_name}`}
                    className="size-10"
                    size="icon"
                    type="button"
                    variant="outline"
                    onClick={() => setEditingBlock(block)}
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    aria-label={`Delete ${block.block_name}`}
                    className="size-10"
                    size="icon"
                    type="button"
                    variant="destructive"
                    onClick={() => setDeletingBlock(block)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-10 text-center text-stone-500">No blocks found.</li>
          )}
        </ul>

        {/* Tablet/desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="min-w-full divide-y divide-stone-200/80 text-sm">
            <thead className="bg-stone-50/60 text-left text-xs font-semibold tracking-wide text-stone-400 uppercase">
              <tr>
                <th className="px-5 py-3">Block Name</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Floor</th>
                <th className="px-5 py-3">Total Rooms</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {blocks.length > 0 ? (
                blocks.map((block) => (
                  <tr key={block.id} className="transition-colors hover:bg-stone-50/70">
                    <td className="px-5 py-4 font-medium text-stone-900">{block.block_name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                        {block.block_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{block.floor}</td>
                    <td className="px-5 py-4 text-stone-600">{block.total_rooms}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          aria-label={`Edit ${block.block_name}`}
                          size="icon-sm"
                          type="button"
                          variant="outline"
                          onClick={() => setEditingBlock(block)}
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Button>
                        <Button
                          aria-label={`Delete ${block.block_name}`}
                          size="icon-sm"
                          type="button"
                          variant="destructive"
                          onClick={() => setDeletingBlock(block)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-10 text-center text-stone-500" colSpan={5}>
                    No blocks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen ? <CreateBlockModal onClose={() => setIsCreateOpen(false)} /> : null}
      {editingBlock ? (
        <EditBlockModal block={editingBlock} onClose={() => setEditingBlock(null)} />
      ) : null}
      {deletingBlock ? (
        <DeleteBlockModal block={deletingBlock} onClose={() => setDeletingBlock(null)} />
      ) : null}
    </>
  );
}
