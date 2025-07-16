<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class TransactionRating extends Model
{
    protected $fillable = [
        'listing_id',
        'offer_id',
        'rater_id',
        'rated_id',
        'communication',
        'punctuality',
        'professionalism',
        'comment',
    ];

    protected $appends = ['average'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function rated()
    {
        return $this->belongsTo(User::class, 'rated_id');
    }

    public function average(): Attribute
    {
        return Attribute::get(fn () => round(($this->communication + $this->punctuality + $this->professionalism) / 3, 1));
    }
}
