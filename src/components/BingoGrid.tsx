import { BingoCard } from "@/components/BingoCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { BingoGoal, BingoCategory } from "@/data/bingoGoals";
import { ArrowLeft, RotateCcw, Share2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

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
    
    try {
      // Capture screenshot of the bingo grid
      const bingoElement = document.querySelector('.bingo-container') as HTMLElement;
      if (!bingoElement) {
        throw new Error('Bingo container not found');
      }

      toast({
        title: "正在生成圖片...",
        description: "請稍候，正在準備分享內容",
      });

      const canvas = await html2canvas(bingoElement, {
        backgroundColor: 'transparent',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png', 0.9);
      });

      if (Capacitor.isNativePlatform()) {
        // Convert blob to base64 for native sharing
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          
          try {
            await Share.share({
              title: '許願BINGO',
              text: shareText,
              files: [base64Data],
              dialogTitle: '分享到 Instagram Stories'
            });
          } catch (error) {
            console.error('Native share failed:', error);
            toast({
              title: "分享失敗",
              description: "無法打開分享選項，請稍後再試",
            });
          }
        };
        reader.readAsDataURL(imageBlob);
      } else {
        // Web fallback - try native web share API with image
        if (navigator.share && navigator.canShare) {
          const file = new File([imageBlob], 'bingo-share.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: '許願BINGO',
                text: shareText,
                files: [file],
              });
              return;
            } catch (error) {
              console.log('Web share with image failed, trying fallback');
            }
          }
        }
        
        // Final fallback - download image and copy text
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bingo-share.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Copy share text to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "圖片已下載",
            description: "分享文字已複製到剪貼簿，請手動上傳圖片到 Instagram Stories",
          });
        } catch {
          toast({
            title: "圖片已下載",
            description: "請手動分享圖片和文字到 Instagram Stories",
          });
        }
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      toast({
        title: "截圖失敗",
        description: "無法生成分享圖片，請稍後再試",
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