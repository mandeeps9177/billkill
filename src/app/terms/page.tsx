import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    { title: "1. Service description", content: "Billkill is a ride-matching platform that connects verified travellers flying to or from Bengaluru International Airport (BLR). Billkill facilitates introductions between co-travellers but does not book, operate, or provide taxi or cab services." },
    { title: "2. User eligibility", content: "You must be 18 years or older and resident in India to use Billkill. You must provide a valid Indian mobile number and sign in via Google or LinkedIn. You agree to provide accurate travel information." },
    { title: "3. Verified identity", content: "Billkill uses LinkedIn OAuth and phone OTP to verify user identity. You consent to co-travellers viewing your LinkedIn profile name, role, and employer before accepting a match." },
    { title: "4. Fare and payments", content: "Billkill provides estimated fare splits for informational purposes only. Actual fares depend on the taxi booked by your group. Payment between co-travellers is arranged directly. Billkill is not responsible for payment disputes." },
    { title: "5. Safety and conduct", content: "You agree to behave respectfully toward co-travellers and abide by all applicable Indian laws. Billkill reserves the right to remove users who receive repeated negative ratings or reports of misconduct." },
    { title: "6. Liability", content: "Billkill is a matching service only. We are not liable for taxi performance, delays, accidents, disputes between co-travellers, or any losses arising from use of the platform." },
    { title: "7. Cancellations", content: "You may cancel a confirmed match up to 6 hours before the scheduled pickup. Repeated last-minute cancellations may result in account restrictions." },
    { title: "8. Privacy", content: "Your contact details are only shared with a matched co-traveller after both parties accept the match. See our Privacy Policy for full details on data collection and use." },
  ];
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#202124] mb-2">Terms & Conditions</h1>
          <p className="text-sm text-[#80868B] mb-8">Last updated: 1 May 2025</p>
          <div className="card p-6 sm:p-8 space-y-7">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-base font-semibold text-[#202124] mb-2">{s.title}</h2>
                <p className="text-sm text-[#5F6368] leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/signup" className="btn-primary inline-block px-8 py-3">Accept & create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
