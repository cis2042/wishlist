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

// 顏色：1星藍、2星綠、3星黃（含邊框色）
const getRatingColor = (rating: number) => {
  switch (rating) {
    case 1:
      return "bg-blue-500 border-blue-400";
    case 2:
      return "bg-green-500 border-green-400";
    case 3:
      return "bg-yellow-500 border-yellow-400";
    default:
      return "bg-white/10 border-white/20";
  }
};

const getGlowShadow = (rating: number) => {
  switch (rating) {
    case 1:
      return "0 0 12px 4px rgba(59, 130, 246, 0.6)"; // blue glow
    case 2:
      return "0 0 12px 4px rgba(34, 197, 94, 0.6)"; // green glow
    case 3:
      return "0 0 12px 4px rgba(234, 179, 8, 0.6)"; // yellow glow
    default:
      return "none";
  }
};

const getRatingStars = (rating: number) => {
  const filledClass = "fill-white text-white";
  const unfilledClass = rating === 3 ? "text-black/40" : "text-white/50";

  return Array.from({ length: 3 }, (_, index) => (
    <Star
      key={index}
      className={cn(
        "w-3 h-3 transition-all duration-300 drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]",
        index < rating ? filledClass : unfilledClass
      )}
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
        "bingo-card relative w-full aspect-square min-h-0 group",
        "flex flex-col items-center justify-center text-center",
        "rounded-lg sm:rounded-xl border-2 animate-fade-in transition-all duration-300",
        "p-2 sm:p-3",
        getRatingColor(rating),
        rating === 3 ? "text-black" : rating > 0 ? "text-white" : "text-card-foreground",
        isLocked ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={{ 
        animationDelay: `${animationDelay}ms`, 
        backgroundImage: rating > 0 ? 'none' : undefined,
        boxShadow: isCompleted && rating > 0 ? getGlowShadow(rating) : undefined,
        transition: 'all 0.3s ease-in-out'
      }}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex-1 flex items-center justify-center mb-1 sm:mb-2 min-h-0">
        <span
          className={cn(
            "text-xs sm:text-sm font-medium leading-tight transition-all duration-300",
            "break-words hyphens-auto overflow-hidden",
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