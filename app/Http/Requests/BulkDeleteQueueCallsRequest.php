<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteQueueCallsRequest extends FormRequest
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
            'queue_calls_ids' => 'required|array',
            'queue_calls_ids.*' => 'exists:queue_calls,id',
        ];
    }
}
