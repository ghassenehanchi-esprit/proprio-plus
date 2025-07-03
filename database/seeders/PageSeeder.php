<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            ['slug' => 'about-us', 'title' => 'À propos', 'content' => ''],
            ['slug' => 'code-of-conduct', 'title' => 'Code de conduite', 'content' => ''],
            ['slug' => 'reglements', 'title' => 'Règlements', 'content' => ''],
        ];

        foreach ($pages as $data) {
            Page::firstOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
