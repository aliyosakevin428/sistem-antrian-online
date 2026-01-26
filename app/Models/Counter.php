<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;


class Counter extends Model
{
    use HasFactory;
    use SoftDeletes;



    //protected $table = 'counters';

    /*
    protected $fillable = [
        'name',
        'is_active'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    // public function services()
    // {
    //     return $this->belongsToMany(Service::class);
    // }

    // public function queueCalls()
    // {
    //     return $this->hasMany(QueueCall::class);
    // }

}
