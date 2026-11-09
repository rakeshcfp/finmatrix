<?php
/* Finmatrix — Hostinger PHP Lead Capture & Welcome Email Automation */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?: [];

$name = htmlspecialchars(trim($input['name'] ?? 'Subscriber'));
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars(trim($input['phone'] ?? ''));
$resourceId = htmlspecialchars(trim($input['resource_id'] ?? 'general-newsletter'));
$resourceTitle = htmlspecialchars(trim($input['resource_title'] ?? 'Finmatrix Financial Toolkit'));
$excelUrl = filter_var(trim($input['excel_url'] ?? ''), FILTER_SANITIZE_URL);
$pdfUrl = filter_var(trim($input['pdf_url'] ?? ''), FILTER_SANITIZE_URL);
$downloadUrl = filter_var(trim($input['download_url'] ?? $excelUrl ?: 'https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx'), FILTER_SANITIZE_URL);
$sourcePage = htmlspecialchars(trim($input['source_page'] ?? ''));
$utmSource = htmlspecialchars(trim($input['utm_source'] ?? 'organic'));

if (!$email) {
    echo json_encode(['error' => 'Please enter a valid email address']);
    exit;
}

$senderEmail = 'support@finmatrix.cloud';
$adminEmail = 'support@finmatrix.cloud';

// 1. Send Welcome Email with Download Link to Subscriber
$subject = "🚀 Your Download: " . $resourceTitle . " (Excel + PDF)";
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Finmatrix <" . $senderEmail . ">\r\n";
$headers .= "Reply-To: " . $senderEmail . "\r\n";

$body = "
<div style='font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;color:#111827;border-radius:12px;border:1px solid #e5e7eb;'>
  <div style='border-bottom:2px solid #00d4aa;padding-bottom:12px;margin-bottom:20px;'>
    <h2 style='color:#0f172a;margin:0;font-size:22px;'>Finmatrix Financial Research Desk</h2>
  </div>
  <p>Hi " . ($name ?: 'there') . ",</p>
  <p>Thank you for requesting the <strong>" . $resourceTitle . "</strong>.</p>
  <p>You can access and download both your Excel Model and PDF Guide below:</p>
  <div style='margin:20px 0;text-align:center;display:flex;flex-direction:column;gap:12px;'>
    " . ($excelUrl ? "<a href='" . $excelUrl . "' style='background:#00d4aa;color:#080c10;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:8px;display:inline-block;'>📗 Download Excel Spreadsheet (.xlsx) &rarr;</a>" : "") . "
    " . ($pdfUrl ? "<a href='" . $pdfUrl . "' style='background:#1e293b;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:11px 20px;border-radius:8px;display:inline-block;'>📄 Download PDF Strategy Guide (.pdf) &rarr;</a>" : "") . "
    " . (!$excelUrl && !$pdfUrl ? "<a href='" . $downloadUrl . "' style='background:#00d4aa;color:#080c10;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:8px;display:inline-block;'>Direct Download Resource &rarr;</a>" : "") . "
  </div>
  <p style='font-size:13px;color:#6b7280;margin-top:24px;'>
    Requested on: " . date('Y-m-d H:i:s T') . "<br/>
    Phone / WhatsApp provided: " . ($phone ?: 'Not provided') . "<br/>
    Source: " . ($sourcePage ?: 'Direct') . " (" . $utmSource . ")
  </p>
  <hr style='border:none;border-top:1px solid #e5e7eb;margin:24px 0;'/>
  <p style='font-size:12px;color:#9ca3af;'>
    You are receiving this because you requested a free financial tool on Finmatrix (https://finmatrix.cloud).
  </p>
</div>
";

@mail($email, $subject, $body, $headers);

// 2. Send Admin Notification with Full Lead Information
$adminSubject = "🔥 New Lead Captured: " . $name . " (" . $email . ") - " . $resourceTitle;
$adminBody = "New Lead Captured on Finmatrix:\n\n" .
    "Name: " . $name . "\n" .
    "Email: " . $email . "\n" .
    "Phone / WhatsApp: " . $phone . "\n" .
    "Resource: " . $resourceTitle . " (" . $resourceId . ")\n" .
    "Download URL: " . $downloadUrl . "\n" .
    "Source Page: " . $sourcePage . "\n" .
    "UTM Source: " . $utmSource . "\n" .
    "Time: " . date('Y-m-d H:i:s') . "\n";

@mail($adminEmail, $adminSubject, $adminBody, "From: Finmatrix System <" . $senderEmail . ">");

// 3. Append to leads.csv as permanent server backup
$csvFile = __DIR__ . '/leads.csv';
$csvExists = file_exists($csvFile);
$fp = @fopen($csvFile, 'a');
if ($fp) {
    if (!$csvExists || filesize($csvFile) === 0) {
        fputcsv($fp, ['Timestamp', 'Name', 'Email', 'Phone', 'Toolkit', 'Download_URL', 'Source_Page', 'IP']);
    }
    fputcsv($fp, [
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $phone,
        $resourceTitle,
        $downloadUrl,
        $sourcePage,
        $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN'
    ]);
    fclose($fp);
}

// 4. Forward to n8n Webhook if configured in site.json
$siteConfigPath = __DIR__ . '/config/site.json';
if (file_exists($siteConfigPath)) {
    $siteConfig = json_decode(file_get_contents($siteConfigPath), true);
    $n8nUrl = trim($siteConfig['automation']['n8n_webhook_url'] ?? '');
    if ($n8nUrl && strpos($n8nUrl, 'http') === 0) {
        $ch = curl_init($n8nUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_exec($ch);
        curl_close($ch);
    }
}

// 5. Return Success to Browser
echo json_encode([
    'success' => true,
    'message' => 'Lead captured successfully! Direct link emailed to ' . $email,
    'download_url' => $downloadUrl
]);
?>
