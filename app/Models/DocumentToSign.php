<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentToSign extends Model
{
    protected $fillable = ['listing_id', 'type', 'status', 'approved_at', 'approved_by'];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function approvedBy() {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function signatures() {
        return $this->hasMany(Signature::class);
    }
}
