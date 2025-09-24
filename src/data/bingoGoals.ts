export interface BingoGoal {
  id: string;
  text: string;
  category: string;
}

export const bingoGoals: BingoGoal[] = [
  // Finance (投資理財)
  { id: "1", text: "股票", category: "finance" },
  { id: "2", text: "加密貨幣", category: "finance" },
  { id: "3", text: "定期存款", category: "finance" },
  { id: "4", text: "基金", category: "finance" },
  { id: "5", text: "美股", category: "finance" },
  
  // Travel (夢想旅遊)
  { id: "6", text: "房地產", category: "travel" },
  { id: "7", text: "ETF", category: "finance" },
  { id: "8", text: "記帳", category: "lifestyle" },
  { id: "9", text: "期貨交易", category: "finance" },
  { id: "10", text: "股票配息", category: "finance" },
  
  // Lifestyle (生活享受)
  { id: "11", text: "貸款", category: "finance" },
  { id: "12", text: "儲蓄險", category: "finance" },
  { id: "13", text: "理財App", category: "lifestyle" },
  { id: "14", text: "外幣", category: "finance" },
  { id: "15", text: "信託", category: "finance" },
  
  // Learning (學習成長)
  { id: "16", text: "退休基金", category: "finance" },
  { id: "17", text: "資產配置", category: "finance" },
  { id: "18", text: "黃金投資", category: "finance" },
  { id: "19", text: "保險", category: "finance" },
  { id: "20", text: "數位資產", category: "finance" },
  
  // Relationships (人際關係)
  { id: "21", text: "當沖", category: "finance" },
  { id: "22", text: "緊急預備金", category: "finance" },
  { id: "23", text: "P2P借貸", category: "finance" },
  { id: "24", text: "債券", category: "finance" },
  { id: "25", text: "定額定投", category: "finance" },
];

export const categories = [
  { 
    id: "all", 
    name: "全部", 
    icon: "🎯", 
    className: "category-finance" 
  },
  { 
    id: "finance", 
    name: "投資理財", 
    icon: "💰", 
    className: "category-finance" 
  },
  { 
    id: "travel", 
    name: "夢想旅遊", 
    icon: "✈️", 
    className: "category-travel" 
  },
  { 
    id: "lifestyle", 
    name: "生活享受", 
    icon: "🍜", 
    className: "category-lifestyle" 
  },
  { 
    id: "learning", 
    name: "學習成長", 
    icon: "🦉", 
    className: "category-learning" 
  },
  { 
    id: "relationships", 
    name: "人際關係", 
    icon: "👥", 
    className: "category-relationships" 
  },
];