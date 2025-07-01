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
    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }


}
