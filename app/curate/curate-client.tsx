"use client";

import { useState } from "react";
import { SwipeCard } from "@/components/swipe-card";
import { upsertSelection } from "@/lib/actions/data";
import { AnimatePresence } from "framer-motion";

export function CurateClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (id: string, direction: "left" | "right") => {
    const status = direction === "right" ? "keep" : "discard";
    let comment = undefined;

    if (status === "keep") {
      const userInput = window.prompt("Add a memo for this item? (Optional)");
      if (userInput) comment = userInput;
    }
    
    // Optimistic update (just visually move to next)
    setItems((prev) => prev.filter((item) => item.id !== id));
    
    // Save to DB
    try {
      await upsertSelection(id, status, comment);
    } catch (error) {
      console.error("Failed to save selection:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-zinc-500 font-medium">All caught up!</p>
        <p className="text-xs text-zinc-400 underline">Tap Sync to check for more.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {items.map((item, index) => (
          index === 0 && (
            <SwipeCard 
              key={item.id} 
              item={item} 
              onSwipe={(dir) => handleSwipe(item.id, dir)} 
            />
          )
        ))}
      </AnimatePresence>
    </div>
  );
}
