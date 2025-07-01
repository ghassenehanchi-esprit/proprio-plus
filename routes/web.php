<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\User\CertificationController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use Illuminate\Http\Request;

use Inertia\Inertia;


Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/certification', [CertificationController::class, 'showForm'])->name('certification.form');
    Route::post('/certification', [CertificationController::class, 'submitDocument'])->name('certification.submit');
});
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/users/{user}/certify', [AdminUserController::class, 'certify'])->name('users.certify');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('listings', ListingController::class)->except(['show']);
    Route::post('listings/{listing}/mark-as-sold', [ListingController::class, 'markAsSold'])->name('listings.sold');
    Route::post('listings/{listing}/archive', [ListingController::class, 'archive'])->name('listings.archive');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])->middleware('participant');
    Route::post('/conversations/{conversation}/block', [ConversationController::class, 'block']);

    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store'])->middleware('participant');
    Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);
});
Route::middleware(['auth'])->group(function () {
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
});
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/listings/search', [PageController::class, 'search'])->name('listings.search'); // Vue Inertia
Route::get('/api/listings', [ListingController::class, 'index'])->name('listings.index');   // API JSON
Route::get('/listings/{listing}', [PageController::class, 'listingShow'])->name('listings.show');

Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/forgot-password', [PageController::class, 'forgotPassword'])->name('password.request');
Route::get('/reset-password/{token}', [PageController::class, 'resetPassword'])->name('password.reset');
Route::get('/verify-sms', [PageController::class, 'smsCode'])->name('verify.sms');
Route::get('/upload-identity', [PageController::class, 'uploadIdentity'])->name('verify.identity');
Route::middleware(['auth'])->group(function () {
    Route::get('/favorites', [PageController::class, 'favorites'])->name('favorites.index');
    Route::post('/listings/{listing}/favorite', [ListingController::class, 'toggle'])->name('favorites.toggle');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/email/verify', [PageController::class, 'verifyEmailNotice'])->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return redirect('/dashboard'); // ou autre route
    })->middleware(['signed'])->name('verification.verify');

    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('message', 'Lien de vérification envoyé !');
    })->middleware(['throttle:6,1'])->name('verification.send');
});
