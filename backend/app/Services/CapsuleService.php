<?php

namespace App\Services;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\CapsuleLockedException;
use Geocoder\Laravel\Facades\Geocoder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Models\Capsule;
use Carbon\Carbon;
use Exception;

class CapsuleService
{
    /**
     * Create a new capsule with attachments, reverse-geocode country, and return it.
     *
     * @param  array  $data  Validated payload from StoreCapsuleRequest
     * @return \App\Models\Capsule
     * @throws \Exception on Base64 decode error or size limit breach
     */
    public function create(array $data): Capsule
    {
        $user = auth()->user();

        // 1) Create the capsule record
        $capsule = Capsule::create([
            'user_id'      => $user->id,
            'title'        => $data['title'],
            'body'         => $data['body'],
            'reveal_at'    => Carbon::parse($data['reveal_at']),
            'mood'         => $data['mood'],
            'privacy'      => $data['privacy'],
            'is_draft'     => false,
            'ip_address'   => request()->ip(),
        ]);

        // 2) Handle each attachment
        foreach ($data['attachments'] as $item) {
            switch ($item['type']) {
                case 'location':
                    $lat = $item['latitude'];
                    $lng = $item['longitude'];
                    $capsule->attachments()->create([
                        'type'      => 'location',
                        'latitude'  => $lat,
                        'longitude' => $lng,
                        'path'      => null,
                    ]);
                    break;

                case 'image':
                case 'audio':
                    $this->storeFileAttachment($capsule, $item);
                    break;
            }
        }


        return $capsule->load('attachments');
    }

    /**
     * Create or update the authenticated user's single draft.
     *
     * @param  array  $data  Partial payload from DraftCapsuleRequest
     * @return \App\Models\Capsule
     * @throws \Exception on file errors
     */
    public function upsertDraft(array $data): Capsule
    {
        $user = auth()->user();

        // 1) Find or new draft
        $capsule = Capsule::firstOrNew([
            'user_id'  => $user->id,
            'is_draft' => true,
        ]);

        // 2) Update only given fields
        foreach (['title','body','reveal_at','mood','privacy'] as $field) {
            if (array_key_exists($field, $data)) {
                $capsule->$field = $field === 'reveal_at'
                    ? Carbon::parse($data[$field])
                    : $data[$field];
            }
        }
        $capsule->ip_address = request()->ip();
        $capsule->is_draft   = true;
        $capsule->save();

        // 3) If attachments provided, replace existing
        if (array_key_exists('attachments', $data)) {
            $capsule->attachments()->delete();
            foreach ($data['attachments'] as $item) {
                if ($item['type'] === 'location') {
                    $capsule->attachments()->create([
                        'type'      => 'location',
                        'latitude'  => $item['latitude'],
                        'longitude' => $item['longitude'],
                        'path'      => null,
                    ]);
                } else {
                    $this->storeFileAttachment($capsule, $item);
                }
            }
        }

        // 4) Potentially update country_code for draft too
        $loc = $capsule->attachments()
                    ->where('type','location')
                    ->first();
        if ($loc) {
            try {
                $geo = Geocoder::reverse($loc->latitude, $loc->longitude)->get();
                if ($geo->isNotEmpty()) {
                    $capsule->country_code = strtoupper($geo->first()->getCountry()->getCode());
                    $capsule->save();
                }
            } catch (Exception $e) {
                // log if desired
            }
        }

        return $capsule->load('attachments');
    }

    /**
     * Retrieve the authenticated user's current draft, if any.
     *
     * @return \App\Models\Capsule|null
     */
    public function getDraft(): ?Capsule
    {
        return Capsule::with('attachments')
            ->where('user_id', auth()->id())
            ->where('is_draft', true)
            ->first();
    }

    /**
     * Decode & store a Base64 file attachment, enforcing size limits.
     *
     * @param  Capsule  $capsule
     * @param  array    $item     ['type','filename','base64']
     * @throws \Exception on invalid Base64 or size breach
     */
protected function storeFileAttachment(Capsule $capsule, array $item): void
{
    $type     = $item['type'];    // 'image' or 'audio'
    $bytes    = base64_decode($item['base64'], true);
    $filename = $item['filename'];

    if ($bytes === false) {
        throw new Exception("Invalid Base64 payload for {$filename}");
    }

    $max = $type === 'image'
        ? 5 * 1024 * 1024
        : 10 * 1024 * 1024;

    if (strlen($bytes) > $max) {
        throw new Exception("{$filename} exceeds the {$type} size limit");
    }

    $stored = Str::random(8) . "_{$filename}";
    $path   = "capsules/{$capsule->id}/{$stored}";

    // Store file and log the full path
    Storage::disk('local')->put($path, $bytes);
    Log::debug("Stored file at: " . Storage::disk('local')->path($path));

    $capsule->attachments()->create([
        'type'      => $type,
        'path'      => $path,
        'latitude'  => null,
        'longitude' => null,
    ]);
}
    public function listForUser()
    {
        return Capsule::with('attachments')
        ->where('user_id', auth()->id())
        ->where ('is_draft', false)
        ->get();
    }
    /**
     * Fetch a single, non-draft capsule that has been unlocked.
     *
     * @throws ModelNotFoundException
     * @throws CapsuleLockedException
     */
    public function show(int $id): Capsule
    {
        $capsule = Capsule::with('attachments')
            ->where('id', $id)
            ->where('is_draft', false)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Business logic: only unlocked capsules
        if ($capsule->reveal_at->gt(now())) {
            throw new CapsuleLockedException($capsule->reveal_at);
        }
            // Transform attachments to include a URL
    $capsule->attachments = $capsule->attachments->map(function($a) {
        return [
            'id'        => $a->id,
            'type'      => $a->type,
            'path'      => $a->path,
            // only generate URL for file attachments
            'url'       => $a->path
                ? route('attachments.download', ['id' => $a->id])
                : null,
            'latitude'  => $a->latitude,
            'longitude' => $a->longitude,
        ];
    });

        return $capsule;
    }
    /**
     * Return all public, revealed capsules, with optional filters.
     *
     * @param  array  $filters  ['mood','country','date_from','date_to']
     * @return Collection<int, array>
     */
    public function publicList(array $filters = []): Collection
    {
        $query = Capsule::with('attachments')
            ->where('privacy', 'public')
            ->where('is_draft', false)
            ->where('reveal_at', '<=', now());

        if (! empty($filters['mood'])) {
            $query->where('mood', $filters['mood']);
        }
        if (! empty($filters['country'])) {
            $query->where('country_code', strtoupper($filters['country']));
        }
        if (! empty($filters['date_from'])) {
            $query->whereDate('reveal_at', '>=', $filters['date_from']);
        }
        if (! empty($filters['date_to'])) {
            $query->whereDate('reveal_at', '<=', $filters['date_to']);
        }

return $query->get()->map(function($c) {
        $loc = $c->attachments->first(fn($a)=>$a->type==='location');
        return [
            'id'         => $c->id,
            'title'      => $c->title,
            'country'    => $c->country_code,
            'mood'       => $c->mood,
            'revealed_at'=> $c->reveal_at,
            'location'   => $loc ? ['lat'=>$loc->latitude,'lng'=>$loc->longitude] : null,
            'created_at' => $c->created_at,
            'user'       => ['name'=>$c->user->name],
        ];
    });
}
    
}
