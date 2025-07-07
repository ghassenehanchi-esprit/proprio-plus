<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'about-us',
                'title' => 'À propos',
                'sections' => [
                    [
                        'id' => 'intro',
                        'text' => 'Bienvenue sur ProprioPlus, la plateforme immobilière de confiance.',
                        'image' => '/images/hero.png',
                    ],
                    [
                        'id' => 'mission',
                        'text' => 'Notre mission est de connecter acheteurs et vendeurs efficacement.',
                        'image' => '/images/auth-back.png',
                    ],
                ],
            ],
            [
                'slug' => 'code-of-conduct',
                'title' => 'Code de conduite',
                'sections' => [
                    [
                        'id' => 'rules',
                        'text' => 'Nous attendons de tous nos utilisateurs un comportement respectueux.',
                        'image' => '/images/auth-back.png',
                    ],
                ],
            ],
            [
                'slug' => 'reglements',
                'title' => 'Règlements',
                'sections' => [
                    [
                        'id' => 'rules',
                        'text' => 'Consultez nos règlements pour utiliser la plateforme.',
                        'image' => '/images/auth-back.png',
                    ],
                ],
            ],
            [
                'slug' => 'faq',
                'title' => 'FAQ',
                'sections' => [
                    [
                        'id' => 'intro',
                        'text' => 'Questions fréquemment posées à propos du service.',
                        'image' => '/images/auth-back.png',
                    ],
                ],
            ],
        ];

        foreach ($pages as $data) {
            Page::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
