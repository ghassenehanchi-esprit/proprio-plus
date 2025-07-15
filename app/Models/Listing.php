<?php
namespace App\Models;

use App\Enums\ListingStatus;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\DB;

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

    protected $casts = [
        'status' => ListingStatus::class,
    ];

    protected $appends = ['photos', 'score', 'similar_listings'];

    protected $withCount = [
        'conversations',
        'favoritedBy as favorites_count',
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

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function gallery() {
        return $this->morphMany(File::class, 'fileable')->where('type', 'image');
    }

    public function photos(): Attribute
    {
        return Attribute::get(fn () => $this->gallery->pluck('url')->toArray());
    }

    public function score(): Attribute
    {
        return Attribute::get(function () {
            $favorites = $this->favorites_count ?? $this->favoritedBy()->count();
            $conversations = $this->conversations_count ?? $this->conversations()->count();
            return $conversations * 2 + $favorites;
        });
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

        if (array_key_exists('has_garden', $filters)) {
            $query->where('has_garden', (bool) $filters['has_garden']);
        }

        if (!empty($filters['min_year_built'])) {
            $query->where('year_built', '>=', $filters['min_year_built']);
        }

        if (!empty($filters['max_year_built'])) {
            $query->where('year_built', '<=', $filters['max_year_built']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['lat']) && !empty($filters['lng'])) {
            $lat = $filters['lat'];
            $lng = $filters['lng'];
            $radius = $filters['radius'] ?? 10;

            if (DB::connection()->getDriverName() === 'sqlite') {
                $latDelta = $radius / 111;
                $lngDelta = $radius / (111 * max(cos(deg2rad($lat)), 0.00001));

                $query->whereBetween('latitude', [$lat - $latDelta, $lat + $latDelta])
                    ->whereBetween('longitude', [$lng - $lngDelta, $lng + $lngDelta])
                    ->orderByRaw('ABS(latitude - ?) + ABS(longitude - ?)', [$lat, $lng]);
            } else {
                $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude))))";

                $query->selectRaw("*, $haversine AS distance")
                    ->having('distance', '<=', $radius)
                    ->orderBy('distance');
            }
        }

        return $query;
    }
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function scopeWithFavoriteStatus($query, ?int $userId)
    {
        if ($userId) {
            $query->withExists(['favoritedBy as is_favorited' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        return $query;
    }

    public function scopeStatus($query, ListingStatus|string $status)
    {
        $status = $status instanceof ListingStatus ? $status->value : $status;
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $this->scopeStatus($query, ListingStatus::Active);
    }

    public function scopeSold($query)
    {
        return $this->scopeStatus($query, ListingStatus::Sold);
    }

    public function scopeArchived($query)
    {
        return $this->scopeStatus($query, ListingStatus::Archived);
    }

    public function matchesParams(array $params): bool
    {
        return self::query()
            ->where('id', $this->id)
            ->filter($params)
            ->exists();
    }

    public function similarityWith(self $other): float
    {
        $score = 0.0;
        if ($this->category_id === $other->category_id) {
            $score += 3;
        }
        if ($this->city === $other->city) {
            $score += 2;
        }

        if ($this->price && $other->price) {
            $diff = abs($this->price - $other->price) / max($this->price, $other->price);
            $score += (1 - min($diff, 1)) * 2;
        }

        foreach (['rooms', 'bedrooms', 'bathrooms'] as $attr) {
            if ($this->$attr && $other->$attr && abs($this->$attr - $other->$attr) <= 1) {
                $score += 1;
            }
        }

        foreach (['has_terrace', 'has_parking', 'has_garden'] as $attr) {
            if ($this->$attr && $other->$attr) {
                $score += 0.5;
            }
        }

        return $score;
    }

    public function similarListings(int $limit = 4)
    {
        $query = self::active()
            ->where('id', '!=', $this->id)
            ->with('category', 'user', 'gallery')
            ->withFavoriteStatus(auth()->id())
            ->where('category_id', $this->category_id)
            ->where('city', $this->city);

        $listings = $query->get();

        foreach ($listings as $listing) {
            $listing->similarity = $this->similarityWith($listing);
        }

        return $listings->sortByDesc('similarity')->take($limit)->values();
    }

    public function getSimilarListingsAttribute()
    {
        return $this->similarListings();
    }


}

