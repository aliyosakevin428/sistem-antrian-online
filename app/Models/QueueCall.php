<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class QueueCall extends Model
{
    use HasFactory;



    //protected $table = 'queue_calls';

    /*
    protected $fillable = [
        'queue_id',
        'user_id',
        'counter_id',
        'called_at',
        'finished_at',
        'notes',
        'call_number'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'finished_at' => 'datetime',
    ];


    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }
}
