<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateErrorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'error_message' => ['sometimes', 'string'],
            'cause' => ['nullable', 'string'],
            'solution' => ['sometimes', 'string'],
            'explanation' => ['nullable', 'string'],
            'error_code' => ['nullable', 'string', 'max:100'],
            'screenshot' => ['nullable', 'image', 'max:5120'],
            'time_spent_minutes' => ['nullable', 'integer', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
        ];
    }
}
