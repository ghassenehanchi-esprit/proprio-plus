<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description', 'icon_url'];

    public function listings() {
        return $this->hasMany(Listing::class);
    }
}
