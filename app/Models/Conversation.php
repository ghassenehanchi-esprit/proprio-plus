<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use App\Policies\ConversationPolicy;

#[UsePolicy(ConversationPolicy::class)]
class Conversation extends Model
{
    protected $fillable = ['listing_id', 'seller_id', 'buyer_id', 'is_blocked', 'subject'];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}
