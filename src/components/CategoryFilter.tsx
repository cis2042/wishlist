import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    className: string;
  }>;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          className={cn(
            "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
            "border border-white/20 backdrop-blur-sm",
            "hover:scale-105 hover:shadow-lg",
            "flex items-center gap-2",
            category.className,
            activeCategory === category.id 
              ? "ring-2 ring-white/30 scale-105 shadow-lg" 
              : "hover:ring-1 hover:ring-white/20"
          )}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};