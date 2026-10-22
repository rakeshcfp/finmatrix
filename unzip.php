<?php
/**
 * Finmatrix 1-Click Server-Side Zip Extractor
 * Run this by opening https://finmatrix.cloud/unzip.php in your browser.
 */

$zipFiles = ['finmatrix-production-deploy.zip', 'finmatrix-deployment.zip'];
$targetZip = null;

foreach ($zipFiles as $f) {
    if (file_exists(__DIR__ . '/' . $f)) {
        $targetZip = $f;
        break;
    }
}

if (!$targetZip) {
    die("<h2 style='color:red;font-family:sans-serif;'>Error: Deployment zip not found in public_html.</h2>");
}

$zip = new ZipArchive;
$res = $zip->open(__DIR__ . '/' . $targetZip);

if ($res === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    echo "<div style='font-family:sans-serif;max-width:600px;margin:50px auto;padding:30px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;text-align:center;'>";
    echo "<h1 style='color:#00d4aa;'>✓ Extraction Complete!</h1>";
    echo "<p style='color:#8b949e;line-height:1.6;'>All 23 calculators, CSS styles, JavaScript engines, and category hubs have been successfully extracted directly into public_html.</p>";
    echo "<div style='margin-top:24px;'>";
    echo "<a href='/' style='background:#00d4aa;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-right:12px;'>Visit Homepage →</a>";
    echo "<a href='/calculators/' style='background:#21262d;color:#f0f6fc;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;'>View Calculators →</a>";
    echo "</div>";
    echo "</div>";
} else {
    echo "<h2 style='color:red;'>Extraction error code: $res</h2>";
}
?>
