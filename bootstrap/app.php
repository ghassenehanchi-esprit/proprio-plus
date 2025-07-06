<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'certified' => \App\Http\Middleware\EnsureUserIsCertified::class,
            'admin' => \App\Http\Middleware\EnsureIsAdmin::class,
            'participant' => \App\Http\Middleware\EnsureUserIsParticipant::class,
            'terms' => \App\Http\Middleware\EnsureTermsAccepted::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            return Inertia::render('Errors/404')
                ->toResponse($request)
                ->setStatusCode(404);
        });

        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            return Inertia::render('Errors/403')
                ->toResponse($request)
                ->setStatusCode(403);
        });

        $exceptions->render(function (HttpExceptionInterface $e, $request) {
            if ($e->getStatusCode() === 501) {
                return Inertia::render('Errors/501')
                    ->toResponse($request)
                    ->setStatusCode(501);
            }
        });
    })->create();
