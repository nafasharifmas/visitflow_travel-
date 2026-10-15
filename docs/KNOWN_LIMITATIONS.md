# Known limitations
1. **Backend not executed** in the authoring environment: migrations, seeders, API and the 20 PHPUnit tests are unverified until you run them.
2. No browser/E2E testing; responsive and accessibility behaviour was implemented but not audited in real browsers or with a screen reader.
3. Demo seed data is unverified; no images; admin sets `image_url` references only (no upload).
4. Itinerary *update* exists in the API and tests but has no UI (create/list/view/delete only).
5. Failed-persistence-never-reports-success is implemented via DB transactions and error-only UI paths, but has no dedicated fault-injection test.
6. Token in `localStorage`; no refresh tokens; no account recovery; no audit log (SRS: not required).
7. Remaining SRS TBDs not decided: 003, 004, 011–016, 018 (see `REQUIREMENTS_TRACEABILITY.md`).
8. The landing scene's visual quality has not been viewed in a browser here.
9. No Policies class: ownership is enforced by user-scoped queries; admin by middleware.
