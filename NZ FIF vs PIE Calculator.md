
# **Role and Objective**

You are an expert Financial Software Engineer and React architect. Build an interactive, single-page React application (using Tailwind CSS and Recharts/Chart.js) that simulates a 20-year investment comparison for a New Zealand investor.  
The application evaluates two specific investment vehicles:

1. **InvestNow Foundation Series (NZ Unlisted PIE Fund)**  
2. **Interactive Brokers (Direct US ETF subject to the NZ FIF tax regime)**

# **1\. State Variables & User Inputs**

The UI requires a professional control panel with the following inputs:

* **Initial Investment:** $0 to $500,000 (Default: $100,000)  
* **Periodic Contribution:** $0 to $10,000 (Default: $250)  
* **Contribution Frequency:** Dropdown \[Weekly, Fortnightly, Monthly, Annually\] (Default: Weekly)  
* **Expected Annual Market Return (Excluding Dividends):** 4% to 15% (Default: 8%)  
* **Dividend Yield:** 0% to 5% (Default: 1.5%)  
* **Marginal Income Tax Rate:** Dropdown \[10.5%, 17.5%, 30%, 33%, 39%\] (Default: 39%)  
* **PIE PIR (Prescribed Investor Rate):** Dropdown \[10.5%, 17.5%, 28%\] (Default: 28%)  
* **Number of "Crash" Years:** 0 to 5 (Default: 3). *Randomly select this many years out of the 20 to have a \-15% market return, which empirically demonstrates the volatility advantage of the FIF CV tax method.*

# **2\. Constants & Micro-Economic Fee Structures**

* **Exchange Rate:** 1 NZD \= 0.60 USD (Use for converting USD fixed fees back to NZD).  
* **Underlying ETF Management Fee:** 0.03% annually for both platforms.  
* **US Dividend Withholding Tax:** 15% on Gross Dividends.  
* **InvestNow Fees:**  
  * 0.50% buy transaction fee (deducted from the gross contribution before it is added to the balance).  
  * 0.50% sell transaction fee (deducted from the final aggregated balance at Year 20).  
  * FX Fees: $0.  
* **IBKR Fees (Cash Account Auto-Conversion & Tiered Pricing):**  
  * *FX Fee (Auto-Conversion):* 0.03% (3 basis points) of the NZD transaction amount.  
  * *Brokerage Fee (Tiered):* $0.35 USD minimum per order, capped at 1% of the trade value. Convert this USD fee to NZD.  
  * *Application:* Iteratively deduct the FX fee and Brokerage fee from every individual periodic contribution (e.g., 52 times a year for weekly) before the net amount enters the market.

# **3\. Tax Calculation Algorithms (Critical Legislative Logic)**

Tax is calculated and deducted from the closing balance at the conclusion of each simulated year.  
**InvestNow (PIE Fund) Tax Logic:**

* Operates under a strict Fair Dividend Rate (FDR) structure internally.  
* Taxable Income \= Opening Balance of the Year \* 0.05  
* PIE Tax Owed \= Taxable Income \* PIR  
* *Note: PIEs levy this tax even if the market return is negative. The 15% US withholding tax is handled internally and socialized, so the simulation simply deducts the PIE Tax Owed from the balance.*

**IBKR (Direct FIF) Tax Logic:**

* **Cost Base Tracking:** You must track the total NZD Cost Base, defined as Cumulative Net Contributions \+ Cumulative Net Reinvested Dividends.  
* **De Minimis Threshold:** The statutory threshold is $100,000 NZD.  
  * **If Cost Base ![][image9] 100,000:** Exempt from FIF.  
    * NZ Gross Tax \= Gross Dividends \* Marginal Rate  
    * Foreign Tax Credit (FTC) \= min(Gross Dividends \* 0.15, NZ Gross Tax)  
    * Net Tax Owed \= NZ Gross Tax \- FTC  
  * **If Cost Base \> 100,000:** The FIF regime applies, mandating the lesser of FDR or CV methods.  
    * Gross Dividends \= Balance \* Dividend Yield  
    * FTC \= Gross Dividends \* 0.15  
    * *FDR Method:*  
      * FDR Income \= Opening Balance \* 0.05  
      * FDR Gross Tax \= FDR Income \* Marginal Rate  
      * FDR Net Tax \= max(0, FDR Gross Tax \- min(FTC, FDR Gross Tax))  
    * *CV (Comparative Value) Method:*  
      * CV Income \= max(0, (Growth generated in year) \+ Gross Dividends \- Management Fee)  
      * CV Gross Tax \= CV Income \* Marginal Rate  
      * CV Net Tax \= max(0, CV Gross Tax \- min(FTC, CV Gross Tax))  
    * Net Tax Owed \= min(FDR Net Tax, CV Net Tax)

# **4\. The 20-Year Simulation Loop**

For both portfolios, initialize the Year 0 balance based on the Initial Investment (deducting the respective platform entry fees). For Years 1 through 20:

1. **Opening Balance:** Set to the previous year's closing balance.  
2. **Contributions:**  
   * *InvestNow:* Net Annual Contrib \= Total Annual Contrib \* (1 \- 0.005)  
   * *IBKR:* Loop through each specific contribution instance based on frequency to apply the 0.03% FX fee and the $0.35 USD Tiered minimum. Sum the remaining amounts for the Net Annual Contrib.  
3. **Pre-Tax Balance Expansion:**  
   * Temporary Balance \= Opening Balance \+ Net Annual Contrib  
   * Growth \= Temporary Balance \* Market Return (or \-15% if crash year)  
   * Gross Dividends \= Temporary Balance \* Dividend Yield  
   * Net Dividends \= Gross Dividends \* (1 \- 0.15 withholding tax)  
   * Temporary Balance \= Temporary Balance \+ Growth \+ Net Dividends  
4. **Management Fee:**  
   * Fee \= Temporary Balance \* 0.0003  
   * Temporary Balance \= Temporary Balance \- Fee  
5. **Taxation:**  
   * Apply the logic from Section 3\. Deduct the calculated Net Tax Owed from the Temporary Balance to lock in the true Closing Balance.  
6. **Year 20 Exit:** Apply the 0.50% exit fee to the final InvestNow balance. Apply a single IBKR FX and Tiered Brokerage fee to the final IBKR balance.

# **5\. Output & Visualization**

* **Main Chart:** An Area or Line chart mapping Year (X-axis) to Portfolio Balance (Y-axis) for both InvestNow and IBKR.  
* **Tax Drag Chart:** A bar chart showing the tax paid in each year by platform, highlighting the CV advantage during crash years.  
* **Summary Dashboard:**  
  * Total Principal Contributed  
  * Final Net Balance: InvestNow vs IBKR  
  * Total Platform/Management Fees Paid: InvestNow vs IBKR  
  * Total NZ Tax Paid: InvestNow vs IBKR

Ensure the React component utilizes useMemo for heavy iterative calculations and handles edge cases, such as when IBKR transaction minimums consume the entirety of a micro-contribution.

