<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service indisponible</title>
    @vite(["resources/js/app.jsx"])
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9V3m0 18v-6m9 3H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 class="text-4xl font-bold mt-4">501</h1>
        <p class="mt-2 text-gray-600">Cette fonctionnalité n'est pas disponible.</p>
        <a href="{{ url('/') }}" class="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded">Retour à l'accueil</a>
    </div>
</body>
</html>


