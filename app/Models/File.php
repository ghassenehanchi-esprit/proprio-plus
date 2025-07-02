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
        return Attribute::get(fn () => Storage::url($this->path));
    }

    public function fileable()
    {
        return $this->morphTo();
    }
}
