<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone_number',
        'neighborhood',
        'maintenance_type',
        'spare_parts',
        'service_type',
        'contract_start_date',
        'contract_end_date',
        'maintenance_value',
        'paid',
        'unpaid',
        'notes',
    ];


    public function visits()
    {
        return $this->hasMany(Visit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
