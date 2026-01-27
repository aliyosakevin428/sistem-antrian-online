<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateQueueCallsRequest extends FormRequest
{
    /**
     * Determine if the queueCalls is authorized to make this request.
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
            'queueCalls_ids' => 'required|array',
            'queueCalls_ids.*' => 'exists:queue_calls,id',
        ];
    }
}
