<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only authenticated users (via 'auth:api' middleware) can hit this
        return true;
    }

    public function rules(): array
    {
        return [
            'title'                    => 'required|string|max:255',
            'body'                     => 'required|string',
            'reveal_at'                => 'required|date|after_or_equal:today',
            'mood'                     => 'required|in:happy,neutral,sad',
            'privacy'                  => 'required|in:private,public',

            'attachments'              => 'required|array|min:1',
            'attachments.*.type'       => 'required|in:location,image,audio',

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
            'reveal_at.after_or_equal' => 'The unlock date must be today or a future date.',
            'attachments.required'                       => 'You must include at least one attachment.',
            'attachments.*.base64.required_if'           => 'The file payload is required for each image/audio.',
            'attachments.*.latitude.required_if'         => 'Latitude is required for a location attachment.',
            'attachments.*.longitude.required_if'        => 'Longitude is required for a location attachment.',
            // Add any custom messages you like here…
        ];
    }
}
