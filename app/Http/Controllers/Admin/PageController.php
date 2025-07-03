<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::all(['id', 'title', 'slug']);
        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page->load('images'),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'sections' => 'nullable',
            'images.*' => 'image',
        ]);

        if (isset($data['sections']) && is_string($data['sections'])) {
            $data['sections'] = json_decode($data['sections'], true);
        }

        $page->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('page_images', 'public');
                $page->images()->create(['path' => $path, 'type' => 'image']);
            }
        }

        return redirect()->back()->with('success', 'Page mise à jour');
    }
}
