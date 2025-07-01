<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page introuvable</title>
    @vite(["resources/js/app.jsx"])
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8a2 2 0 114 0 2 2 0 01-4 0zM10 11v2a1 1 0 11-2 0v-2h2z" clip-rule="evenodd" />
        </svg>
        <h1 class="text-4xl font-bold mt-4">404</h1>
        <p class="mt-2 text-gray-600">La page demandée n'existe pas.</p>
        <a href="{{ url('/') }}" class="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded">Retour à l'accueil</a>
    </div>
</body>
</html>

