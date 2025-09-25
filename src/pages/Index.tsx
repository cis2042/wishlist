import { useState } from "react";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { BingoGrid } from "@/components/BingoGrid";
import { categories, getAllGoals } from "@/data/bingoGoals";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [goalRatings, setGoalRatings] = useState<Map<string, number>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [completedBingos, setCompletedBingos] = useState<Set<string>>(new Set());
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
    const currentBingoKey = getCurrentBingoKey();
    const goals = getCurrentGoals();
    
    // Only clear ratings for goals in the current bingo
    const newRatings = new Map(goalRatings);
    goals.forEach(goal => {
      newRatings.delete(goal.id);
    });
    
    setGoalRatings(newRatings);
    const newCompleted = new Set(completedBingos);
    newCompleted.delete(currentBingoKey);
    setCompletedBingos(newCompleted);
    toast({
      title: "重置完成",
      description: "所有目標已重置，重新開始吧！",
    });
  };

  const handleComplete = () => {
    const currentBingoKey = getCurrentBingoKey();
    const newCompleted = new Set(completedBingos);
    newCompleted.add(currentBingoKey);
    setCompletedBingos(newCompleted);
    toast({
      title: "賓果完成！",
      description: "恭喜完成這個賓果卡！",
    });
  };

  const getCurrentBingoKey = () => {
    if (!selectedCategory) return '';
    return selectedSubcategory ? `${selectedCategory}-${selectedSubcategory}` : selectedCategory;
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

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
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

  const getCompletionStatus = () => {
    const status = new Map<string, { completed: number; total: number }>();
    
    categories.forEach(category => {
      if (category.subcategories) {
        let completedSubs = 0;
        category.subcategories.forEach(sub => {
          const subKey = `${category.id}-${sub.id}`;
          const isCompleted = completedBingos.has(subKey);
          status.set(subKey, { completed: isCompleted ? 1 : 0, total: 1 });
          if (isCompleted) completedSubs++;
        });
        status.set(category.id, { completed: completedSubs, total: category.subcategories.length });
      } else {
        const isCompleted = completedBingos.has(category.id);
        status.set(category.id, { completed: isCompleted ? 1 : 0, total: 1 });
      }
    });
    
    return status;
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
          completionStatus={getCompletionStatus()}
        />
      ) : (
        currentCategory && (
          <BingoGrid
            goals={getCurrentGoals()}
            ratings={goalRatings}
            onGoalClick={handleGoalClick}
            onReset={handleReset}
            onBack={handleBack}
            onBackToHome={handleBackToHome}
            category={currentCategory}
            subcategoryName={getCurrentSubcategoryName()}
            gridSize={getCurrentGridSize()}
            isCompleted={completedBingos.has(getCurrentBingoKey())}
            onComplete={handleComplete}
          />
        )
      )}
    </div>
  );
};

export default Index;