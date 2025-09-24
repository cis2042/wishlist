import { useState } from "react";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { BingoGrid } from "@/components/BingoGrid";
import { categories, getAllGoals } from "@/data/bingoGoals";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [goalRatings, setGoalRatings] = useState<Map<string, number>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGoalClick = (goalId: string) => {
    const currentRating = goalRatings.get(goalId) || 0;
    const newRating = currentRating >= 3 ? 0 : currentRating + 1;
    
    const newRatings = new Map(goalRatings);
    if (newRating === 0) {
      newRatings.delete(goalId);
    } else {
      newRatings.set(goalId, newRating);
      
      const starText = newRating === 1 ? "1星" : newRating === 2 ? "2星" : "3星";
      toast({
        title: `目標達成 ${starText}！`,
        description: "繼續努力實現更多目標！",
      });
    }
    
    setGoalRatings(newRatings);
  };

  const handleReset = () => {
    setGoalRatings(new Map());
    toast({
      title: "重置完成",
      description: "所有目標已重置，重新開始吧！",
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const currentCategory = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;
  const isShowingGrid = selectedCategory && (!currentCategory?.subcategories || selectedSubcategory);

  const getCurrentGoals = () => {
    if (!selectedCategory) return [];
    return getAllGoals(selectedCategory, selectedSubcategory || undefined);
  };

  const getCurrentGridSize = () => {
    if (!currentCategory) return 5;
    if (selectedSubcategory && currentCategory.subcategories) {
      const subcategory = currentCategory.subcategories.find(s => s.id === selectedSubcategory);
      return subcategory?.gridSize || 4;
    }
    return currentCategory.gridSize;
  };

  const getCurrentSubcategoryName = () => {
    if (!selectedSubcategory || !currentCategory?.subcategories) return undefined;
    const subcategory = currentCategory.subcategories.find(s => s.id === selectedSubcategory);
    return subcategory?.name;
  };

  return (
    <div className="min-h-screen p-4">
      {/* Floating decorative elements */}
      <div className="fixed top-10 left-10 text-4xl animate-float">🦁</div>
      <div className="fixed top-20 right-16 text-3xl animate-float" style={{ animationDelay: '1s' }}>🐘</div>
      <div className="fixed bottom-32 left-8 text-3xl animate-float" style={{ animationDelay: '2s' }}>🦒</div>
      <div className="fixed bottom-20 right-12 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🦊</div>
      
      {!isShowingGrid ? (
        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          onBack={handleBack}
        />
      ) : (
        currentCategory && (
          <BingoGrid
            goals={getCurrentGoals()}
            ratings={goalRatings}
            onGoalClick={handleGoalClick}
            onReset={handleReset}
            onBack={handleBack}
            category={currentCategory}
            subcategoryName={getCurrentSubcategoryName()}
            gridSize={getCurrentGridSize()}
          />
        )
      )}
    </div>
  );
};

export default Index;