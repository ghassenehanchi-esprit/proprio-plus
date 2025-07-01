<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentToSign extends Model
{
    protected $fillable = ['listing_id', 'type', 'status'];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function signatures() {
        return $this->hasMany(Signature::class);
    }
}
