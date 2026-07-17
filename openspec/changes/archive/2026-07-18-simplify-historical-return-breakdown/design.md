## Context

The breakdown summary row currently shows only `priceReturn`, while expanding the row shows a separate historical-returns panel containing both price and dividend returns. This duplicates the price return and hides dividend return behind expansion even though both values are short, read-only percentages.

## Goals / Non-Goals

**Goals:**

- Show price and dividend returns together in every historical summary row.
- Make the two return types unambiguous in the table header.
- Remove the duplicated return panel from expanded detail.
- Preserve the existing responsive table and tax/fee drill-down behavior.

**Non-Goals:**

- Changing historical data, simulation records, calculations, or formatting.
- Adding return editing or tooltips.
- Restructuring tax or fee detail panels.

## Decisions

### Keep one compact return column

Keep the existing return column and change its header to identify the display order as `Price / Dividend`. Each historical row shows the price return on the first line and dividend return on the second line.

Alternative considered: separate price and dividend columns. Rejected because the extra column consumes unnecessary mobile width when both values fit cleanly in one cell.

### Remove returns from expanded detail

Delete the historical-returns panel from `ExpandedYear`. Expanded rows begin directly with the existing InvestNow and IBKR tax/fee grids.

### Preserve the initial-state row

Year 0 continues to display an em dash in the return column because it has no mapped historical year.

### Preserve the existing table shape

The table keeps its existing column count and expanded-row colspans. No new responsive component or CSS abstraction is needed.

## Risks / Trade-offs

- **Stacked percentages could be misread** -> The header explicitly states `Price / Dividend`, and the cell preserves that top-to-bottom order.
- **Removing returns from expanded detail eliminates a larger labelled panel** -> Both values remain visible in every summary row before expansion.

## Migration Plan

Update the breakdown component, run the existing test suite and build, then verify the table at mobile and desktop widths. Rollback is a normal source revert.

## Open Questions

None.
