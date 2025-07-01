<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'action', 'target_type', 'target_id', 'meta'];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
