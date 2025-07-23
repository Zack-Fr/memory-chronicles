<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DraftCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        // User must be authenticated (via 'auth:api')
        return true;
    }

    public function rules(): array
    {
        return [
            'title'                    => 'sometimes|string|max:255',
            'body'                     => 'sometimes|string',
            'reveal_at'                => 'sometimes|nullable|date|after_or_equal:today',
            'mood'                     => 'sometimes|in:happy,neutral,sad',
            'privacy'                  => 'sometimes|in:private,public',

            'attachments'              => 'sometimes|array',
            'attachments.*.type'       => 'required_with:attachments|in:location,image,audio',

            // Location-specific
            'attachments.*.latitude'   => 'required_if:attachments.*.type,location|numeric|between:-90,90',
            'attachments.*.longitude'  => 'required_if:attachments.*.type,location|numeric|between:-180,180',

            // Image-specific
            'attachments.*.filename'   => 'required_if:attachments.*.type,image|string',
            'attachments.*.base64'     => 'required_if:attachments.*.type,image|string',

            // Audio-specific
            'attachments.*.filename'   => 'required_if:attachments.*.type,audio|string',
            'attachments.*.base64'     => 'required_if:attachments.*.type,audio|string',
        ];
    }

    public function messages(): array
    {
        return [
            // You can reuse or customize messages similarly to StoreCapsuleRequest
        ];
    }
}
