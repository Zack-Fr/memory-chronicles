<?php

namespace App\Models;
use App\Models\Attachment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany; 
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Capsule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'reveal_at',
        'mood',
        'privacy',
        'is_draft',
        'country_code',
        'ip_address',
    ];

    protected $casts = [
        'reveal_at' =>'datetime',
        'is_draft' =>'boolean',
    ];

    //the owner of this capsule
    public function user() {
        
        return $this->belongsTo(User::class);
    }

    public function attachments () {
        return $this->hasMany(Attachment::class);
    }

    
}
