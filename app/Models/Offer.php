<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'listing_id',
        'user_id',
        'visit_id',
        'price',
        'message',
        'buyer_notary',
        'seller_notary',
        'status',
        'accepted_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'price' => 'decimal:2',
    ];

    public function listing() { return $this->belongsTo(Listing::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function visit() { return $this->belongsTo(Visit::class); }
}

