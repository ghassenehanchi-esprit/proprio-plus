<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès refusé</title>
    @vite(["resources/js/app.jsx"])
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M3 5h18M4 5l1 14a2 2 0 002 2h10a2 2 0 002-2l1-14H4z" />
        </svg>
        <h1 class="text-4xl font-bold mt-4">403</h1>
        <p class="mt-2 text-gray-600">Vous n'avez pas accès à cette page.</p>
        <a href="{{ url('/') }}" class="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded">Retour à l'accueil</a>
    </div>
</body>
</html>
