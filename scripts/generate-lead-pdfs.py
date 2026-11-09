import os

DOWNLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'downloads'))
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

RESOURCES = [
    {
        'filename': 'Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf',
        'title': 'Finmatrix: Debt Snowball vs. Avalanche Payoff Toolkit',
        'subtitle': 'A Comprehensive Framework for Eliminating High-Interest Debt',
        'items': [
            '1. Debt Snowball Method: Order debts smallest balance to largest.',
            '   Psychological Quick Wins: Knocks out accounts fast for momentum.',
            '2. Debt Avalanche Method: Order debts highest APR to lowest APR.',
            '   Mathematical Savings: Minimizes total interest and shortens duration.',
            '3. Monthly Allocation: Pay minimums on all, roll leftover surplus into target.',
            '4. Balance Transfer Checklist: Watch for 3-5% transfer fees and promo periods.',
            '5. Emergency Cushion Rule: Maintain $1,000 to $2,500 liquid buffer during payoff.',
            'Visit https://finmatrix.cloud for live interactive debt payoff calculators.'
        ]
    },
    {
        'filename': 'Emergency-Fund-Blueprint-2026.pdf',
        'title': 'Finmatrix: 3-to-6 Month Emergency Fund Blueprint',
        'subtitle': 'Essential Liquidity Rules for Financial Security',
        'items': [
            '1. True Survival Baseline: Rent/Mortgage, Utilities, Groceries, Core Debt.',
            '2. Liquid Tier 1: 1 Month of expenses in primary checking/HYSA.',
            '3. Liquid Tier 2: 2-5 Months of expenses in top-tier High-Yield Savings.',
            '4. Yield Preservation: Keep cash working at competitive APY without lockup.',
            '5. Replenishment Rule: Treat emergency withdrawals as mandatory debt payoff.',
            'Visit https://finmatrix.cloud/calculators/emergency-fund-calculator.html'
        ]
    },
    {
        'filename': 'Retirement-Longevity-Matrix-2026.pdf',
        'title': 'Finmatrix: The 4 Percent Rule & Retirement Longevity Matrix',
        'subtitle': 'Sustainable Distribution and Withdrawal Strategies',
        'items': [
            '1. The 4 Percent Benchmark: Initial withdrawal adjusted annually for inflation.',
            '2. Sequence of Returns Risk: Buffer 2 years of cash/bonds to avoid selling equities.',
            '3. Tax Waterfall: Taxable accounts -> Traditional tax-deferred -> Roth accounts.',
            '4. Social Security Optimization: Delaying to 70 yields 8% annual delayed credits.',
            '5. Required Minimum Distributions (RMDs): Plan ahead for statutory age triggers.',
            'Visit https://finmatrix.cloud/calculators/retirement-calculator.html'
        ]
    },
    {
        'filename': 'Mortgage-Amortization-Accelerator-2026.pdf',
        'title': 'Finmatrix: Mortgage Amortization & Early Payoff Accelerator',
        'subtitle': 'Strategies to Shave 5 to 11 Years Off Your Home Loan',
        'items': [
            '1. Extra Principal Impact: Every dollar prepaid directly reduces compound interest.',
            '2. Bi-Weekly Payments: 26 half-payments equals 13 full payments per calendar year.',
            '3. Recast vs Refinance: A recast lowers monthly payment without resetting term.',
            '4. Break-Even Horizon: Refinance closing costs must be recouped within 24-36 months.',
            '5. Tax Considerations: Compare standard deduction vs mortgage interest itemization.',
            'Visit https://finmatrix.cloud/calculators/mortgage-calculator.html'
        ]
    }
]

def build_pdf(filepath, title, subtitle, items):
    text_lines = [
        f"BT",
        f"/F1 16 Tf",
        f"50 740 Td",
        f"({escape_pdf(title)}) Tj",
        f"/F2 11 Tf",
        f"0 -24 Td",
        f"({escape_pdf(subtitle)}) Tj",
        f"/F2 9 Tf",
        f"0 -18 Td",
        f"(Published by Finmatrix Financial Research Desk | https://finmatrix.cloud) Tj",
        f"0 -30 Td",
        f"/F1 11 Tf",
        f"(Key Strategic Framework & Action Items:) Tj",
        f"/F2 10 Tf"
    ]

    for item in items:
        text_lines.append(f"0 -20 Td")
        text_lines.append(f"({escape_pdf(item)}) Tj")

    text_lines.append(f"0 -40 Td")
    text_lines.append(f"/F2 8 Tf")
    text_lines.append(f"(Disclaimer: Educational reference only. Consult a licensed financial professional for personal advice.) Tj")
    text_lines.append("ET")

    stream_content = "\n".join(text_lines)
    stream_bytes = stream_content.encode('latin1')
    stream_len = len(stream_bytes)

    objects = []
    
    # Obj 1: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # Obj 2: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # Obj 3: Page
    objects.append(
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        "/Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n"
    )
    # Obj 4: Stream Content
    objects.append(
        f"4 0 obj\n<< /Length {stream_len} >>\nstream\n{stream_content}\nendstream\nendobj\n"
    )
    # Obj 5: Font Bold
    objects.append("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")
    # Obj 6: Font Regular
    objects.append("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")

    header = "%PDF-1.4\n"
    body = "".join(objects)

    # Calculate offsets
    offsets = [0]
    current_offset = len(header.encode('latin1'))

    for obj in objects:
        offsets.append(current_offset)
        current_offset += len(obj.encode('latin1'))

    xref = f"xref\n0 {len(offsets)}\n0000000000 65535 f \n"
    for off in offsets[1:]:
        xref += f"{off:010d} 00000 n \n"

    trailer = (
        f"trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\n"
        f"startxref\n{current_offset}\n%%EOF\n"
    )

    full_pdf = (header + body + xref + trailer).encode('latin1')

    with open(filepath, 'wb') as f:
        f.write(full_pdf)
    print(f"Generated PDF: {filepath} ({len(full_pdf)} bytes)")

def escape_pdf(text):
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

if __name__ == '__main__':
    for res in RESOURCES:
        out_path = os.path.join(DOWNLOADS_DIR, res['filename'])
        build_pdf(out_path, res['title'], res['subtitle'], res['items'])
    print("All Lead Magnet PDFs successfully generated.")

