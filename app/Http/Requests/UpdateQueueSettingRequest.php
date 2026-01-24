<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQueueSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => [
                'required',
                'exists:services,id',
                Rule::unique('queue_settings', 'service_id')
                    ->ignore($this->queue_setting),
            ],
            'prefix' => ['required', 'string', 'max:10'],
            'start_number' => ['required', 'integer', 'min:0'],
            'max_queue' => ['required', 'integer', 'min:1'],
            'reset_daily' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'prefix' => strtoupper($this->prefix),
            'reset_daily' => $this->reset_daily ?? true,
        ]);
    }
}
