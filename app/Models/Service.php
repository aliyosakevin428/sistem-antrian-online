<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;


class Service extends Model
{
    use HasFactory;
    use SoftDeletes;



    //protected $table = 'services';

    /*
    protected $fillable = [
        'name',
        'code',
        'is_active'
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function queueSetting()
    {
        return $this->hasOne(QueueSetting::class);
    }

    public function counters()
    {
        return $this->belongsToMany(Counter::class);
    }

}
