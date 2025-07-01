<?php
namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';
    case Reviewed = 'reviewed';
    case Blocked = 'blocked';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
