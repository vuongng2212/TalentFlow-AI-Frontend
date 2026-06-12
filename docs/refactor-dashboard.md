Please rewrite the dashboard page `TalentFlow-AI-Frontend/app/(workspace)/dashboard/page.tsx` with the following enhancements:

1. **Fix Pipeline Breakdown Layout Bug**:
   - Resolve the text overlapping issue in the pipeline stages list (e.g., "APPLIED0 candidate(s)").
   - Use Tailwind Flexbox to align the stage badge to the left and candidate count to the right.
   - Add a subtle horizontal progress bar underneath each stage to represent its share relative to the total number of applications.

2. **Render Application Trends Chart**:
   - Implement a clean SVG-based or lightweight chart (using a clean Tailwind layout) to visualize the `trends` state (daily application volume).
   - Display it in a new card named "Recruitment Activity Trend" spanning full width or adjacent to the pipeline breakdown.

3. **Modernize Stat Cards**:
   - Redesign the 4 top metrics cards with custom backgrounds, matching icons, and a clear visual hierarchy.
   - Display actual percentage changes or custom indicators for a premium SaaS look.

4. **Enhance Top Performing Jobs Table**:
   - Style the table with zebra striping, custom hover states, department icons, and explicit column widths.
   - Turn the applications count into a visual badge.