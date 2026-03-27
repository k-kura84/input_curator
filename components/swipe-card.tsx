"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SwipeCardProps {
  item: any;
  onSwipe: (direction: "left" | "right") => void;
}

export function SwipeCard({ item, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const [exitDirection, setExitDirection] = useState<number>(0);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitDirection(500);
      onSwipe("right");
    } else if (info.offset.x < -100) {
      setExitDirection(-500);
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, position: "absolute", width: "100%", maxWidth: "400px" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitDirection !== 0 ? { x: exitDirection, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="h-[500px] flex flex-col shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {item.sources?.name || "Feed"}
            </Badge>
            <span className="text-[10px] text-zinc-500">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-xl font-bold leading-tight line-clamp-3 my-2">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-[8] leading-relaxed">
            {item.content}
          </p>
        </CardContent>
        <CardFooter className="border-t bg-zinc-50/50 dark:bg-zinc-900/50 p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-red-500 font-bold text-xs">
              <X className="h-4 w-4" /> DISCARD
            </div>
          </div>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          <div className="flex gap-4 text-right">
            <div className="flex items-center gap-1 text-green-500 font-bold text-xs text-right">
              KEEP <Check className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
