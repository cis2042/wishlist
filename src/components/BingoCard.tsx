import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface BingoCardProps {
  goal: string;
  category: string;
  rating: number; // 0, 1, 2, 3
  onClick: () => void;
  animationDelay?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

// 顏色：1星紫、2星綠、3星黃（含邊框色）
const getRatingColor = (rating: number) => {
  switch (rating) {
    case 1:
      return "bg-purple-500 border-purple-400";
    case 2:
      return "bg-green-500 border-green-400";
    case 3:
      return "bg-yellow-500 border-yellow-400";
    default:
      return "bg-white/10 border-white/20";
  }
};

const getRatingStars = (rating: number) => {
  const getStarColor = (starIndex: number, currentRating: number) => {
    if (starIndex >= currentRating) {
      // 未填滿的星：黃色底時用深色，其餘用白色半透明
      return currentRating === 3 ? "text-black/40" : "text-white/40";
    }
    // 已填滿的星：黃色底用黑色，其餘用白色
    return currentRating === 3 ? "fill-black text-black" : "fill-white text-white";
  };

  return Array.from({ length: 3 }, (_, index) => (
    <Star
      key={index}
      className={cn("w-3 h-3 transition-all duration-300", getStarColor(index, rating))}
    />
  ));
};

export const BingoCard = ({
  goal,
  category,
  rating,
  onClick,
  animationDelay = 0,
  isCompleted = false,
  isLocked = false,
}: BingoCardProps) => {
  return (
    <div
      className={cn(
        "bingo-card relative aspect-square p-3 group",
        "flex flex-col items-center justify-center text-center",
        "rounded-xl border-2 animate-fade-in transition-all duration-300",
        getRatingColor(rating),
        rating > 0 ? "text-white" : "text-card-foreground",
        isLocked ? "cursor-not-allowed" : "cursor-pointer",
        isCompleted && rating > 0 && "animate-pulse shadow-lg shadow-current/50"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex-1 flex items-center justify-center mb-2">
        <span
          className={cn(
            "text-xs font-medium leading-tight transition-all duration-300",
            rating > 0 ? "font-semibold" : undefined
          )}
        >
          {goal}
        </span>
      </div>

      {rating > 0 && <div className="flex gap-0.5">{getRatingStars(rating)}</div>}

      {/* 只有未選取時顯示淡色懸停浮層，避免覆蓋色塊 */}
      {rating === 0 && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100",
            "bg-gradient-to-br from-primary/5 to-accent/5"
          )}
        />
      )}
    </div>
  );
};
