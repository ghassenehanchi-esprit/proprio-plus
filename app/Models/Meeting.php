<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $fillable = [
        'conversation_id',
        'scheduled_at',
        'type',
        'agenda',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
