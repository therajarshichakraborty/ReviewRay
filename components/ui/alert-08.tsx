"use client";

import { useState, useRef, useEffect } from "react";
import { Command, Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandOption {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
}

interface Alert08Props {
  placeholder?: string;
  options?: CommandOption[];
  onSelect?: (option: CommandOption) => void;
  onDismiss?: () => void;
  className?: string;
}

const defaultOptions: CommandOption[] = [
  { id: "search", label: "Search documentation", shortcut: "⌘K" },
  { id: "new", label: "Create new project", shortcut: "⌘N" },
  { id: "settings", label: "Open settings", shortcut: "⌘," },
  { id: "theme", label: "Toggle theme", shortcut: "⌘T" },
];

export default function Alert08({
  placeholder = "Type a command or search...",
  options = defaultOptions,
  onSelect,
  onDismiss,
  className,
}: Alert08Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 150);
  };

  const handleSelect = (option: CommandOption) => {
    onSelect?.(option);
    handleDismiss();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleDismiss();
        break;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden",
          "bg-white dark:bg-zinc-900",
          "border border-zinc-200 dark:border-zinc-800",
          "shadow-2xl shadow-zinc-300/50 dark:shadow-zinc-950/50",
          "transition-all duration-150",
          isExiting && "opacity-0 scale-95",
        )}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "flex-1 bg-transparent text-sm",
              "text-zinc-900 dark:text-zinc-100",
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
              "focus:outline-none",
            )}
          />
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              ESC
            </kbd>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto py-2">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <div role="listbox">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-2.5",
                    "text-left transition-colors duration-75",
                    "focus:outline-none",
                    index === selectedIndex
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                  )}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                      <Command className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{option.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {option.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
                        {option.shortcut}
                      </kbd>
                    )}
                    {index === selectedIndex && (
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px]">
                  ↑
                </kbd>
                <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px]">
                  ↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px]">
                  ↵
                </kbd>
                to select
              </span>
            </div>
            <span>{filteredOptions.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  );
}
