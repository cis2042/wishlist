import { useState } from "react";
import { BingoCard } from "@/components/BingoCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProgressBar } from "@/components/ProgressBar";
import { bingoGoals, categories } from "@/data/bingoGoals";
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  const handleGoalClick = (goalId: string) => {
    const newCompleted = new Set(completedGoals);
    if (completedGoals.has(goalId)) {
      newCompleted.delete(goalId);
    } else {
      newCompleted.add(goalId);
      toast({
        title: "目標完成！",
        description: "又完成了一個目標，繼續加油！",
      });
    }
    setCompletedGoals(newCompleted);
  };

  const handleReset = () => {
    setCompletedGoals(new Set());
    toast({
      title: "重置完成",
      description: "所有目標已重置，重新開始吧！",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '許願BINGO',
          text: `我在許願BINGO完成了 ${completedGoals.size}/25 個目標！`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享取消');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "連結已複製",
        description: "分享連結已複製到剪貼簿！",
      });
    }
  };

  const filteredGoals = activeCategory === "all" 
    ? bingoGoals 
    : bingoGoals.filter(goal => goal.category === activeCategory);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Floating decorative elements */}
        <div className="fixed top-10 left-10 text-4xl animate-float">🦁</div>
        <div className="fixed top-20 right-16 text-3xl animate-float" style={{ animationDelay: '1s' }}>🐘</div>
        <div className="fixed bottom-32 left-8 text-3xl animate-float" style={{ animationDelay: '2s' }}>🦒</div>
        <div className="fixed bottom-20 right-12 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🦊</div>
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            許願BINGO
          </h1>
          <ProgressBar 
            progress={completedGoals.size} 
            total={bingoGoals.length}
            className="max-w-md mx-auto mb-6"
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Bingo Grid */}
        <div className="grid grid-cols-5 gap-3 md:gap-4 mb-8 animate-scale-in">
          {Array.from({ length: 25 }, (_, index) => {
            const goal = bingoGoals[index];
            if (!goal) return null;
            
            return (
              <BingoCard
                key={goal.id}
                goal={goal.text}
                category={goal.category}
                completed={completedGoals.has(goal.id)}
                onClick={() => handleGoalClick(goal.id)}
                animationDelay={index * 50}
              />
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新開始
          </Button>
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;