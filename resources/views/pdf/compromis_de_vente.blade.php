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
    <h1>Compromis de vente</h1>
    <p>Les parties s'engagent à conclure la vente du bien <strong>{{ \$listing->title }}</strong> situé à {{ \$listing->address }} aux conditions indiquées.</p>
    <p>Le présent compromis précise les obligations de chacune des parties.</p>
    <div class="signatures">
        <div class="signature">
            @if(\$signaturePath)
                <img src="{{ \$signaturePath }}" alt="Signature acheteur">
            @endif
            <div class="line">Signature acheteur</div>
        </div>
        <div class="signature">
            @if(\$otherSignaturePath)
                <img src="{{ \$otherSignaturePath }}" alt="Signature vendeur">
            @endif
            <div class="line">Signature vendeur</div>
        </div>
    </div>
</body>
</html>
