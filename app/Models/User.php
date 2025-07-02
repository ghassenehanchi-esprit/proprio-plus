<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'password',
        'certification_status', 'identity_document', 'certification_date'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'certification_date' => 'datetime',
    ];

    protected $appends = ['last_active_at'];

    public function scopeWithBasicInfo($query)
    {
        return $query->select('id', 'first_name', 'last_name', 'email', 'phone');
    }
    public function favorites()
    {
        return $this->belongsToMany(Listing::class, 'favorites')->withTimestamps();
    }
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }


    public function signatures()
    {
        return $this->hasMany(Signature::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }


    public function conversationsAsBuyer() {
        return $this->hasMany(Conversation::class, 'buyer_id');
    }

    public function conversationsAsSeller() {
        return $this->hasMany(Conversation::class, 'seller_id');
    }


    public function reportedBy() {
        return $this->hasMany(Report::class, 'reported_user_id');
    }

    public function getLastActiveAtAttribute()
    {
        $timestamp = DB::table('sessions')
            ->where('user_id', $this->id)
            ->max('last_activity');

        return $timestamp ? Carbon::createFromTimestamp($timestamp) : null;
    }
}
