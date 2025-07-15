<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = ['listing_id', 'user_id', 'visit_datetime', 'status', 'mode', 'buyer_confirmed_at', 'seller_confirmed_at', 'seller_comment', 'rating', 'feedback'];

    protected $casts = [
        'visit_datetime' => 'datetime',
        'buyer_confirmed_at' => 'datetime',
        'seller_confirmed_at' => 'datetime',
    ];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
