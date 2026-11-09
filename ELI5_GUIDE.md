# Finmatrix: The ELI5 Master Operating Guide (Explain Like I'm 5)

> 🧸 **Rule #1:** You don't need to know coding to run this site.  
> 🧸 **Rule #2:** Everything works with simple, copy-paste recipes.  
> 🧸 **Rule #3:** If a 5-year-old can follow a Lego instruction book, you can run Finmatrix.

---

## 1. How Finmatrix Works (In Plain English)

Imagine you have a **Toy Shop on the Internet**:

```
 ┌──────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
 │ 1. People on Google  │ ───► │ 2. Your Magic Tool/Page │ ───► │ 3. Free Gift Download  │
 │ "What is my payment?"│      │ Instant answer in 1 sec │      │ (Gives Name + WhatsApp)│
 └──────────────────────┘      └─────────────────────────┘      └────────────────────────┘
```

1. **The Visitors:** A person searches Google: *"What is my monthly car payment?"*
2. **The Answer:** They land on your page. They see a shiny, fast calculator. They move the sliders. In 1 second, they get their answer!
3. **The Money & Leads:**
   * **Money:** They click a button for a 0% credit card or car loan $\rightarrow$ You get paid **$50–$100**.
   * **Leads:** They see a big button: *"Download Free Excel Tracker"* $\rightarrow$ They type their **Name, Email, and WhatsApp number** to get it!

---

## 2. How to Add a Keyword (Pick Your Recipe)

You only have **3 recipes**. Pick the one you want today:

---

### 🍰 Recipe A: "I found ONE keyword on SEMrush" (Takes 5 seconds)

*Example:* You are on SEMrush and find:  
`payment calculator` (KD: 16%, Volume: 74,000).

You don't need a spreadsheet. Just open your computer terminal and paste this one line:

```powershell
npm run keyword -- --keyword "payment calculator" --volume 74000 --kd 16 --build
```

**What the computer does for you automatically:**
1. Writes a full 2,500-word guide explaining the math.
2. Puts the live calculator widget inside it.
3. Adds the free Excel download box.
4. Adds the new page to Google's map (`sitemap.xml`).
5. **Done!**

---

### 🍰 Recipe B: "I have a CSV file from SEMrush" (Takes 10 seconds)

You downloaded a spreadsheet from SEMrush with 50 keywords.

1. **Put the file here:**  
   Drop your file into the `data/` folder (name it anything, like `data/my-keywords.csv`).

2. **Tell the computer to build the top 3 biggest keywords:**  
   Paste this line into your terminal:
   ```powershell
   npm run ingest -- data/my-keywords.csv --top 3 --build
   ```

**Done!** The 3 biggest keywords are now live pages on your site.

---

### 🍰 Recipe C: "I want to add keywords by hand in a simple list"

1. Open this file on your computer:  
   [`data/keywords-template.csv`](file:///c:/Antigravity/finmatrix/data/keywords-template.csv)
2. Add your new keyword at the bottom of the list like this:
   ```csv
   used car loan interest rates,45000,24,Commercial,Auto Loans
   ```
3. Save the file.
4. Paste this in your terminal:
   ```powershell
   npm run ingest -- data/keywords-template.csv --keyword "used car loan interest rates" --build
   ```

**Done!**

---

## 3. Tool vs. Article: Which one should I make?

Ask yourself this **1 simple question**:

> *"Does the person want to TYPE NUMBERS into a calculator right now?"*

* **YES!** (e.g. `payment calculator`, `tax calculator`, `mortgage calculator`)  
  $\rightarrow$ **Make an Interactive Calculator Tool!** (People want instant answers).
* **NO!** (e.g. `how to calculate car payment`, `amortization schedule formula`, `debt snowball vs avalanche`)  
  $\rightarrow$ **Make an Educational Article!** (People want to read, learn, and see an embedded widget).
* **BOTH!** (e.g. high volume like 74K)  
  $\rightarrow$ **Do both!** The calculator tool ranks in Google's tool carousel, and the article ranks for all the question searches.

---

## 4. The Only 4 Commands You Ever Need to Know

Keep this cheat sheet on your desk:

| What you want to do | The command to copy-paste |
| :--- | :--- |
| **1. See your website on your computer** | `python -m http.server 8080` (Open `http://localhost:8080`) |
| **2. Add a single keyword** | `npm run keyword -- --keyword "your keyword" --build` |
| **3. Update everything on the site** | `npm run build` |
| **4. Pack the suitcase for Hostinger** | `npm run package` |

---

## 5. How to Put It on the Internet (Hostinger in 2 Minutes)

Whenever you make changes, do these 3 steps:

1. **Step 1:** In your terminal, type:
   ```powershell
   npm run package
   ```
   *This creates a zip file called `finmatrix-production-deploy.zip`.*

2. **Step 2:** Log in to **Hostinger** $\rightarrow$ Open **File Manager** $\rightarrow$ Go into `public_html/`.  
   Drag and drop `finmatrix-production-deploy.zip` into it.

3. **Step 3:** Open this link in your web browser:
   ```
   https://finmatrix.cloud/unzip.php
   ```
   *You will see a green message: "Extraction successful!".*

**You are done! Your website is live worldwide.**  
*(After unzipping, just delete `unzip.php` and the `.zip` file from Hostinger File Manager for safety).*

---

## 6. How the Free Download Trap Captures Leads

1. A visitor clicks **"Download Free Excel Spreadsheet"**.
2. A nice popup appears asking:
   * **First Name**
   * **Email Address**
   * **Mobile / WhatsApp Number** (with country flag dropdown)
3. When they click **"Unlock Downloads"**:
   * Both the **Excel (.xlsx)** and **PDF** buttons turn green instantly.
   * Their details are sent to your **n8n automation** (or saved into `leads_database.csv` on your server).
   * You now own a hot lead you can email or WhatsApp anytime!

> 💡 **Did we build the n8n workflow?**  
> **YES!** We created a 1-click importable workflow file at [`workflows/finmatrix-lead-capture-workflow.json`](file:///c:/Antigravity/finmatrix/workflows/finmatrix-lead-capture-workflow.json).  
> Open it, press `Ctrl+A` then `Ctrl+C`, and paste (`Ctrl+V`) into your n8n canvas. It will automatically deliver the emails, log to Google Sheets, and ping your phone!

