<?php

namespace App\Exceptions;

use Exception;

class LocationAttachmentException extends Exception
{
    protected float $latitude;
    protected float $longitude;

    /**
     * @param  float  $latitude
     * @param  float  $longitude
     */
    public function __construct(float $latitude, float $longitude)
    {
        parent::__construct('Location attachment (no file)');
        $this->latitude  = $latitude;
        $this->longitude = $longitude;
    }

    public function getLatitude(): float
    {
        return $this->latitude;
    }

    public function getLongitude(): float
    {
        return $this->longitude;
    }
}
