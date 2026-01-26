<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteCounterRequest extends FormRequest
{
    /**
     * Determine if the counter is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'counter_ids' => 'required|array',
            'counter_ids.*' => 'exists:counters,id',
        ];
    }
}
