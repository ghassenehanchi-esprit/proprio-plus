<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'title', 'sections'];

    protected $casts = [
        'sections' => 'array',
    ];

    protected $appends = ['photos'];

    public function images()
    {
        return $this->morphMany(File::class, 'fileable')->where('type', 'image');
    }

    public function photos(): Attribute
    {
        return Attribute::get(fn () => $this->images->pluck('url')->toArray());
    }
}
