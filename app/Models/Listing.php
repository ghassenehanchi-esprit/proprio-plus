<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'surface',
        'rooms',
        'bedrooms',
        'bathrooms',
        'floor',
        'total_floors',
        'year_built',
        'heating',
        'has_garden',
        'has_terrace',
        'has_parking',
        'city',
        'postal_code',
        'address',
        'latitude',
        'longitude',
        'status',
        'user_id',
        'category_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function conversations() {
        return $this->hasMany(Conversation::class);
    }

    public function visits() {
        return $this->hasMany(Visit::class);
    }

    public function documentsToSign() {
        return $this->hasMany(DocumentToSign::class);
    }

    public function documents() {
        return $this->morphMany(File::class, 'fileable')->where('type', 'document');
    }

    public function gallery() {
        return $this->morphMany(File::class, 'fileable')->where('type', 'image');
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (!empty($filters['postal_code'])) {
            $query->where('postal_code', $filters['postal_code']);
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (!empty($filters['min_surface'])) {
            $query->where('surface', '>=', $filters['min_surface']);
        }

        if (!empty($filters['max_surface'])) {
            $query->where('surface', '<=', $filters['max_surface']);
        }

        if (!empty($filters['rooms'])) {
            $query->where('rooms', '>=', $filters['rooms']);
        }

        if (!empty($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }

        if (array_key_exists('has_terrace', $filters)) {
            $query->where('has_terrace', (bool) $filters['has_terrace']);
        }

        if (array_key_exists('has_parking', $filters)) {
            $query->where('has_parking', (bool) $filters['has_parking']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['lat']) && !empty($filters['lng'])) {
            $lat = $filters['lat'];
            $lng = $filters['lng'];
            $radius = $filters['radius'] ?? 10;

            $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude))))";

            $query->selectRaw("*, $haversine AS distance")
                ->having("distance", "<=", $radius)
                ->orderBy("distance");
        }

        return $query;
    }
    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }


}

