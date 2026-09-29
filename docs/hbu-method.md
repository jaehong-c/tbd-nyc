# HBU method

The procedure the HBU module follows. It is the written form of `lib/hbu/engine.js`; the
numbers it uses live in `lib/hbu/assumptions.json` and in whatever the user edits on screen.
Origin: a written analysis procedure plus a separate NYC assumption table, built in April
2026 for a broker opinion of value on 305 East 46th Street. Rebuilt here as code and data.

## Inputs

Building: address, submarket, gross SF, floors, typical floor SF, year built, zoning, full
real estate taxes ($/SF/yr), optional acquisition basis, whether the lot is in Manhattan
below 96th Street, whether the district permits residential use.

## Program checks

- 467-m: commercial building built before 1991, district permits residential, at least 25% of
  units affordable at a weighted average of 80% AMI. Exemption 90% for 35 years in Manhattan
  below 96th Street, 65% for 35 years elsewhere.
- City of Yes conversion eligibility: built before 1991, district permits residential.

Each flag reports the rule it applied so a reviewer can disagree with the rule.

## Scenario 1: office repositioning

GPR = rentable SF x market rent. EGI = GPR x stabilized occupancy. NOI = EGI less opex less
full taxes. Value = NOI / cap rate. Cost = repositioning capex + leasing costs on the
stabilized occupied area + 5% carry. Yield on cost = NOI / cost.
Land residual = value / (1 + buyer margin) less cost.

## Scenario 2: condo conversion

Sellable SF = gross SF x efficiency. Units = sellable / average unit SF. Gross sellout =
sellable SF x sellout $/SF. Cost = hard + soft (share of hard) + contingency (share of hard)
+ carry (share of hard plus soft) + sales and closing (share of sellout). Developer profit =
profit target x gross sellout. Land residual = sellout less cost less profit. Margin on cost =
(sellout less cost) / cost.

## Scenario 3: multifamily rental conversion with 467-m

Rentable SF = gross SF x efficiency. Units = rentable / average unit SF. Affordable units =
25% of units when 467-m applies. GPR is unit level: market units x (unit SF x market rent
/ 12) x 12, plus affordable units x program rent x 12. A blended $/SF is not used because it
overstates income when a quarter of the units rent at program levels. EGI = GPR x (1 -
vacancy). Taxes = full taxes x (1 - exemption). NOI = EGI less opex less taxes. Value = NOI /
cap rate. Cost = hard + soft + contingency + carry (about $400/gross SF all-in at defaults).
Yield on cost = NOI / cost. Land residual = NOI / target yield on cost less cost.

## Recommendation

Default rule: the highest land residual value wins, because the residual is the price a
developer could pay for the building under each use. Ties within 5% go to the higher return
on cost, then to the shorter path to stabilization. The user can rank by value over total
cost instead. The model writes the rationale afterwards from the figures on screen and does
not change a number.

## Calibration

At defaults, the 305 East 46th Street sample (143,000 gross SF, built 1959, $15/SF taxes)
returns rental NOI about $5.3M, stabilized value about $106M at a 5.0% cap, conversion cost
about $58M, yield on cost 9.2%, and a rental land residual of about $24M ($165/SF) against a
condo land residual of about $59M ($414/SF). These match the April 2026 analysis within
rounding.

## Limitations

First-pass valuation, not an appraisal. No comparable sales, no actual rent roll, no floor
plate test for conversion, no financing structure. Nothing here is investment advice.
