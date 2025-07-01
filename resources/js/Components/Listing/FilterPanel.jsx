import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';

export default function FilterPanel({ onSearch }) {
  return (
    <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Input name="city" placeholder="Ville" />
      <Input name="min_price" type="number" placeholder="Prix min" />
      <Input name="max_price" type="number" placeholder="Prix max" />
      <Button type="submit">Rechercher</Button>
    </form>
  );
}
