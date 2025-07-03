<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Appartement',
                'description' => 'Logements en immeuble',
                'icon_url' => 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/building-skyscraper.svg',
            ],
            [
                'name' => 'Studio',
                'description' => 'Petit logement individuel',
                'icon_url' => 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/home-door.svg',
            ],
            [
                'name' => 'Maison',
                'description' => 'Habitation familiale',
                'icon_url' => 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/home.svg',
            ],
            [
                'name' => 'Loft',
                'description' => 'Espace ouvert et moderne',
                'icon_url' => 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/home-2.svg',
            ],
            [
                'name' => 'Entrepôt',
                'description' => 'Espace de stockage ou industriel',
                'icon_url' => 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/building-warehouse.svg',
            ],
        ];

        foreach ($categories as $data) {
            Category::updateOrCreate(['name' => $data['name']], $data);
        }
    }
}
