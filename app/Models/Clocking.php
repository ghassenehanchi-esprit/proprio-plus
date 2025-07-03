<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clocking extends Model
{
    protected $fillable = [
        'user_id', 'clock_in_at', 'clock_out_at', 'note'
    ];

    protected $dates = ['clock_in_at', 'clock_out_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
