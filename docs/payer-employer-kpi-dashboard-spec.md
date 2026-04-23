# BrainyAct Payer & Self-Insured Employer KPI Dictionary + Dashboard Spec

## 1) Purpose
This specification defines a standardized KPI framework and dashboard blueprint for:
- **Insurance payors** (commercial/Medicaid managed care)
- **Self-insured employers** (HR/benefits leaders, finance, and consultants)

The goal is to convert BrainyAct program engagement and clinical progress data into decision-grade **outcomes, utilization, and economic value** evidence.

---

## 2) Audience + Decision Use Cases

### Primary buyers
- Medical Director / Behavioral Health Director
- VP Population Health
- Actuarial / Finance team
- Employer Benefits leader and broker/consultant

### Core decisions this dashboard must support
1. Should we launch/expand BrainyAct?
2. Which member cohorts should be prioritized?
3. Is the program creating measurable value against baseline/control?
4. Should we continue, renegotiate, or scale contract terms?

---

## 3) KPI Dictionary (Canonical)

> **Conventions**
> - Reporting period defaults: monthly and rolling 12 months.
> - Cohort eligibility: members with ≥1 baseline assessment and defined enrollment window.
> - Segment cuts: age band, condition/risk segment, geography, line of business, employer group.

## A. Enrollment & Reach KPIs

### KPI A1 — Eligible Population
- **Definition:** Total members meeting clinical/benefit eligibility criteria in period.
- **Formula:** `count(distinct member_id where eligibility_flag = 1)`
- **Grain:** monthly
- **Owner:** Ops + Analytics
- **Why it matters:** denominator for penetration and impact estimates.

### KPI A2 — Enrolled Members
- **Definition:** Members with completed onboarding and first program activation.
- **Formula:** `count(distinct member_id where enrollment_status = 'enrolled')`
- **Derived views:** by referral source, employer site, provider group.

### KPI A3 — Penetration Rate
- **Definition:** Share of eligible members who enroll.
- **Formula:** `enrolled_members / eligible_population`
- **Target guidance:** payer benchmark bands set by launch phase.

## B. Engagement & Adherence KPIs

### KPI B1 — 30-Day Activation Rate
- **Definition:** Enrolled members completing first session within 30 days.
- **Formula:** `members_with_session_within_30d / enrolled_members`

### KPI B2 — Session Adherence (8-Week)
- **Definition:** Members completing program-defined minimum session cadence in first 8 weeks.
- **Formula:** `members_meeting_cadence / members_with_8w_observation`
- **Default cadence:** configurable (e.g., ≥2 sessions/week average).

### KPI B3 — Program Persistence
- **Definition:** Members active at day 30/60/90.
- **Formula:** `active_members_day_n / enrolled_members`
- **Display:** 30/60/90 waterfall.

### KPI B4 — Assessment Completion Rate
- **Definition:** Members completing required reassessments by protocol window.
- **Formula:** `members_with_followup_assessment / eligible_for_followup`

## C. Clinical / Functional Outcomes KPIs

### KPI C1 — Total Symptom Burden Change
- **Definition:** Mean change in total baseline symptom percentage (lower is better).
- **Formula:** `mean(baseline_total_pct - followup_total_pct)`
- **Variants:** absolute points and relative % improvement.

### KPI C2 — Domain Improvement Index
- **Definition:** Average domain-level point improvements across Motor/Sensory/Behavior/Communication/Academic/Health.
- **Formula:** `mean(sum(domain_baseline_pct - domain_followup_pct) / number_of_domains)`

### KPI C3 — Responder Rate
- **Definition:** Members achieving clinically meaningful improvement threshold.
- **Formula:** `members_with_total_pct_improvement >= threshold / members_with_followup`
- **Default threshold:** 10-point absolute reduction (configurable by evidence committee).

### KPI C4 — Deterioration Rate
- **Definition:** Members with worsening beyond tolerance threshold.
- **Formula:** `members_with_total_pct_change <= -threshold / members_with_followup`

### KPI C5 — Time-to-Response
- **Definition:** Median days from activation to first responder status.
- **Formula:** `median(response_date - activation_date)`

## D. Utilization & Cost KPIs (Payer Grade)

### KPI D1 — PMPM Allowed Cost Change
- **Definition:** Change in per-member-per-month allowed spend pre vs post enrollment.
- **Formula:** `post_pmpm_allowed - pre_pmpm_allowed`
- **Risk adjustment:** required (risk score and seasonality adjusted).

### KPI D2 — Behavioral Health Acute Event Rate
- **Definition:** ED/inpatient behavioral events per 1,000 members.
- **Formula:** `events / member_months * 1000`
- **Display:** pre/post and matched-control difference-in-differences.

### KPI D3 — Therapy Intensity Shift
- **Definition:** Change in high-intensity service use (e.g., crisis visits, high-cost therapies) where contractually relevant.
- **Formula:** `post_rate - pre_rate`

### KPI D4 — Medication Escalation Rate
- **Definition:** New starts or dose escalations in specified medication classes (if available/appropriate).
- **Formula:** `members_with_escalation / eligible_members`

### KPI D5 — Net Savings
- **Definition:** Savings net of program fees.
- **Formula:** `(avoided_costs - program_fees)`
- **Companion KPI:** ROI multiple = `avoided_costs / program_fees`.

## E. Employer Productivity KPIs (Self-Insured)

### KPI E1 — Parent/Caregiver Absence Days
- **Definition:** Change in caregiver work absence days where data is available.
- **Formula:** `post_absence_days - pre_absence_days`

### KPI E2 — Presenteeism Proxy Score
- **Definition:** Standardized survey-based productivity proxy delta.
- **Formula:** `post_score - pre_score`

### KPI E3 — High-Cost Claimant Migration
- **Definition:** Share transitioning into/out of top-cost claimant strata.
- **Formula:** `members_in_top_x_percent_cost_bucket / covered_members`

## F. Equity, Access, and Quality KPIs

### KPI F1 — Outcome Equity Gap
- **Definition:** Difference in responder rates across demographic groups.
- **Formula:** `max(responder_rate_group) - min(responder_rate_group)`

### KPI F2 — Access Lag
- **Definition:** Days from referral to activation.
- **Formula:** `median(activation_date - referral_date)`

### KPI F3 — Data Completeness
- **Definition:** Required field completion score across data domains.
- **Formula:** `completed_required_fields / total_required_fields`

---

## 4) Metric Governance
- Every KPI must have: owner, source system, refresh cadence, QA checks, and exception handling.
- Every KPI must support drill-down to member cohort definition and inclusion/exclusion logic.
- Thresholds requiring joint payer/employer agreement:
  - Responder definition
  - Minimum adherence
  - Savings attribution window

---

## 5) Dashboard Information Architecture

## Page 1 — Executive Value Snapshot
**Audience:** C-suite, Medical Director, CFO

### Sections
1. **Top-line cards (8–10)**
   - Eligible population
   - Enrolled members
   - Penetration rate
   - 30-day activation
   - Responder rate
   - PMPM delta
   - Net savings
   - ROI multiple
2. **Pre/Post + Control trend panel**
   - PMPM and acute event rates over time
3. **Contract performance gauge**
   - On-track / At-risk status against agreed guarantees

### Required filters
- Reporting period, line of business, employer group, age band, risk tier, geography.

## Page 2 — Clinical Outcomes & Engagement
**Audience:** Clinical ops + population health

### Visuals
- Baseline-to-follow-up improvement distribution (histogram)
- Domain improvement heatmap
- Responder funnel (enrolled → assessed → adherent → responder)
- Time-to-response survival curve
- Engagement cohort curves (retention 30/60/90)

### Drill paths
- Segment → cohort → site/provider → member list (permissioned)

## Page 3 — Utilization & Economic Impact
**Audience:** Actuarial and finance

### Visuals
- Difference-in-differences PMPM trend (program vs matched control)
- Event rates (ED/IP behavioral) per 1,000 member months
- Service mix shift (high-intensity vs routine services)
- Net savings waterfall:
  - gross avoided cost
  - program fee
  - implementation/admin
  - net value

### Confidence indicators
- Sample size, CI bars, p-value badges, maturity windows.

## Page 4 — Employer Productivity & Workforce Impact
**Audience:** HR/benefits

### Visuals
- Absence day trends
- Productivity proxy score trends
- Cost migration bands (high-cost claimant movement)
- Site/location comparison table

## Page 5 — Quality, Equity, and Data Integrity
**Audience:** Governance committees

### Visuals
- Equity gap matrix by key demographics
- Access lag trend by segment
- Data completeness and timeliness scorecards
- Outlier/anomaly panel with QA flags

---

## 6) Data Model Requirements

## Core entity model
- `member`
- `eligibility_period`
- `program_enrollment`
- `session_fact`
- `assessment_fact`
- `claims_fact` (or cost/utilization feed)
- `employer_productivity_fact` (if available)
- `cohort_assignment`

## Required fields (minimum viable)
- Identifiers: member_id, payer_id/employer_id, coverage segment
- Dates: referral, activation, sessions, assessments, claims service dates
- Program metrics: session count, adherence flags, baseline and follow-up scores
- Financials: allowed amount, paid amount, PMPM normalization factors
- Stratifiers: age band, risk tier, geography, product line

## Data refresh
- Program data: daily
- Claims/utilization: monthly (claims run-out aware)
- Productivity data: monthly/quarterly as available

---

## 7) KPI Calculation Rules (Critical)
1. **Observation windows**
   - Pre: typically 6 months before activation
   - Post: 6/12 months after activation
2. **Attribution model**
   - Intent-to-treat and as-treated views both required
3. **Risk adjustment**
   - Include baseline risk score and major confounders
4. **Control strategy**
   - Matched control preferred; if unavailable, interrupted time series with sensitivity checks
5. **Small-n suppression**
   - Suppress cells below agreed privacy threshold

---

## 8) Contracting / Commercial Metrics Layer
For value-based agreements, include contract scorecards:
- Engagement guarantee attainment
- Outcome guarantee attainment
- Economic guarantee attainment
- Shared-savings estimator with confidence bands

Suggested launch contract metrics:
1. Activation rate
2. 8-week adherence
3. Responder rate at follow-up
4. PMPM trend improvement vs control

---

## 9) Dashboard UX + Delivery Standards
- Load time: <5 seconds for top-level pages.
- Export: PDF for exec readouts, CSV for actuarial analysis.
- Role-based views: executive, clinical, actuarial, employer.
- Auditability: every KPI card links to metric definition + SQL lineage reference.

---

## 10) Implementation Plan (90 Days)

### Phase 1 (Weeks 1–3): Metric Governance + Data Contract
- Finalize KPI definitions and thresholds.
- Approve data dictionary and refresh SLAs.

### Phase 2 (Weeks 4–7): Data Pipeline + QA
- Build KPI marts.
- Implement QA tests for completeness, drift, and reconciliation.

### Phase 3 (Weeks 8–10): Dashboard Build
- Deliver Pages 1–3 first (buyer-critical).
- Add employer and equity pages.

### Phase 4 (Weeks 11–13): Pilot Readout + Sales Packaging
- Produce first payer/employer quarterly value report.
- Build 1-page “evidence summary” handout and contract scorecard.

---

## 11) Definition Appendix (Template)
Use this template per KPI in production documentation:
- KPI Name
- Business Question
- Formal Definition
- Formula
- Numerator
- Denominator
- Inclusion Criteria
- Exclusion Criteria
- Windowing Rules
- Risk Adjustment Inputs
- Segments
- Data Sources
- Refresh Cadence
- Owner
- QA Checks
- Known Limitations
