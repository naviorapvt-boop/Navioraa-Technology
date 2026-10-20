# Security Specification & Test Payloads for NAVIORAA

## 1. Data Invariants
- **Public Read Boundaries**: Unauthenticated visitors can ONLY read published content (`courses`, `courseCategories`, `heroSlides`, `whyChooseUs`, `services`, `projects`, `teamMembers`, `resources`, `blogPosts` where `published == true` or `active == true`, and `/siteSettings/general`).
- **Enquiry Privacy**: Anyone can submit an enquiry (`create` on `/enquiries`), but only authenticated administrators (`isAdmin()`) can read, update, or delete enquiries. Under no circumstances can non-admins read user emails or phone numbers.
- **Admin Control**: Only users listed in `/admins/{uid}` or the bootstrap email `naviora.pvt@gmail.com` can create, update, or delete website content (`courses`, `services`, `teamMembers`, etc.).
- **Audit Logging**: Activity logs can only be read and created by administrators.
- **No Self-Privilege Escalation**: Non-admin users cannot grant themselves admin rights or alter the `/admins` collection.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unpublished Course Public Scraping**: Unauthenticated GET `/courses/draft-course` where `published: false` -> MUST BE DENIED.
2. **Anonymous Enquiry List Harvester**: Unauthenticated LIST `/enquiries` to extract student contact details -> MUST BE DENIED.
3. **Student Modifying Team Profile**: Authenticated regular user attempting UPDATE `/teamMembers/shubham` -> MUST BE DENIED.
4. **Self-Admin Escalation**: Authenticated regular user attempting WRITE `/admins/{myUid}` with `{ role: 'owner' }` -> MUST BE DENIED.
5. **Enquiry Spam Injection with Oversized Payload**: Attacker submitting POST `/enquiries` with 500KB message string exceeding maxLength -> MUST BE DENIED.
6. **Ghost Field Shadow Update on Course**: Admin attempting to update course with unauthorized fields -> Rejected if schema violation.
7. **Cross-User Profile Hijacking**: User A attempting UPDATE `/users/{userB}` -> MUST BE DENIED.
8. **Malicious Blog Publishing by Public**: Unauthenticated user attempting POST `/blogPosts/hacked-post` -> MUST BE DENIED.
9. **Internal Note Tampering**: Non-admin user attempting to patch `internalNotes` on `/enquiries/enq123` -> MUST BE DENIED.
10. **Site Settings Vandalism**: Anonymous attacker attempting to rewrite `/siteSettings/general` -> MUST BE DENIED.
11. **Id Poisoning Injection**: Attacker attempting to write to a path with 1KB invalid characters -> MUST BE DENIED.
12. **Audit Log Erasure**: Attacker or user attempting to DELETE `/activityLogs/log-01` -> MUST BE DENIED.
