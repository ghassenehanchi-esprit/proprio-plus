<?php
namespace App\Enums;

enum ListingStatus: string
{
    case Active = 'active';
    case Sold = 'vendue';
    case Archived = 'archivée';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
