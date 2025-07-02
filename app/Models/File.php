<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = ['path', 'type', 'fileable_id', 'fileable_type'];

    protected $appends = ['url'];

    public function url(): Attribute
    {
        // Return a relative URL so the frontend can reference files in the
        // "public" directory without relying on the APP_URL configuration.
        return Attribute::get(fn () => '/storage/'.ltrim($this->path, '/'));
    }

    public function fileable()
    {
        return $this->morphTo();
    }
}
