import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortOption = "latest" | "rating" | "a-z";

interface EbooksHeaderProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const EbooksHeader = ({ sortBy, onSortChange }: EbooksHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">E-books</h1>
        <p className="text-i2know-text-secondary">
          Explore nossa biblioteca digital e expanda seu conhecimento
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-i2know-text-secondary">Sort by:</span>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[180px] bg-[#2C2C2C] border-none text-white rounded-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2C] border-none">
              <SelectItem value="latest" className="text-white">Latest</SelectItem>
              <SelectItem value="rating" className="text-white">Rating</SelectItem>
              <SelectItem value="a-z" className="text-white">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EbooksHeader;