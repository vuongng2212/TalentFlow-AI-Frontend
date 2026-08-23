# Quickstart: Testing UX Density Improvements

Once the tasks are implemented, here's how to quickly test the changes:

1. **Start the dev server**: `pnpm dev`
2. **Navigate to the App**: Open http://localhost:3000
3. **Test Role Context**: Log in as different roles (Admin vs Recruiter) and observe the clear changes in sidebar context and headers.
4. **Test Data Sync**: Look at the Dashboard numbers, then navigate to Candidates/Jobs lists to ensure the numbers match exactly.
5. **Test Density**: View the Candidates list. It should display much more data vertically compared to the previous version without scrolling.
6. **Test Filters**: Apply multiple filters on a list. URL should update, and filter chips should appear. Select multiple items to reveal the bulk action bar.
7. **Test States**: Disconnect your network or introduce an artificial delay in the mock data to see the new `LoadingSkeleton` and `ErrorState` components.