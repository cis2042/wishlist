import { BingoCard } from "@/components/BingoCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { BingoGoal, BingoCategory } from "@/data/bingoGoals";
import { ArrowLeft, RotateCcw, Share2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BingoGridProps {
  goals: BingoGoal[];
  ratings: Map<string, number>;
  onGoalClick: (goalId: string) => void;
  onReset: () => void;
  onBack: () => void;
  category: BingoCategory;
  subcategoryName?: string;
  gridSize: number;
  isCompleted: boolean;
  onComplete: () => void;
}

export const BingoGrid = ({
  goals,
  ratings,
  onGoalClick,
  onReset,
  onBack,
  category,
  subcategoryName,
  gridSize,
  isCompleted,
  onComplete,
}: BingoGridProps) => {
  const { toast } = useToast();
  
  const completedCount = Array.from(ratings.values()).filter(rating => rating > 0).length;
  const totalCount = gridSize * gridSize;

  const handleShare = async () => {
    const categoryName = subcategoryName || category.name;
    const shareText = `我在${categoryName}許願BINGO完成了 ${completedCount}/${totalCount} 個目標！`;
    const shareUrl = window.location.href;
    
    // Try Instagram sharing first
    const instagramUrl = `https://www.instagram.com/stories/camera/?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '許願BINGO',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to Instagram or clipboard
        try {
          window.open(instagramUrl, '_blank');
        } catch {
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: "連結已複製",
            description: "分享連結已複製到剪貼簿！",
          });
        }
      }
    } else {
      try {
        window.open(instagramUrl, '_blank');
      } catch {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "連結已複製",
          description: "分享連結已複製到剪貼簿！",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg flex items-center justify-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          {subcategoryName || category.name}
        </h1>
      </div>

      {/* Bingo Grid */}
      <div 
        className={cn(
          "grid gap-3 md:gap-4 mb-8 animate-scale-in",
          gridSize === 4 && "grid-cols-4",
          gridSize === 5 && "grid-cols-5"
        )}
      >
        {Array.from({ length: totalCount }, (_, index) => {
          const goal = goals[index];
          if (!goal) return (
            <div key={`empty-${index}`} className="aspect-square" />
          );
          
          return (
            <BingoCard
              key={goal.id}
              goal={goal.text}
              category={goal.category}
              rating={ratings.get(goal.id) || 0}
              onClick={() => onGoalClick(goal.id)}
              animationDelay={index * 50}
              isCompleted={isCompleted}
              isLocked={isCompleted}
            />
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center animate-fade-in" style={{ animationDelay: '500ms' }}>
        <Button
          variant="secondary"
          onClick={isCompleted ? onReset : onComplete}
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新開始
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              完成賓果
            </>
          )}
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
  );
};