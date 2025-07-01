<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\ReportStatus;

class Report extends Model
{
    protected $fillable = [
        'reporter_id', 'reported_user_id', 'conversation_id', 'reason', 'status',
    ];

    protected $casts = [
        'status' => ReportStatus::class,
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reported()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
