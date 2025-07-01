<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = ['listing_id', 'user_id', 'visit_datetime', 'status', 'mode'];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
