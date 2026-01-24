<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class QueueSetting extends Model
{
    use HasFactory;



    //protected $table = 'queue_settings';

    /*
    protected $fillable = [
        'service_id',
        'prefix',
        'start_number',
        'max_per_day',
        'reset_daily'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'reset_daily' => 'boolean',
    ];


        public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
