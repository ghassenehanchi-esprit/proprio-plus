<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ClockingController;
use App\Http\Controllers\SavedSearchController;
use App\Http\Controllers\User\CertificationController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\ListingController as AdminListingController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\ClockingController as AdminClockingController;
use App\Http\Middleware\EnsureIsAdmin;
use App\Http\Controllers\Admin\LoginController as AdminLoginController;
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
Route::middleware(['auth', 'verified', EnsureIsAdmin::class])
use App\Http\Controllers\Admin\LoginController as AdminLoginController;
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/data', [AdminUserController::class, 'data'])->name('users.data');
        Route::get('/users/{user}/document', [AdminUserController::class, 'document'])->name('users.document');
        Route::post('/users/{user}/certify', [AdminUserController::class, 'certify'])->name('users.certify');
        Route::post('/users/{user}/refuse', [AdminUserController::class, 'refuse'])->name('users.refuse');
        Route::post('/users/{user}/reupload', [AdminUserController::class, 'requestReupload'])->name('users.reupload');

        Route::get('/notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{notification}/read', [AdminNotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/{notification}/unread', [AdminNotificationController::class, 'markAsUnread'])->name('notifications.unread');

        Route::get('/listings', [AdminListingController::class, 'index'])->name('listings.index');
        Route::get('/listings/data', [AdminListingController::class, 'data'])->name('listings.data');
        Route::post('/listings/{listing}/status', [AdminListingController::class, 'setStatus'])->name('listings.status');

        Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
        Route::get('/pages/{page}/edit', [AdminPageController::class, 'edit'])->name('pages.edit');
        Route::post('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');

        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/data', [AdminReportController::class, 'data'])->name('reports.data');
        Route::post('/reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('reports.status');

        Route::get('/clockings', [AdminClockingController::class, 'index'])->name('clockings.index');
        Route::get('/clockings/data', [AdminClockingController::class, 'data'])->name('clockings.data');
    });
Route::middleware(['auth', 'verified', 'certified'])->group(function () {
    Route::resource('listings', ListingController::class)->except(['show']);
    Route::post('listings/{listing}/mark-as-sold', [ListingController::class, 'markAsSold'])->name('listings.sold');
    Route::post('listings/{listing}/archive', [ListingController::class, 'archive'])->name('listings.archive');
});
Route::middleware(['auth', 'verified', 'certified'])->group(function () {
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])->middleware('participant');
    Route::post('/conversations/{conversation}/block', [ConversationController::class, 'block']);
    Route::post('/conversations/{conversation}/close', [ConversationController::class, 'close']);

    Route::post('/conversations/{conversation}/read', [ConversationController::class, 'markAsRead']);
    Route::post('/conversations/{conversation}/unread', [ConversationController::class, 'markAsUnread']);

    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store'])->middleware('participant');
    Route::post('/conversations/{conversation}/meetings', [MeetingController::class, 'store'])->middleware('participant');
    Route::post('/meetings/{meeting}/status', [MeetingController::class, 'update'])->middleware('participant');
    Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/{notification}/unread', [NotificationController::class, 'markAsUnread']);
});
Route::middleware(['auth'])->group(function () {
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);

    Route::get('/clockings', [ClockingController::class, 'index']);
    Route::post('/clockings', [ClockingController::class, 'clockIn']);
    Route::post('/clockings/{clocking}/clock-out', [ClockingController::class, 'clockOut']);
});
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/listings/search', [PageController::class, 'search'])->name('listings.search'); // Vue Inertia
Route::get('/api/listings', [ListingController::class, 'index'])->name('listings.index');   // API JSON
Route::get('/listings/{listing}', [PageController::class, 'listingShow'])->name('listings.show');

Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/forgot-password', [PageController::class, 'forgotPassword'])->name('password.request');
Route::get('/reset-password/{token}', [PageController::class, 'resetPassword'])->name('password.reset');
Route::middleware(["guest"])->prefix("admin")->name("admin.")->group(function () {
    Route::get("/login", [AdminLoginController::class, "showLoginForm"])->name("login");
    Route::post("/login", [AdminLoginController::class, "login"])->name("login.post");
});
Route::post("/admin/logout", [AdminLoginController::class, "logout"])->middleware("auth")->name("admin.logout");
Route::get('/verify-sms', [PageController::class, 'smsCode'])->name('verify.sms');
Route::get('/upload-identity', [PageController::class, 'uploadIdentity'])->name('verify.identity');
Route::get('/pages/{slug}', [PageController::class, 'page'])->name('pages.show');
Route::get('/about-us', fn() => redirect()->route('pages.show', 'about-us'));
Route::get('/code-of-conduct', fn() => redirect()->route('pages.show', 'code-of-conduct'));
Route::get('/reglements', fn() => redirect()->route('pages.show', 'reglements'));
Route::middleware(['auth'])->group(function () {
    Route::get('/favorites', [PageController::class, 'favorites'])->name('favorites.index');
    Route::post('/listings/{listing}/favorite', [ListingController::class, 'toggle'])->name('favorites.toggle');
    Route::get('/account/settings', [PageController::class, 'accountSettings'])->name('account.settings');
    Route::get('/account/clockings', [PageController::class, 'clockings'])->name('account.clockings');

    Route::get('/saved-searches', [SavedSearchController::class, 'index'])->name('searches.index');
    Route::post('/saved-searches', [SavedSearchController::class, 'store'])->name('searches.store');
    Route::delete('/saved-searches/{search}', [SavedSearchController::class, 'destroy'])->name('searches.destroy');

    Route::get('/recommendations', [ListingController::class, 'recommendations'])->name('listings.recommendations');
});

Route::middleware(['auth', 'verified', 'certified'])->group(function () {
    Route::get('/messages', [PageController::class, 'messages'])->name('messages.index');
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
