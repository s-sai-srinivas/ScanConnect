"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { BusinessWithMenu, CategoryWithItems, MenuItem } from "@/types";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  duplicateMenuItem,
  updateMenuItem,
  reorderCategories,
  reorderMenuItems,
} from "@/lib/actions/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

function SortableItemRow({
  item,
  onToggle,
  onDuplicate,
  onDelete,
}: {
  item: MenuItem;
  onToggle: (checked: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 p-3 bg-zinc-900"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-zinc-500 hover:text-zinc-300 p-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-sm text-primary">{formatPrice(item.price)}</p>
        <div className="mt-1 flex gap-1">
          {item.is_veg && <Badge variant="veg">Veg</Badge>}
          {!item.is_available && <Badge variant="destructive">Out of stock</Badge>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Switch checked={item.is_available ?? true} onCheckedChange={onToggle} />
        <Button variant="outline" size="sm" className="border-zinc-700" onClick={onDuplicate}>
          Duplicate
        </Button>
        <Button variant="ghost" size="sm" className="text-red-400" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function SortableCategory({
  cat,
  loading,
  onDeleteCategory,
  run,
}: {
  cat: CategoryWithItems;
  loading: boolean;
  onDeleteCategory: () => void;
  run: (action: () => Promise<{ error?: string; success?: boolean }>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const itemIds = cat.menu_items.map((i) => i.id);

  return (
    <section
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="cursor-grab touch-none text-zinc-500 hover:text-zinc-300 p-1 shrink-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <h2 className="font-semibold text-lg truncate">{cat.name}</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 shrink-0"
          disabled={loading}
          onClick={onDeleteCategory}
        >
          Delete category
        </Button>
      </div>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {cat.menu_items.map((item) => (
            <SortableItemRow
              key={item.id}
              item={item}
              onToggle={(checked) =>
                run(() => updateMenuItem(item.id, { is_available: checked }))
              }
              onDuplicate={() => run(() => duplicateMenuItem(item.id))}
              onDelete={() => run(() => deleteMenuItem(item.id))}
            />
          ))}
          {cat.menu_items.length === 0 && (
            <p className="text-sm text-zinc-500">No items in this category</p>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

export function MenuEditor({ business }: { business: BusinessWithMenu }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [quickName, setQuickName] = useState("");
  const [quickPrice, setQuickPrice] = useState("");
  const [categories, setCategories] = useState(business.menu_categories);

  useEffect(() => {
    setCategories(business.menu_categories);
  }, [business.menu_categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function run(action: () => Promise<{ error?: string; success?: boolean }>) {
    setLoading(true);
    const result = await action();
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Saved!");
      router.refresh();
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const categoryIds = categories.map((c) => c.id);
    if (categoryIds.includes(activeId) && categoryIds.includes(overId)) {
      const oldIndex = categoryIds.indexOf(activeId);
      const newIndex = categoryIds.indexOf(overId);
      const reordered = arrayMove(categories, oldIndex, newIndex);
      setCategories(reordered);
      const result = await reorderCategories(
        business.id,
        reordered.map((c) => c.id)
      );
      if (result.error) {
        toast.error(result.error);
        setCategories(categories);
      } else {
        toast.success("Categories reordered");
        router.refresh();
      }
      return;
    }

    for (const cat of categories) {
      const itemIds = cat.menu_items.map((i) => i.id);
      if (itemIds.includes(activeId) && itemIds.includes(overId)) {
        const oldIndex = itemIds.indexOf(activeId);
        const newIndex = itemIds.indexOf(overId);
        const reorderedItems = arrayMove(cat.menu_items, oldIndex, newIndex);
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, menu_items: reorderedItems } : c))
        );
        const result = await reorderMenuItems(
          cat.id,
          reorderedItems.map((i) => i.id)
        );
        if (result.error) {
          toast.error(result.error);
          setCategories(business.menu_categories);
        } else {
          toast.success("Items reordered");
          router.refresh();
        }
        return;
      }
    }
  }

  const categoryIds = categories.map((c) => c.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menu editor</h1>
        <p className="text-sm text-zinc-400">Drag to reorder categories and items</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name"
          className="border-zinc-700 bg-zinc-800 text-white"
        />
        <Button
          disabled={loading || !newCat.trim()}
          onClick={() =>
            run(async () => {
              const r = await createCategory(business.id, newCat.trim());
              if (!r.error) setNewCat("");
              return r;
            })
          }
        >
          Add
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <p className="text-sm font-medium text-zinc-300">Quick add (first category)</p>
        <div className="flex gap-2 flex-wrap">
          <Input
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            placeholder="Item name"
            className="border-zinc-700 bg-zinc-800 text-white flex-1 min-w-[120px]"
          />
          <Input
            value={quickPrice}
            onChange={(e) => setQuickPrice(e.target.value)}
            placeholder="Price"
            type="number"
            className="border-zinc-700 bg-zinc-800 text-white w-24"
          />
          <Button
            disabled={loading || !categories[0]}
            onClick={() => {
              const cat = categories[0];
              if (!cat) return;
              const price = parseFloat(quickPrice);
              if (!quickName.trim() || isNaN(price)) {
                toast.error("Name and price required");
                return;
              }
              run(async () => {
                const r = await createMenuItem({
                  categoryId: cat.id,
                  name: quickName.trim(),
                  price,
                });
                if (!r.error) {
                  setQuickName("");
                  setQuickPrice("");
                }
                return r;
              });
            }}
          >
            Add item
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {categories.map((cat) => (
              <SortableCategory
                key={cat.id}
                cat={cat}
                loading={loading}
                onDeleteCategory={() => run(() => deleteCategory(cat.id))}
                run={run}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
