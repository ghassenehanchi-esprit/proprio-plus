<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Favorite extends Pivot
{
    protected $table = 'favorites';

    protected $fillable = [
        'user_id',
        'listing_id',
    ];

    public $incrementing = false;

    public $timestamps = true;
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

}
