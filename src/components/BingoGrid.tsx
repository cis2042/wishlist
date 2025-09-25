import { BingoCard } from "@/components/BingoCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { BingoGoal, BingoCategory } from "@/data/bingoGoals";
import { ArrowLeft, RotateCcw, Share2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import { shareToInstagramStory } from "@/utils/instagramShare";

interface BingoGridProps {
  goals: BingoGoal[];
  ratings: Map<string, number>;
  onGoalClick: (goalId: string) => void;
  onReset: () => void;
  onBack: () => void;
  onBackToHome: () => void;
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
  onBackToHome,
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
    
    try {
      toast({
        title: "正在準備分享...",
        description: "即將打開 Instagram Story",
      });

      // Capture screenshot of the bingo grid
      const bingoElement = document.querySelector('.bingo-container') as HTMLElement;
      if (!bingoElement) {
        throw new Error('Bingo container not found');
      }

      const canvas = await html2canvas(bingoElement, {
        backgroundColor: '#1a1a2e', // Match the app background
        scale: 2, // Higher quality for mobile
        useCORS: true,
        allowTaint: true,
        width: bingoElement.offsetWidth,
        height: bingoElement.offsetHeight,
      });

      // Try to share directly to Instagram Story
      const success = await shareToInstagramStory(canvas);
      
      if (success) {
        toast({
          title: "成功！",
          description: "已打開 Instagram Story，請完成發布",
        });
      } else {
        toast({
          title: "已打開 Instagram",
          description: "請手動上傳剛下載的圖片到 Story",
        });
      }
      
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "分享失敗",
        description: "請確保已安裝 Instagram App",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bingo-container">
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
          "grid gap-2 sm:gap-3 md:gap-4 mb-8 animate-scale-in mx-auto max-w-lg md:max-w-2xl",
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
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center animate-fade-in px-4" style={{ animationDelay: '500ms' }}>
        <Button
          variant="secondary"
          onClick={isCompleted ? onReset : onComplete}
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm text-sm sm:text-base min-h-[44px] flex-1 sm:flex-none"
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
          onClick={onBackToHome}
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm text-sm sm:text-base min-h-[44px] flex-1 sm:flex-none"
        >
          再玩一張BINGO
        </Button>
        <Button
          onClick={handleShare}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg text-sm sm:text-base min-h-[44px] flex-1 sm:flex-none"
        >
          <Share2 className="w-4 h-4 mr-2" />
          分享
        </Button>
      </div>
    </div>
  );
};