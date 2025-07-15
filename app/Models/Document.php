<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Document extends Model
{
    protected $fillable = [
        'listing_id',
        'type',
        'name',
        'path',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    protected $appends = ['url'];

    public function url(): Attribute
    {
        return Attribute::get(fn () => '/storage/' . ltrim($this->path, '/'));
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
