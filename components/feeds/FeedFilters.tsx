"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface FeedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  query: string;
  feedType: "all" | "rss" | "email" | "news" | "daily-updates" | "social" | "patch";
  dateFrom?: string;
  dateTo?: string;
}

export function FeedFilters({ onFilterChange }: FeedFiltersProps) {
  const [query, setQuery] = useState("");
  const [feedType, setFeedType] = useState<FilterState["feedType"]>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = () => {
    onFilterChange({
      query: query.trim(),
      feedType,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  };

  const handleClear = () => {
    setQuery("");
    setFeedType("all");
    setDateFrom("");
    setDateTo("");
    onFilterChange({
      query: "",
      feedType: "all",
    });
  };

  const hasActiveFilters = query || feedType !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search feeds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          size="sm"
          className="cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Search className="h-3 w-3 mr-2" />
          Search
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Type Filters */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">Type:</span>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={feedType === "all" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-xs font-medium"
            onClick={() => setFeedType("all")}
          >
            All
          </Badge>
          <Badge
            variant={feedType === "rss" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "rss"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200 dark:border-orange-800"
            }`}
            onClick={() => setFeedType("rss")}
          >
            RSS
          </Badge>
          <Badge
            variant={feedType === "email" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "email"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            }`}
            onClick={() => setFeedType("email")}
          >
            Email
          </Badge>
          <Badge
            variant={feedType === "news" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "news"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800"
            }`}
            onClick={() => setFeedType("news")}
          >
            News
          </Badge>
          <Badge
            variant={feedType === "daily-updates" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "daily-updates"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-200 dark:border-green-800"
            }`}
            onClick={() => setFeedType("daily-updates")}
          >
            Daily Updates
          </Badge>
          <Badge
            variant={feedType === "social" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "social"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800"
            }`}
            onClick={() => setFeedType("social")}
          >
            Social
          </Badge>
          <Badge
            variant={feedType === "patch" ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs font-medium ${
              feedType === "patch"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400 border-violet-200 dark:border-violet-800"
            }`}
            onClick={() => setFeedType("patch")}
          >
            Patch
          </Badge>
        </div>
      </div>

      {/* Date Filters */}
      <div className="space-y-3 pt-2">
        <div className="space-y-2">
          <label htmlFor="dateFrom" className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 block">
            From:
          </label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="dateTo" className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 block">
            To:
          </label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
