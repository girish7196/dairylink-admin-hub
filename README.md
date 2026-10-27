# DairyLink Admin Hub

Build a complete responsive web application called "DairyLink Admin".

This is the ADMIN WEB DASHBOARD for a dairy management system.

The farmer Android app is a separate application and will use the same Supabase backend later.

IMPORTANT:

- Create a professional production-style admin dashboard.

- Desktop-first, but responsive on tablet/mobile.

- Use the same DairyLink visual identity as the farmer app:

  white/light surfaces, deep green primary accent, subtle cream/yellow highlights, clean cards, rounded corners, readable typography.

- Also support Dark Mode.

- Do not make the design look like a generic AI dashboard.

- Use realistic dairy/farmer-related content.

- Do not use fake claims such as "50,000+ users", "ISO certified", etc.

- Use demo data for now.

- Do not connect Supabase yet. First build the complete frontend.

ADMIN NAVIGATION:

1. Dashboard

2. Farmers

3. Milk Collection

4. Quality Testing

5. Milk Rates

6. Payments

7. Receipts

8. Employees

9. Collection Centres

10. Reports

11. Notifications

12. Settings

DASHBOARD:

Create a professional overview showing:

- Total Farmers

- Today's Milk Collection

- Today's Milk Value

- Pending Payments

- Active Collection Centres

- Today's Morning Collection

- Today's Evening Collection

- Recent Milk Collections

- Recent Payments

- Milk collection trend chart

- Payment trend chart

- Recent notifications

FARMERS:

Create:

- Farmer list

- Search

- Filter by village

- Filter by collection centre

- Filter by status

- Add Farmer

- Edit Farmer

- Farmer details page

- Farmer code

- Name

- Phone

- Village

- District

- Collection centre

- Cows

- Buffaloes

- Bank details

- Status

MILK COLLECTION:

Create:

- Collection records table

- Date

- Farmer

- Farmer code

- Collection centre

- Shift

- Milk type

- Quantity

- Fat

- SNF

- Rate

- Total amount

- Add Collection

- Edit Collection

- Filters

- Search

- Date range filter

QUALITY TESTING:

Create:

- Milk quality records

- Farmer

- Date

- Shift

- Fat percentage

- SNF percentage

- Quality status

- Search and filters

- Add quality test

MILK RATES:

Create:

- Current cow milk rate

- Current buffalo milk rate

- Fat bonus

- SNF bonus

- Effective date

- Rate history

- Add/update rate

PAYMENTS:

Create:

- Payment overview

- Pending payments

- Completed payments

- Payment history

- Farmer

- Period

- Amount

- Payment method

- Payment status

- Transaction reference

- Mark as paid

RECEIPTS:

Create:

- Receipt list

- Receipt number

- Farmer

- Date

- Amount

- Payment status

- View receipt

- Download/print receipt interface

EMPLOYEES:

Create:

- Employee list

- Employee name

- Role

- Phone

- Collection centre

- Status

- Add employee

- Edit employee

COLLECTION CENTRES:

Create:

- Centre list

- Centre name

- Village

- District

- Address

- Supervisor

- Contact

- Number of farmers

- Status

- Add/edit centre

REPORTS:

Create:

- Daily collection report

- Monthly collection report

- Farmer-wise report

- Payment report

- Milk quality report

- Collection centre report

- Charts

- Date filters

- Export/print UI

NOTIFICATIONS:

Create:

- Notification list

- Title

- Message

- Type

- Date

- Read/unread status

- Create notification

- Send to selected farmer/all farmers interface

SETTINGS:

Create:

- Admin profile

- Appearance

- Light/Dark/System theme

- Language preference

- Notification preferences

- System settings

- Logout

AUTHENTICATION UI:

Create an admin login screen with:

- Email

- Password

- Remember me

- Login

- Forgot password

- DairyLink branding

DATA:

Use realistic sample demo data initially.

Structure the frontend so the demo data can later be replaced with Supabase data without redesigning the UI.

IMPORTANT:

Keep components reusable.

Keep tables, forms, charts, modals and navigation consistent throughout the application.

Provide loading, empty, success and error states.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6ea092f9-400e-4d57-80fa-0ef7c3d560ad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
