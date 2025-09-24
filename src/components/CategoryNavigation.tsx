import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BingoCategory } from "@/data/bingoGoals";

interface CategoryNavigationProps {
  categories: BingoCategory[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onBack: () => void;
  completionStatus: Map<string, { completed: number; total: number }>;
}

export const CategoryNavigation = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  onBack,
  completionStatus,
}: CategoryNavigationProps) => {
  // 主類別選擇畫面
  if (!selectedCategory) {
    return (
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
          許願BINGO
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "p-8 rounded-2xl font-bold text-xl transition-all duration-300",
                "border border-white/20 backdrop-blur-sm",
                "hover:scale-105 hover:shadow-2xl",
                "flex flex-col items-center gap-4",
                category.className
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              <span className="text-4xl">{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs font-medium text-white/70">
                {completionStatus.get(category.id)?.completed || 0}/{completionStatus.get(category.id)?.total || (category.subcategories?.length || 1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === selectedCategory);
  
  // 子類別選擇畫面
  if (currentCategory?.subcategories && !selectedSubcategory) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主選單
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <span className="text-3xl">{currentCategory.icon}</span>
            {currentCategory.name}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {currentCategory.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              className={cn(
                "p-6 rounded-2xl font-bold text-lg transition-all duration-300",
                "border border-white/20 backdrop-blur-sm",
                "hover:scale-105 hover:shadow-xl",
                "flex flex-col items-center gap-3",
                currentCategory.className
              )}
              onClick={() => onSubcategorySelect(subcategory.id)}
            >
              <span>{subcategory.name}</span>
              <span className="text-xs font-medium text-white/70">
                {completionStatus.get(`${selectedCategory}-${subcategory.id}`)?.completed || 0}/1
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};