<?php
/* Finmatrix — Hostinger PHP Newsletter & Welcome Email Automation */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    echo json_encode(['error' => 'Please enter a valid email address']);
    exit;
}

$senderEmail = 'novamatrix1564@gmail.com';
$adminEmail = 'novamatrix1564@gmail.com';

// 1. Send Welcome Email to Subscriber
$subject = "🚀 Welcome to Finmatrix Weekly Money Cheat Sheet!";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Finmatrix <" . $senderEmail . ">" . "\r\n";
$headers .= "Reply-To: " . $senderEmail . "\r\n";

$body = "
<div style='font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;'>
  <h2 style='color:#00a884;'>Welcome to Finmatrix Weekly Money Cheat Sheet!</h2>
  <p>Hi there,</p>
  <p>Thank you for subscribing to <strong>Finmatrix</strong>. Every Tuesday, you'll get 1 high-impact US personal finance tip, High-Yield Savings & Mortgage rate updates, and tax-saving hacks.</p>
  <p><strong>Your Starter Money Checklist:</strong></p>
  <ul>
    <li>1. Check your net take-home pay: <a href='https://finmatrix.cloud/calculators/paycheck-calculator.html'>Paycheck Calculator</a></li>
    <li>2. Build a 3-6 month HYSA emergency cushion yielding 4.5%+ APY</li>
    <li>3. Max out your Roth IRA ($7,000 limit for 2025/2026)</li>
  </ul>
  <p>Questions or feedback? Reply directly to this email ($senderEmail).</p>
  <p>— The Finmatrix Team</p>
</div>
";

// Send Welcome Email
@mail($email, $subject, $body, $headers);

// 2. Send Admin Notification to novamatrix1564@gmail.com
$adminSubject = "🎉 New Subscriber on Finmatrix: " . $email;
$adminBody = "New newsletter subscriber signed up: " . $email . " on " . date('Y-m-d H:i:s');
@mail($adminEmail, $adminSubject, $adminBody, "From: Finmatrix <" . $senderEmail . ">");

echo json_encode([
    'success' => true,
    'message' => 'Subscribed! Automated welcome email sent to ' . $email
]);
?>
