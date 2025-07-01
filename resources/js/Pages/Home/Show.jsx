import MainLayout from '@/Components/Layout/MainLayout';

export default function Show({ listing }) {
  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <img src={listing.gallery?.[0]?.url || '/placeholder.png'} className="w-full h-64 object-cover rounded" />
        <h2 className="text-2xl font-bold mt-4">{listing.title}</h2>
        <p className="text-gray-600 mt-2">{listing.description}</p>
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
          <div>Ville : {listing.city}</div>
          <div>Surface : {listing.surface} m²</div>
          <div>Prix : {listing.price} €</div>
        </div>
        <div className="mt-6">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">Contacter le vendeur</button>
        </div>
      </div>
    </MainLayout>
  );
}
