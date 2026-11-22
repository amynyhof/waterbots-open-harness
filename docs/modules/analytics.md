# Analytics — module rulings

- Vercel Web Analytics only: cookie-free page views, and no other tracking. `@vercel/analytics` is
  mounted once in `src/main.tsx`.
- Every page view is cut to the site and the path (`src/lib/analytics.ts`), so a carried `?question=`
  and a supporter's `#edit=` key never leave the page.
