export type MenuTemplateKey = "cafe" | "bakery" | "tiffins" | "restaurant" | "juice";

export const MENU_TEMPLATES: Record<
  MenuTemplateKey,
  { label: string; categories: string[] }
> = {
  cafe: {
    label: "Cafe",
    categories: ["Coffee", "Tea", "Snacks", "Desserts"],
  },
  bakery: {
    label: "Bakery",
    categories: ["Breads", "Cakes", "Pastries", "Cookies"],
  },
  tiffins: {
    label: "South Indian Tiffins",
    categories: ["Idli & Dosa", "Meals", "Beverages", "Snacks"],
  },
  restaurant: {
    label: "Restaurant",
    categories: ["Starters", "Main Course", "Breads", "Desserts", "Beverages"],
  },
  juice: {
    label: "Juice Shop",
    categories: ["Fresh Juices", "Smoothies", "Shakes", "Add-ons"],
  },
};

export const MENU_TEMPLATE_KEYS = Object.keys(MENU_TEMPLATES) as MenuTemplateKey[];
