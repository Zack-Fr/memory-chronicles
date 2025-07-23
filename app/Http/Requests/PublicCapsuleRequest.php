<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // public endpoint
    }

    public function rules(): array
    {
        return [
            'country'   => 'sometimes|string|size:2',
            'mood'      => 'sometimes|in:happy,neutral,sad',
            'date_from' => 'sometimes|date',
            'date_to'   => 'sometimes|date|after_or_equal:date_from',
        ];
    }
}
