<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class PriceEstimationController extends Controller
{
    public function index(): JsonResponse
    {
        $fallback = [
            ['label' => 'Appartement', 'value' => 3000],
            ['label' => 'Maison', 'value' => 2500],
            ['label' => 'Terrain', 'value' => 1500],
        ];

        try {
            $response = Http::timeout(5)
                ->withOptions(['verify' => false])
                ->get('https://www.sogefi-sig.com/geoservices-apis-wms/api-dvf/');

            if ($response->ok() && is_array($response->json())) {
                return response()->json($response->json());
            }
        } catch (\Exception $e) {
            // ignore and fall back
        }

        return response()->json($fallback);
    }
}
