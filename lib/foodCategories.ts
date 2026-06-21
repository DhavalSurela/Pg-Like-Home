// Shared list of food-photo categories. The `value` is stored in the database
// and must match the slider sections on the public /food page.
export const FOOD_CATEGORIES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch-dinner", label: "Lunch & Dinner" },
  { value: "festival-food", label: "Festival Food" },
  { value: "fastfood", label: "Fast Food" },
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]["value"];

export const FOOD_CATEGORY_VALUES = FOOD_CATEGORIES.map((c) => c.value) as readonly string[];

export function foodCategoryLabel(value: string) {
  return FOOD_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
