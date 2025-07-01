<!DOCTYPE html>
<html lang="{{ str_replace('_','-',app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('code') - @yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen px-4">
    <div class="text-center">
        @yield('image')
        <h1 class="text-6xl font-bold text-orange-500 mt-6">@yield('code')</h1>
        <p class="mt-4 text-gray-600">@yield('message')</p>
        <a href="{{ url('/') }}" class="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600">Accueil</a>
    </div>
</body>
</html>
