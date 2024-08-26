import { Checkbox } from "@/components/ui/checkbox";
import { Filters } from "@/types/product";

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (category: keyof Filters, value: string[]) => void;
  isFilterOpen: boolean;
}

const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Drinks",
];
const allergens = ["Gluten", "Lactose", "Nuts", "Eggs", "Soy"];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  isFilterOpen,
}) => {
  return (
    <aside
      className={`w-full md:w-1/4 bg-white p-6 rounded-lg ${
        isFilterOpen ? "block" : "hidden md:block"
      }`}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories?.includes(category)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      onFilterChange("categories", [
                        ...(filters.categories || []),
                        category,
                      ]);
                    } else {
                      onFilterChange(
                        "categories",
                        filters.categories?.filter((c) => c !== category) || []
                      );
                    }
                  }}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Allergen-Free
          </h3>
          <div className="space-y-2">
            {allergens.map((allergen) => (
              <div key={allergen} className="flex items-center space-x-2">
                <Checkbox
                  id={`allergen-${allergen}`}
                  checked={filters.allergens?.includes(allergen)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      onFilterChange("allergens", [
                        ...(filters.allergens || []),
                        allergen,
                      ]);
                    } else {
                      onFilterChange(
                        "allergens",
                        filters.allergens?.filter((a) => a !== allergen) || []
                      );
                    }
                  }}
                />
                <label
                  htmlFor={`allergen-${allergen}`}
                  className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {allergen}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
