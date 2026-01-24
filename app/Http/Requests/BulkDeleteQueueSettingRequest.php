<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteQueueSettingRequest extends FormRequest
{
    /**
     * Determine if the queueSetting is authorized to make this request.
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
            'queueSetting_ids' => 'required|array',
            'queueSetting_ids.*' => 'exists:queue_settings,id',
        ];
    }
}
