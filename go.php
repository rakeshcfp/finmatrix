<?php
/**
 * Finmatrix — Master Dynamic Affiliate Switchboard & Multi-Partner Router
 *
 * Capabilities:
 *   1. Multiple Specific Offers:
 *      https://finmatrix.cloud/go.php?offer=sofi-hysa
 *      https://finmatrix.cloud/go.php?offer=citi-simplicity
 *
 *   2. Category Smart Routing (Picks top active partner for a category):
 *      https://finmatrix.cloud/go.php?to=hysa
 *      https://finmatrix.cloud/go.php?to=balance-transfer
 *
 *   3. SubID / Attribution Tracking Forwarding:
 *      https://finmatrix.cloud/go.php?offer=sofi-hysa&subid=email_day2&src=payment_calc
 *      Automatically appends subid to the target affiliate network URL!
 *
 *   4. Granular Per-Offer Safe Mode:
 *      If an individual offer is not active or still has a placeholder URL,
 *      it safely redirects (302) to that offer's matching free Finmatrix tool.
 *
 *   5. Real-Time Click Telemetry:
 *      Logs timestamp, offer ID, partner name, subid, and IP to affiliate_clicks.csv.
 */

// 1. Load Master Affiliates Configuration
$configFile = __DIR__ . '/config/affiliates.json';
$affiliatesConfig = [];

if (file_exists($configFile)) {
    $json = file_get_contents($configFile);
    $affiliatesConfig = json_decode($json, true) ?: [];
}

$globalAffiliatesActive = isset($affiliatesConfig['affiliates_active']) ? (bool)$affiliatesConfig['affiliates_active'] : false;
$offers = isset($affiliatesConfig['offers']) ? $affiliatesConfig['offers'] : [];

// 2. Parse Incoming Request Parameters
$offerId = isset($_GET['offer']) ? trim($_GET['offer']) : '';
$category = isset($_GET['to']) ? trim($_GET['to']) : '';
if (empty($offerId) && !empty($category)) {
    $offerId = $category;
}

$subId = isset($_GET['subid']) ? trim($_GET['subid']) : (isset($_GET['sid']) ? trim($_GET['sid']) : '');
$sourceTag = isset($_GET['src']) ? trim($_GET['src']) : '';

// Default fallback destination
$destinationUrl = '/calculators/';
$matchedOffer = null;
$isAffiliateRedirect = false;

// Universal Category Fallbacks
$categoryFallbacks = [
    'balance-transfer' => '/calculators/debt-elimination-planner.html',
    'debt'             => '/calculators/debt-elimination-planner.html',
    'credit-card'      => '/calculators/credit-card-payoff-calculator.html',
    'personal-loan'    => '/calculators/loan-calculator.html',
    'mortgage'         => '/calculators/payment-calculator.html',
    'loans'            => '/calculators/payment-calculator.html',
    'payment'          => '/calculators/payment-calculator.html',
    'hysa'             => '/calculators/hysa-vs-cd-calculator.html',
    'savings'          => '/calculators/hysa-vs-cd-calculator.html',
    'emergency'        => '/calculators/emergency-fund-calculator.html',
    'investing'        => '/calculators/retirement-calculator.html',
    'retirement'       => '/calculators/retirement-calculator.html',
    'ira'              => '/calculators/roth-vs-traditional-ira-calculator.html',
    '401k'             => '/calculators/401k-calculator.html',
    'tax'              => '/calculators/paycheck-calculator.html',
    'tax-software'     => '/calculators/paycheck-calculator.html',
    'student-loan'     => '/calculators/student-loan-calculator.html'
];

if (!empty($offerId)) {
    // A. First Check for Exact ID Match (e.g. "sofi-hysa", "balance-transfer-primary")
    foreach ($offers as $o) {
        if ($o['id'] === $offerId) {
            $matchedOffer = $o;
            break;
        }
    }

    // B. If No Exact ID, Check for Category Match (e.g. "hysa", "mortgage")
    if (!$matchedOffer) {
        $categoryCandidates = [];
        foreach ($offers as $o) {
            if ($o['category'] === $offerId) {
                $categoryCandidates[] = $o;
            }
        }

        if (!empty($categoryCandidates)) {
            // Find first active candidate with a real URL
            foreach ($categoryCandidates as $cand) {
                $rawCandUrl = isset($cand['url']) ? trim($cand['url']) : '';
                $candActive = isset($cand['active']) ? (bool)$cand['active'] : true;
                $isCandPlaceholder = empty($rawCandUrl) || strpos($rawCandUrl, 'example.com') !== false || strpos($rawCandUrl, 'REPLACE_ME') !== false;

                if ($globalAffiliatesActive && $candActive && !$isCandPlaceholder) {
                    $matchedOffer = $cand;
                    break;
                }
            }

            // If none are active, pick the first one for fallback routing
            if (!$matchedOffer) {
                $matchedOffer = $categoryCandidates[0];
            }
        }
    }

    // C. Determine Destination URL
    if ($matchedOffer) {
        $rawUrl = isset($matchedOffer['url']) ? trim($matchedOffer['url']) : '';
        $offerActive = isset($matchedOffer['active']) ? (bool)$matchedOffer['active'] : true;
        $isPlaceholder = empty($rawUrl) || strpos($rawUrl, 'example.com') !== false || strpos($rawUrl, 'REPLACE_ME') !== false;

        // Can redirect to affiliate if global is on, offer is active, and URL is real
        if ($globalAffiliatesActive && $offerActive && !$isPlaceholder) {
            $destinationUrl = $rawUrl;
            $isAffiliateRedirect = true;

            // Forward SubID for affiliate network tracking if present
            if (!empty($subId)) {
                $separator = (strpos($destinationUrl, '?') !== false) ? '&' : '?';
                // Most networks (Impact, CJ, ShareASale) accept subid or sid
                $destinationUrl .= $separator . 'subid=' . urlencode($subId);
            }
        } else {
            // Safe fallback mode: route to internal tool
            if (!empty($matchedOffer['fallback_url'])) {
                $destinationUrl = $matchedOffer['fallback_url'];
            } elseif (isset($categoryFallbacks[$matchedOffer['category']])) {
                $destinationUrl = $categoryFallbacks[$matchedOffer['category']];
            } else {
                $destinationUrl = '/calculators/';
            }
        }
    } else {
        // Fallback by category mapping
        if (isset($categoryFallbacks[$offerId])) {
            $destinationUrl = $categoryFallbacks[$offerId];
        }
    }
}

// 3. Log Telemetry to affiliate_clicks.csv
$logFile = __DIR__ . '/affiliate_clicks.csv';
$timestamp = date('Y-m-d H:i:s');
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
$referrer = $_SERVER['HTTP_REFERER'] ?? 'DIRECT';
$status = $isAffiliateRedirect ? 'LIVE_AFFILIATE' : 'INTERNAL_FALLBACK';
$brandName = $matchedOffer['brand'] ?? 'Unknown';

$logLine = sprintf(
    "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
    $timestamp,
    $offerId,
    $brandName,
    $status,
    $destinationUrl,
    $subId,
    $clientIp,
    $referrer
);

if (!file_exists($logFile)) {
    @file_put_contents($logFile, "\"Timestamp\",\"Offer_ID\",\"Brand\",\"Status\",\"Destination_URL\",\"SubID\",\"IP\",\"Referrer\"\n");
}
@file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

// 4. Perform Clean 302 Redirect
header('HTTP/1.1 302 Found');
header('Location: ' . $destinationUrl);
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
exit;
