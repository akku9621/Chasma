import React from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Search, Grid, List, SortAsc } from "lucide-react";

export default function SearchHeader({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange, 
  totalProducts 
}) {
  return (
    <section className="glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-glow">
            Discover Your Perfect Vision
          </h1>
          <p className="text-xl text-gray-300">
            {totalProducts} premium goggles waiting for you
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search goggles, features, brands..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass-effect border-white/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:glow-effect"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass-effect p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={viewMode === "grid" ? "bg-cyan-600 text-white" : "text-gray-300 hover:text-white"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className={viewMode === "list" ? "bg-cyan-600 text-white" : "text-gray-300 hover:text-white"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40 glass-effect border-white/30 text-white">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}