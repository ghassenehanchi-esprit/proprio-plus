<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use App\Policies\ConversationPolicy;

#[UsePolicy(ConversationPolicy::class)]
class Conversation extends Model
{
    protected $fillable = ['listing_id', 'seller_id', 'buyer_id', 'is_blocked', 'is_closed', 'subject'];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function seller() {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function messages() {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }
}
