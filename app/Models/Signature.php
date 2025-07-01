<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    protected $fillable = ['user_id', 'document_to_sign_id', 'file_path', 'signed_at'];

    public function documentToSign() {
        return $this->belongsTo(DocumentToSign::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
