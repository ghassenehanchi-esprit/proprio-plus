<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'surface' => 'required|numeric|min:1',
            'rooms' => 'required|integer|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer',
            'total_floors' => 'nullable|integer',
            'year_built' => 'nullable|integer',
            'heating' => 'nullable|string|max:50',
            'has_garden' => 'nullable|boolean',
            'has_terrace' => 'nullable|boolean',
            'has_parking' => 'nullable|boolean',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:4096',
            'gallery.*' => 'nullable|image|max:4096',
        ];
    }
}
