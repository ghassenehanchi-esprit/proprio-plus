<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedSearch extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'params',
        'notify',
    ];

    protected $casts = [
        'params' => 'array',
        'notify' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
