<?php

namespace App\Exceptions;

use Exception;
use Carbon\Carbon;

class CapsuleLockedException extends Exception
{
    protected Carbon $unlockAt;

    public function __construct(Carbon $unlockAt)
    {
        parent::__construct("Capsule unlocks at {$unlockAt->toDateTimeString()}");
        $this->unlockAt = $unlockAt;
    }

    public function getUnlockAt(): Carbon
    {
        return $this->unlockAt;
    }
}
