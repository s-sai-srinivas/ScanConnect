import type { Database } from "./database";

export type Business = Database["public"]["Tables"]["scanconnect_businesses"]["Row"];
export type MenuCategory = Database["public"]["Tables"]["scanconnect_menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["scanconnect_menu_items"]["Row"];

export type CategoryWithItems = MenuCategory & {
  menu_items: MenuItem[];
};

export type BusinessWithMenu = Business & {
  menu_categories: CategoryWithItems[];
};

export type QrTable = Database["public"]["Tables"]["scanconnect_qr_tables"]["Row"];
export type Scan = Database["public"]["Tables"]["scanconnect_scans"]["Row"];
export type Interaction = Database["public"]["Tables"]["scanconnect_interactions"]["Row"];
export type InteractionType = "call_waiter" | "whatsapp_order";
