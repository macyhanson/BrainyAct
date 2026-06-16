# BrainyAct ROI Calculator — User Guide

## What Is This Calculator?

The BrainyAct ROI Calculator helps health plan administrators and employers
estimate how much money they can save by offering BrainyAct to their covered
population of children. It compares the cost of the BrainyAct program against
the reduction in therapy and crisis-care claims it is expected to produce.

---

## How to Use It

### Step 1 — Enter Your Population

| Field | What to Enter | Default |
|---|---|---|
| **Covered Children** | Total number of children on your plan | 500 |
| **BrainyAct Cost Per Child / Year** | Your contracted rate | $1,200 |

### Step 2 — Review (or Edit) the Therapy Lines

Each row in the table represents a category of care. All three columns are
editable so you can match your plan's actual claims experience.

| Column | Meaning |
|---|---|
| **Utilization %** | The percentage of your covered children who use this therapy in a given year |
| **Annual Cost / User** | What your plan pays per child who uses this therapy, per year |
| **Reduction %** | How much BrainyAct is expected to reduce utilization or cost for this therapy |

### Step 3 — Read the Results

Once you enter your numbers the calculator instantly shows:

- **Net Annual Savings** — the headline: gross savings minus what you pay for BrainyAct
- **ROI Multiple** — how many dollars you get back for every dollar spent (e.g. 3.2× means $3.20 returned per $1 invested)
- **Gross Savings** — total avoided claims before subtracting the program cost
- **Per-Member Net Savings** — net savings divided by the number of covered children
- **Savings by Therapy** — a bar chart showing which therapy lines drive the most savings

---

## The Math (Step by Step)

### Savings Per Therapy Line

```
Line Savings = Covered Children
             × (Utilization % ÷ 100)
             × Annual Cost Per User
             × (Reduction % ÷ 100)
```

**Example — ABA Therapy with 500 children:**

```
500 × (12% ÷ 100) × $48,000 × (25% ÷ 100)
= 500 × 0.12 × $48,000 × 0.25
= $720,000
```

### Gross Savings

```
Gross Savings = Sum of all Line Savings
```

### Program Cost

```
Program Cost = Covered Children × BrainyAct Cost Per Child Per Year
```

### Net Annual Savings

```
Net Savings = Gross Savings − Program Cost
```

### ROI Multiple

```
ROI Multiple = Gross Savings ÷ Program Cost
```

*(A result of 3.0× means you get $3 back in avoided claims for every $1 spent.)*

### Per-Member Net Savings

```
Per-Member Savings = Net Savings ÷ Covered Children
```

---

## Where the Default Numbers Come From

The pre-filled numbers are based on published healthcare cost benchmarks and
peer-reviewed utilization research for pediatric populations. They are starting
points — you should replace them with your own claims data when available.

| Therapy | Utilization % | Annual Cost / User | Reduction % | Primary Sources |
|---|---|---|---|---|
| **ABA Therapy** | 12% | $48,000 | 25% | CDC autism prevalence (~3% of children); ABA is intensive (20–40 hrs/wk). Average annual ABA cost from Medicaid and commercial claims studies (~$40K–$55K). Reduction based on early-intervention outcome literature. |
| **Occupational Therapy (OT)** | 22% | $3,200 | 20% | OT is one of the most commonly used pediatric therapies. Cost reflects typical outpatient session frequency and commercial reimbursement rates. |
| **Speech Therapy** | 25% | $4,100 | 20% | Speech/language disorders affect ~8–9% of children (ASHA); broader communication-delay coding brings utilization higher. Cost from commercial claims averages. |
| **Physical Therapy** | 11% | $2,600 | 15% | Pediatric PT is less prevalent; cost reflects shorter average course of treatment. |
| **Cognitive Therapy** | 14% | $5,500 | 25% | Includes CBT and other cognitive approaches for anxiety, ADHD, and learning differences. Utilization rising with increased mental-health diagnosis rates in children. |
| **Crisis / ER Visits** | 6% | $9,000 | 35% | Pediatric behavioral ER visits have risen sharply. Average cost per ER episode from HCUP and CMS data. Higher reduction rate reflects that proactive skill-building is a known ER-diversion strategy. |

> **Note:** These are population-level estimates. Actual plan experience varies by
> geography, benefit design, and demographics. Always validate against your own
> claims data before using results in financial projections.

---

## What Is Churn?

**Churn** (also called *attrition*) is the rate at which members leave your
covered population in a given year — because they change jobs, age out of a
plan, switch carriers, or for any other reason.

### Why Churn Matters for ROI

ROI from a preventive program like BrainyAct builds over time. If a child
develops stronger self-regulation skills in Year 1, the savings from fewer
therapy visits and ER trips often show up in Year 2 and Year 3. Churn
interrupts that payoff:

- A **low churn rate** (e.g., 10%/year) means most children stay on your plan
  long enough for the full benefit to be captured — your realized ROI is close
  to what the calculator shows.
- A **high churn rate** (e.g., 40%/year) means many children leave before the
  downstream savings materialize, so your *realized* ROI will be lower than the
  single-year estimate.

### Rule of Thumb

```
Effective ROI Multiple ≈ Calculator ROI × (1 − Annual Churn Rate)
```

**Example:**
Calculator shows 3.2× ROI. Your plan has 25% annual churn.

```
3.2 × (1 − 0.25) = 3.2 × 0.75 = 2.4× effective ROI
```

Plans with low churn (large self-insured employers, stable Medicaid managed-care
populations) typically capture more of the projected savings than high-turnover
commercial or marketplace plans.

---

## Quick-Reference Glossary

| Term | Definition |
|---|---|
| **Utilization Rate** | The share of covered members who actually use a given service |
| **Annual Cost Per User** | Average plan spend per member who uses a service, per year |
| **Reduction %** | Expected decrease in utilization or cost attributable to BrainyAct |
| **Gross Savings** | Total avoided claims across all therapy lines |
| **Program Cost** | What you pay BrainyAct (members × per-child rate) |
| **Net Savings** | Gross Savings minus Program Cost — your bottom-line benefit |
| **ROI Multiple** | Gross Savings ÷ Program Cost; how many dollars returned per dollar spent |
| **Churn** | The annual rate at which members leave your covered population |

---

*Document generated for BrainyAct — internal reference.*
