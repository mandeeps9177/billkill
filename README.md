# Billkill 🛫

> Split your BLR airport ride. Save up to 60%.

Billkill matches verified travellers flying to/from Bengaluru International Airport at similar times so they can share a cab and split the cost.

## Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (Google Material Design inspired)
- **Lucide React** (icons)

## Pages Built

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, how-it-works, savings calculator, safety |
| `/signup` | 3-step signup: social/email → phone OTP → success |
| `/login` | Google, LinkedIn, or email login |
| `/book` | 3-step travel details: form → quote → match submission |
| `/dashboard` | User dashboard with trips, stats, active match alert |
| `/match/[id]` | Match detail: profile, route, fare, accept/decline |
| `/terms` | Terms & Conditions |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Modules Implemented (UI)

- ✅ User creation (signup flow)
- ✅ Login
- ✅ Travel details submission
- ✅ Quote management (savings display)
- ✅ Match-making (search state)
- ✅ Match acceptance/rejection
- ✅ Ride confirmation
- ✅ T&C

## Next Steps (Backend)

1. **Auth**: Connect Google OAuth + LinkedIn OAuth (NextAuth.js)
2. **Database**: PostgreSQL + Prisma ORM (users, trips, matches)
3. **SMS/OTP**: MSG91 or Twilio integration
4. **Matching engine**: Cron job / serverless function with geo-clustering
5. **Notifications**: Firebase Cloud Messaging (push) + SMS
6. **Maps**: Google Maps Places API for location autocomplete
7. **Payments**: Razorpay for token amount collection
