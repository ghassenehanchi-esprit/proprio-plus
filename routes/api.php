<?php

use App\Http\Controllers\ListingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PriceEstimationController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/listings/map', [ListingController::class, 'all']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/price-estimations', [PriceEstimationController::class, 'index']);

Route::middleware(['auth', 'verified', 'terms', 'certified'])->group(function () {
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])->middleware('participant');
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store'])->middleware(['participant', 'conversation.open']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index'])->middleware('participant');

});
