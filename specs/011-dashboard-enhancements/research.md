# Research: Dashboard Layout and Component Enhancements

## Phase 0 Research

This document outlines the design decisions and research findings for the recruitment dashboard enhancements.

### 1. Charting Selection
* **Decision**: Implement a custom SVG-based line and area chart in React rather than adding third-party charting libraries like Recharts, Chart.js, or ApexCharts.
* **Rationale**:
  - **Performance (NFR-001)**: The constitution and spec demand highly lightweight page weights. Third-party charting libraries pull in large D3 modules or Canvas engines, inflating client-side bundle size by 150KB+.
  - **Responsiveness (NFR-003)**: A native SVG element with a proper `viewBox="0 0 500 220"` can automatically scale to its parent width using CSS (`width: 100%`).
  - **Flexibility**: We can easily render lines, area paths, grids, and dots with native React code without library-specific configurations.
* **Alternatives Considered**:
  - **Recharts**: Standard React charting library. Rejected because of package weight (~120KB gzipped) and setup overhead for a single simple line chart.
  - **Chart.js**: Rejected because it relies on HTML5 Canvas, which is less accessible and less customizable via standard React props/state.

### 2. Layout Alignment for Pipeline Breakdown
* **Decision**: Use Tailwind Flexbox utility classes to structure each stage row, rather than custom grid layouts that break on narrow viewports.
* **Rationale**:
  - Flexbox `justify-between` and `items-center` will guarantee badge and candidate count are perfectly pinned on opposite ends.
  - A block element below the flex container will cleanly render the progress bar without overlapping potential.
  - Computation of relative percentages: `(stageCount / totalCount) * 100` with standard fallback `totalCount === 0 ? 0 : percent`.

### 3. Icon Strategy
* **Decision**: Inline custom SVG vectors directly into the code instead of importing from `lucide-react` or `react-icons`.
* **Rationale**:
  - Maintains style consistency with other layout components (e.g. `Sidebar.tsx` and `WorkspaceSwitcher.tsx` which use custom inline SVG elements).
  - Eliminates dependency footprints and optimizes performance.

### 4. Table Optimization
* **Decision**: Utilize HTML `<colgroup>` and explicit width assignments (`w-[40%]`, `w-[20%]`, etc.) for jobs performance table.
* **Rationale**:
  - Prevents cell text wrapping bugs on medium/large viewports.
  - Keeps columns cleanly aligned.
  - Zebra striping is implemented using native `odd:bg-surface-2/20` classes to support Tailwind 4 custom themes.
