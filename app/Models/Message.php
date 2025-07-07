<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'file',
        'is_read'
    ];

    protected $appends = ['file_url'];

    public function conversation() {
        return $this->belongsTo(Conversation::class);
    }

    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function getFileUrlAttribute()
    {
        return $this->file ? '/storage/' . ltrim($this->file, '/') : null;
    }
}
