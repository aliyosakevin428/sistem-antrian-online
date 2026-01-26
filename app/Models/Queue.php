<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Queue extends Model
{
    use HasFactory;



    //protected $table = 'queues';

    /*
    protected $fillable = [
        'service_id',
        'queue_number',
        'status',
        'queue_date'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    protected $casts =[
        'queue_date' => 'date'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
