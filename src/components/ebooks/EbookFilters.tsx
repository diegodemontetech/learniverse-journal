import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface EbookFiltersProps {
  categories?: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const EbookFilters = ({ categories, selectedCategory, onCategoryChange }: EbookFiltersProps) => {
  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'secondary'}
        className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap ${
          selectedCategory === 'all' 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
        }`}
        onClick={() => onCategoryChange('all')}
      >
        Todos os E-books
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'secondary'}
          className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap ${
            selectedCategory === category.id 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default EbookFilters;