<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQueueCallsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'queue_id' => 'nullable',
            'user_id' => 'nullable',
            'counter_id' => 'nullable',
            'called_at' => 'nullable',
            'finished_at' => 'nullable',
            'notes' => 'required|string|max:150',
            'call_number' => 'nullable',
        ];
    }
}
