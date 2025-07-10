<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        h1 { text-align: center; font-size: 20px; margin-bottom: 20px; }
        .section { margin-bottom: 10px; }
        .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { width: 45%; text-align: center; }
        .signature img { max-height: 80px; }
        .signature .line { border-top: 1px solid #000; margin-top: 60px; }
    </style>
</head>
<body>
    <h1>Mandat de vente exclusif</h1>
    <p>Le proprietaire confie a l'agence la mise en vente du bien suivant : <strong>{{ \$listing->title }}</strong> situe a {{ \$listing->address }}.</p>
    <p>Les conditions de vente sont detaillees dans le present mandat.</p>
    <div class="signatures">
        <div class="signature">
            @if(\$signaturePath)
                <img src="{{ \$signaturePath }}" alt="Signature proprietaire">
            @endif
            <div class="line">Signature proprietaire</div>
        </div>
        <div class="signature">
            @if(\$otherSignaturePath)
                <img src="{{ \$otherSignaturePath }}" alt="Signature agence">
            @endif
            <div class="line">Signature agence</div>
        </div>
    </div>
</body>
</html>
