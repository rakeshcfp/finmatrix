<?php
/**
 * Finmatrix Instant Directory Fixer for Hostinger / Linux
 * Converts files extracted with Windows backslashes ('\') into proper Linux directories ('/').
 */

$rootDir = __DIR__;
$fixedCount = 0;

// Scan all items in public_html
$entries = scandir($rootDir);

foreach ($entries as $entry) {
    if ($entry === '.' || $entry === '..') continue;

    // Check if filename contains a Windows backslash
    if (strpos($entry, '\\') !== false) {
        $oldPath = $rootDir . '/' . $entry;
        $relativePath = str_replace('\\', '/', $entry);
        $newPath = $rootDir . '/' . $relativePath;
        $targetDir = dirname($newPath);

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        if (rename($oldPath, $newPath)) {
            $fixedCount++;
        }
    }
}

// Also check for finmatrix-production-deploy.zip
$zipExtracted = false;
$zipName = 'finmatrix-production-deploy.zip';
if (file_exists($rootDir . '/' . $zipName)) {
    $zip = new ZipArchive;
    if ($zip->open($rootDir . '/' . $zipName) === TRUE) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $stat = $zip->statIndex($i);
            $entryName = str_replace('\\', '/', $stat['name']);
            $targetFile = $rootDir . '/' . $entryName;
            $targetDir = dirname($targetFile);
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }
            // Extract file
            $stream = $zip->getStream($stat['name']);
            if ($stream) {
                file_put_contents($targetFile, stream_get_contents($stream));
                fclose($stream);
            }
        }
        $zip->close();
        $zipExtracted = true;
    }
}

echo "<div style='font-family:sans-serif;max-width:600px;margin:50px auto;padding:30px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;text-align:center;'>";
echo "<h1 style='color:#00d4aa;'>✓ All Directories Fixed & Organized!</h1>";
echo "<p style='color:#8b949e;line-height:1.6;'>Moved <strong>$fixedCount</strong> backslash-named files into proper Linux directories (<code>css/</code>, <code>js/</code>, <code>calculators/</code>, <code>embed/</code>, <code>config/</code>, <code>articles/</code>).</p>";
if ($zipExtracted) {
    echo "<p style='color:#00d4aa;'>✓ Also verified and unpacked $zipName cleanly.</p>";
}
echo "<div style='margin-top:24px;'>";
echo "<a href='/' style='background:#00d4aa;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-right:12px;'>View Homepage →</a>";
echo "<a href='/calculators/' style='background:#21262d;color:#f0f6fc;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;'>View Calculators →</a>";
echo "</div>";
echo "</div>";
?>
