<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        h1 { text-align: center; font-size: 20px; margin-bottom: 20px; }
        .section { margin-bottom: 10px; }
        .signature { margin-top: 40px; text-align: right; }
        .signature img { height: 80px; }
    </style>
</head>
<body>
    <h1>Attestation de loyer</h1>
    <div class="section">
        <strong>Propriétaire :</strong> {{ \$user->name }}
    </div>
    <div class="section">
        <strong>Bien :</strong> {{ \$listing->title }}
    </div>
    <div class="section">
        <strong>Adresse :</strong> {{ \$listing->address }}
    </div>
    <div class="signature">
        @if(\$signaturePath)
            <img src="{{ \$signaturePath }}" alt="Signature">
        @else
            <em>Signature non disponible</em>
        @endif
    </div>
</body>
</html>
