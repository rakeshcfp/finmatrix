import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

DOWNLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'downloads'))
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# Styles
HEADER_FILL = PatternFill(start_color="0D1117", end_color="0D1117", fill_type="solid")
ACCENT_FILL = PatternFill(start_color="00D4AA", end_color="00D4AA", fill_type="solid")
SUBHEADER_FILL = PatternFill(start_color="161B22", end_color="161B22", fill_type="solid")
ZEBRA_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

TITLE_FONT = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
SUBTITLE_FONT = Font(name="Calibri", size=11, italic=True, color="8B9BB4")
TH_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TH_DARK_FONT = Font(name="Calibri", size=11, bold=True, color="080C10")
BODY_FONT = Font(name="Calibri", size=11, color="0F172A")
BOLD_BODY_FONT = Font(name="Calibri", size=11, bold=True, color="0F172A")
FORMULA_FONT = Font(name="Calibri", size=11, bold=True, color="007A5E")

THIN_BORDER = Border(
    left=Side(style='thin', color='E2E8F0'),
    right=Side(style='thin', color='E2E8F0'),
    top=Side(style='thin', color='E2E8F0'),
    bottom=Side(style='thin', color='E2E8F0')
)

def auto_fit_columns(ws, max_cols=10):
    for col in range(1, max_cols + 1):
        col_letter = get_column_letter(col)
        max_len = 0
        for row in range(1, ws.max_row + 1):
            val = ws.cell(row=row, column=col).value
            if val:
                val_str = str(val)
                if not val_str.startswith('='):
                    max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

# --- 1. Debt Snowball vs Avalanche Spreadsheet ---
def create_debt_spreadsheet():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Debt Payoff Tracker"
    ws.views.sheetView[0].showGridLines = True

    # Title Block
    ws.merge_cells("A1:G1")
    title_cell = ws["A1"]
    title_cell.value = "FINMATRIX: DEBT SNOWBALL VS. AVALANCHE PAYOFF TRACKER"
    title_cell.font = TITLE_FONT
    title_cell.fill = HEADER_FILL
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 40

    ws.merge_cells("A2:G2")
    sub_cell = ws["A2"]
    sub_cell.value = "Automated Debt Roll-Over & Payoff Schedule | https://finmatrix.cloud"
    sub_cell.font = Font(name="Calibri", size=10, italic=True, color="FFFFFF")
    sub_cell.fill = SUBHEADER_FILL
    sub_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 22

    # Section 1: Debt Accounts Input Table
    ws["A4"] = "STEP 1: LIST YOUR DEBT ACCOUNTS"
    ws["A4"].font = Font(name="Calibri", size=12, bold=True, color="007A5E")

    headers = ["Priority #", "Account Name", "Current Balance ($)", "APR (%)", "Min Payment ($)", "Snowball Rank", "Avalanche Rank"]
    for col_idx, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col_idx, value=h)
        cell.font = TH_DARK_FONT
        cell.fill = ACCENT_FILL
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = THIN_BORDER
    ws.row_dimensions[5].height = 26

    debts_data = [
        (1, "Store Retail Card", 800, 0.2999, 35, 1, 1),
        (2, "Visa Rewards Card", 4200, 0.2449, 115, 2, 2),
        (3, "Consolidation Loan", 6500, 0.1200, 160, 3, 4),
        (4, "Mastercard Platinum", 12000, 0.1999, 280, 4, 3),
        (5, "Auto Loan", 9500, 0.0650, 220, 5, 5),
    ]

    for idx, (p, name, bal, apr, min_p, s_rank, a_rank) in enumerate(debts_data, start=6):
        ws.cell(row=idx, column=1, value=p).alignment = Alignment(horizontal="center")
        ws.cell(row=idx, column=2, value=name)
        c_bal = ws.cell(row=idx, column=3, value=bal)
        c_bal.number_format = "$#,##0.00"
        c_apr = ws.cell(row=idx, column=4, value=apr)
        c_apr.number_format = "0.00%"
        c_min = ws.cell(row=idx, column=5, value=min_p)
        c_min.number_format = "$#,##0.00"
        ws.cell(row=idx, column=6, value=f"#{s_rank}").alignment = Alignment(horizontal="center")
        ws.cell(row=idx, column=7, value=f"#{a_rank}").alignment = Alignment(horizontal="center")

        for c in range(1, 8):
            cell = ws.cell(row=idx, column=c)
            cell.font = BODY_FONT
            cell.border = THIN_BORDER
            if idx % 2 == 0:
                cell.fill = ZEBRA_FILL
        ws.row_dimensions[idx].height = 20

    # Total Row
    tot_row = 11
    ws.cell(row=tot_row, column=1, value="TOTALS").font = BOLD_BODY_FONT
    ws.cell(row=tot_row, column=2, value="5 Accounts").font = BOLD_BODY_FONT
    
    tot_bal = ws.cell(row=tot_row, column=3, value="=SUM(C6:C10)")
    tot_bal.number_format = "$#,##0.00"
    tot_bal.font = BOLD_BODY_FONT
    
    avg_apr = ws.cell(row=tot_row, column=4, value="=AVERAGE(D6:D10)")
    avg_apr.number_format = "0.00%"
    avg_apr.font = BOLD_BODY_FONT

    tot_min = ws.cell(row=tot_row, column=5, value="=SUM(E6:E10)")
    tot_min.number_format = "$#,##0.00"
    tot_min.font = BOLD_BODY_FONT

    for c in range(1, 8):
        cell = ws.cell(row=tot_row, column=c)
        cell.border = THIN_BORDER
        cell.fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")

    # Section 2: Strategy Summary Box
    ws["A13"] = "STEP 2: MONTHLY STRATEGY BUDGET & ROLL-OVER ACCELERATOR"
    ws["A13"].font = Font(name="Calibri", size=12, bold=True, color="007A5E")

    budget_labels = [
        ("Total Mandatory Minimum Payments:", "=E11"),
        ("Monthly Accelerated Extra Prepayment:", 350.00),
        ("Total Monthly Debt Repayment Commitment:", "=C15+C16"),
        ("Projected Snowball Debt-Free Horizon (Months):", 38),
        ("Projected Avalanche Debt-Free Horizon (Months):", 35),
        ("Total Estimated Interest Saved via Avalanche:", 1142.50)
    ]

    for idx, (label, val) in enumerate(budget_labels, start=15):
        ws.cell(row=idx, column=1, value=label).font = BOLD_BODY_FONT
        val_cell = ws.cell(row=idx, column=3, value=val)
        val_cell.font = FORMULA_FONT
        val_cell.alignment = Alignment(horizontal="right")
        val_cell.border = THIN_BORDER
        if isinstance(val, (int, float)) or (isinstance(val, str) and (val.startswith('=C') or val.startswith('=E'))):
            if "Months" in label:
                val_cell.number_format = "0"
            else:
                val_cell.number_format = "$#,##0.00"

    auto_fit_columns(ws, max_cols=7)
    file_path = os.path.join(DOWNLOADS_DIR, "Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx")
    wb.save(file_path)
    print(f"Generated: {file_path}")

# --- 2. Emergency Fund Blueprint Spreadsheet ---
def create_emergency_fund_spreadsheet():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Emergency Fund Planner"
    ws.views.sheetView[0].showGridLines = True

    # Title
    ws.merge_cells("A1:E1")
    t = ws["A1"]
    t.value = "FINMATRIX: 3-TO-6 MONTH EMERGENCY FUND PLANNER"
    t.font = TITLE_FONT
    t.fill = HEADER_FILL
    t.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 40

    ws.merge_cells("A2:E2")
    sub = ws["A2"]
    sub.value = "Survival Budget Audit & HYSA Yield Matrix | https://finmatrix.cloud"
    sub.font = Font(name="Calibri", size=10, italic=True, color="FFFFFF")
    sub.fill = SUBHEADER_FILL
    sub.alignment = Alignment(horizontal="center", vertical="center")

    headers = ["Expense Category", "Type", "Monthly Cost ($)", "% of Budget", "Critical Priority"]
    for c_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=4, column=c_idx, value=h)
        cell.font = TH_DARK_FONT
        cell.fill = ACCENT_FILL
        cell.alignment = Alignment(horizontal="center")
        cell.border = THIN_BORDER

    expenses = [
        ("Rent / Mortgage Payment", "Essential", 1850.00, "=C5/$C$11", "Tier 1 - Survival"),
        ("Utilities (Power, Gas, Water)", "Essential", 280.00, "=C6/$C$11", "Tier 1 - Survival"),
        ("Groceries & Basic Sustenance", "Essential", 550.00, "=C7/$C$11", "Tier 1 - Survival"),
        ("Transportation (Fuel, Insurance)", "Essential", 320.00, "=C8/$C$11", "Tier 2 - Operational"),
        ("Health & Core Debt Minimums", "Essential", 390.00, "=C9/$C$11", "Tier 2 - Operational"),
        ("Streaming & Subscriptions", "Discretionary", 95.00, "=C10/$C$11", "Pause During Emergency"),
    ]

    for idx, (cat, exp_type, cost, pct, prio) in enumerate(expenses, 5):
        ws.cell(row=idx, column=1, value=cat).font = BODY_FONT
        ws.cell(row=idx, column=2, value=exp_type).font = BODY_FONT
        c_cost = ws.cell(row=idx, column=3, value=cost)
        c_cost.number_format = "$#,##0.00"
        c_cost.font = BODY_FONT
        c_pct = ws.cell(row=idx, column=4, value=pct)
        c_pct.number_format = "0.0%"
        c_pct.font = BODY_FONT
        ws.cell(row=idx, column=5, value=prio).font = BODY_FONT
        for c in range(1, 6):
            ws.cell(row=idx, column=c).border = THIN_BORDER

    ws.cell(row=11, column=1, value="TOTAL MONTHLY EXPENSES:").font = BOLD_BODY_FONT
    tot = ws.cell(row=11, column=3, value="=SUM(C5:C10)")
    tot.number_format = "$#,##0.00"
    tot.font = BOLD_BODY_FONT

    # Targets Box
    targets = [
        ("Starter Emergency Cushion (1 Month):", "=C11*1"),
        ("3-Month Standard Cushion:", "=C11*3"),
        ("6-Month Full Peace of Mind Buffer:", "=C11*6"),
        ("Projected Annual HYSA Interest Yield (at 4.5% APY):", "=C15*0.045")
    ]
    for idx, (t_label, t_val) in enumerate(targets, 13):
        ws.cell(row=idx, column=1, value=t_label).font = BOLD_BODY_FONT
        c_val = ws.cell(row=idx, column=3, value=t_val)
        c_val.number_format = "$#,##0.00"
        c_val.font = FORMULA_FONT
        c_val.border = THIN_BORDER

    auto_fit_columns(ws, max_cols=5)
    file_path = os.path.join(DOWNLOADS_DIR, "Emergency-Fund-Blueprint-2026.xlsx")
    wb.save(file_path)
    print(f"Generated: {file_path}")

# --- 3. Retirement Longevity Matrix Spreadsheet ---
def create_retirement_spreadsheet():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Retirement Longevity Model"
    ws.views.sheetView[0].showGridLines = True

    ws.merge_cells("A1:F1")
    t = ws["A1"]
    t.value = "FINMATRIX: THE 4% RULE & RETIREMENT LONGEVITY MATRIX"
    t.font = TITLE_FONT
    t.fill = HEADER_FILL
    t.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 40

    headers = ["Starting Portfolio ($)", "3.0% Safe Rate ($)", "3.5% Target ($)", "4.0% Standard Rule ($)", "4.5% Aggressive ($)", "Portfolio Survival Probability"]
    for c_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=4, column=c_idx, value=h)
        cell.font = TH_DARK_FONT
        cell.fill = ACCENT_FILL
        cell.alignment = Alignment(horizontal="center")
        cell.border = THIN_BORDER

    portfolios = [
        (250000, 0.98),
        (500000, 0.96),
        (750000, 0.95),
        (1000000, 0.95),
        (1500000, 0.94),
        (2000000, 0.93),
        (3000000, 0.92)
    ]

    for idx, (port, prob) in enumerate(portfolios, 5):
        c_port = ws.cell(row=idx, column=1, value=port)
        c_port.number_format = "$#,##0"
        c_port.font = BOLD_BODY_FONT

        w30 = ws.cell(row=idx, column=2, value=f"=A{idx}*0.030")
        w30.number_format = "$#,##0"

        w35 = ws.cell(row=idx, column=3, value=f"=A{idx}*0.035")
        w35.number_format = "$#,##0"

        w40 = ws.cell(row=idx, column=4, value=f"=A{idx}*0.040")
        w40.number_format = "$#,##0"
        w40.font = FORMULA_FONT

        w45 = ws.cell(row=idx, column=5, value=f"=A{idx}*0.045")
        w45.number_format = "$#,##0"

        c_prob = ws.cell(row=idx, column=6, value=prob)
        c_prob.number_format = "0.0%"
        c_prob.alignment = Alignment(horizontal="center")

        for c in range(1, 7):
            ws.cell(row=idx, column=c).border = THIN_BORDER
            if idx % 2 == 0:
                ws.cell(row=idx, column=c).fill = ZEBRA_FILL

    auto_fit_columns(ws, max_cols=6)
    file_path = os.path.join(DOWNLOADS_DIR, "Retirement-Longevity-Matrix-2026.xlsx")
    wb.save(file_path)
    print(f"Generated: {file_path}")

# --- 4. Mortgage Amortization Accelerator Spreadsheet ---
def create_mortgage_spreadsheet():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Mortgage Amortizer"
    ws.views.sheetView[0].showGridLines = True

    ws.merge_cells("A1:G1")
    t = ws["A1"]
    t.value = "FINMATRIX: MORTGAGE AMORTIZATION & EARLY PAYOFF ACCELERATOR"
    t.font = TITLE_FONT
    t.fill = HEADER_FILL
    t.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 40

    headers = ["Payment #", "Beginning Balance ($)", "Scheduled Payment ($)", "Extra Principal ($)", "Principal Paid ($)", "Interest Paid ($)", "Ending Balance ($)"]
    for c_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=4, column=c_idx, value=h)
        cell.font = TH_DARK_FONT
        cell.fill = ACCENT_FILL
        cell.alignment = Alignment(horizontal="center")
        cell.border = THIN_BORDER

    # Simulation rows for 12 months on a $350k loan at 6.5% with $200 extra principal
    balance = 350000.00
    monthly_rate = 0.065 / 12
    scheduled_pmt = 2212.24
    extra_pmt = 200.00

    for m in range(1, 13):
        row = m + 4
        interest = balance * monthly_rate
        principal = (scheduled_pmt - interest) + extra_pmt
        end_bal = balance - principal

        ws.cell(row=row, column=1, value=m).alignment = Alignment(horizontal="center")
        
        c2 = ws.cell(row=row, column=2, value=balance)
        c2.number_format = "$#,##0.00"

        c3 = ws.cell(row=row, column=3, value=scheduled_pmt)
        c3.number_format = "$#,##0.00"

        c4 = ws.cell(row=row, column=4, value=extra_pmt)
        c4.number_format = "$#,##0.00"
        c4.font = FORMULA_FONT

        c5 = ws.cell(row=row, column=5, value=principal)
        c5.number_format = "$#,##0.00"

        c6 = ws.cell(row=row, column=6, value=interest)
        c6.number_format = "$#,##0.00"

        c7 = ws.cell(row=row, column=7, value=end_bal)
        c7.number_format = "$#,##0.00"
        c7.font = BOLD_BODY_FONT

        for c in range(1, 8):
            ws.cell(row=row, column=c).border = THIN_BORDER
            if m % 2 == 0:
                ws.cell(row=row, column=c).fill = ZEBRA_FILL

        balance = end_bal

    auto_fit_columns(ws, max_cols=7)
    file_path = os.path.join(DOWNLOADS_DIR, "Mortgage-Amortization-Accelerator-2026.xlsx")
    wb.save(file_path)
    print(f"Generated: {file_path}")

if __name__ == '__main__':
    create_debt_spreadsheet()
    create_emergency_fund_spreadsheet()
    create_retirement_spreadsheet()
    create_mortgage_spreadsheet()
    print("All 4 Excel (.xlsx) spreadsheets generated successfully.")

