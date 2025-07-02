import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';

export default function Form({ listing = {}, onSubmit }) {
  return (
      <form onSubmit={onSubmit} className="grid gap-4 max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Ajouter / Modifier une annonce</h2>
        <Input name="title" placeholder="Titre" defaultValue={listing.title} />
        <Input name="city" placeholder="Ville" defaultValue={listing.city} />
        <Input name="price" type="number" placeholder="Prix" defaultValue={listing.price} />
        <Input name="surface" type="number" placeholder="Surface en m²" defaultValue={listing.surface} />
        <textarea name="description" placeholder="Description" defaultValue={listing.description} className="border p-2 rounded" />
        <Button type="submit">Enregistrer</Button>
      </form>
  );
}
