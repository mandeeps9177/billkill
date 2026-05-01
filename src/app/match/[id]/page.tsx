"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plane, MapPin, Star, CheckCircle, X, Clock, Shield, ExternalLink, Phone, TrendingDown } from "lucide-react";

export default function MatchPage({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState<"pending" | "accepted" | "declined">("pending");
  const [timer] = useState("1h 43m");

  const match = {
    name: "Arjun Reddy",
    initials: "AR",
    company: "Infosys",
    role: "Senior Software Engineer",
    rating: 4.9,
    trips: 12,
    linkedin: true,
    phone: true,
    flight: "6E-204",
    flightTime: "06:45 AM",
    pickup: "Koramangala 5th Block",
    drop: "BLR Airport — Terminal 2",
    matchScore: 96,
    yourFare: 450,
    soloFare: 1100,
    savings: 650,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#1A73E8] hover:underline mb-6">
            ← Back to dashboard
          </Link>

          {decision === "pending" && (
            <>
              {/* Timer */}
              <div className="bg-[#FEF7E0] border border-[#F9AB00]/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
                <Clock className="w-5 h-5 text-[#F9AB00]" />
                <div>
                  <p className="text-sm font-medium text-[#202124]">Accept within <strong>{timer}</strong></p>
                  <p className="text-xs text-[#80868B]">After that, you'll be re-queued for matching</p>
                </div>
              </div>

              {/* Match profile */}
              <div className="card p-6 mb-4">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] text-lg font-semibold">
                    {match.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-[#202124]">{match.name}</p>
                    <p className="text-sm text-[#5F6368]">{match.role}</p>
                    <p className="text-sm text-[#5F6368]">{match.company}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#1A73E8]">{match.matchScore}%</div>
                    <div className="text-xs text-[#80868B]">match score</div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex gap-2 mb-5 flex-wrap">
                  {match.linkedin && (
                    <span className="flex items-center gap-1.5 text-xs font-medium bg-[#E8F0FE] text-[#1A73E8] px-2.5 py-1 rounded-full">
                      <ExternalLink className="w-3 h-3" /> LinkedIn verified
                    </span>
                  )}
                  {match.phone && (
                    <span className="flex items-center gap-1.5 text-xs font-medium bg-[#E6F4EA] text-[#1E8E3E] px-2.5 py-1 rounded-full">
                      <Phone className="w-3 h-3" /> Phone verified
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs font-medium bg-[#F1F3F4] text-[#5F6368] px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-[#F9AB00] text-[#F9AB00]" /> {match.rating} · {match.trips} rides
                  </span>
                </div>

                {/* Route */}
                <div className="bg-[#F8F9FA] rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                      <div className="w-0.5 h-6 bg-[#DADCE0]" />
                      <div className="w-2 h-2 rounded-full bg-[#D93025]" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div>
                        <p className="text-xs text-[#80868B]">Shared pickup</p>
                        <p className="text-sm font-medium text-[#202124]">{match.pickup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#80868B]">Drop</p>
                        <p className="text-sm font-medium text-[#202124]">{match.drop}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#DADCE0] pt-3 flex gap-4 text-xs text-[#5F6368]">
                    <span className="flex items-center gap-1"><Plane className="w-3 h-3 text-[#1A73E8]" /> {match.flight}</span>
                    <span>{match.flightTime}</span>
                    <span>15 May 2025</span>
                  </div>
                </div>

                {/* Fare */}
                <div className="bg-[#E6F4EA] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#5F6368]">Your share</span>
                    <span className="text-xl font-bold text-[#1E8E3E]">₹{match.yourFare}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#80868B]">Solo would cost</span>
                    <span className="text-xs text-[#80868B] line-through">₹{match.soloFare}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1E8E3E]/20 pt-2 mt-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-[#1E8E3E]">
                      <TrendingDown className="w-3.5 h-3.5" /> You save
                    </div>
                    <span className="text-sm font-bold text-[#1E8E3E]">₹{match.savings} ({Math.round(match.savings/match.soloFare*100)}%)</span>
                  </div>
                </div>
              </div>

              {/* Safety note */}
              <div className="flex items-start gap-2.5 text-xs text-[#80868B] mb-5 px-1">
                <Shield className="w-4 h-4 flex-shrink-0 text-[#80868B] mt-0.5" />
                <span>Arjun's identity has been verified via LinkedIn and phone OTP. You can view his LinkedIn profile before deciding.</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDecision("declined")}
                  className="flex items-center justify-center gap-2 border border-[#DADCE0] rounded-full py-3 text-sm font-medium text-[#5F6368] hover:bg-[#F1F3F4] transition-colors"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
                <button
                  onClick={() => setDecision("accepted")}
                  className="flex items-center justify-center gap-2 bg-[#1A73E8] text-white rounded-full py-3 text-sm font-medium hover:bg-[#1558B0] transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Accept match
                </button>
              </div>
            </>
          )}

          {decision === "accepted" && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-[#1E8E3E]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] mb-2">Ride confirmed!</h2>
              <p className="text-sm text-[#5F6368] mb-6">Arjun has been notified. Once both parties confirm, you'll receive the final ride details.</p>

              <div className="bg-[#F8F9FA] rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                <div className="flex justify-between"><span className="text-[#80868B]">Co-traveller</span><span className="font-medium">Arjun Reddy</span></div>
                <div className="flex justify-between"><span className="text-[#80868B]">Pickup</span><span className="font-medium">Koramangala 5th Block</span></div>
                <div className="flex justify-between"><span className="text-[#80868B]">Date & time</span><span className="font-medium">15 May · 06:45 AM</span></div>
                <div className="flex justify-between"><span className="text-[#80868B]">Your fare</span><span className="font-medium text-[#1E8E3E]">₹450</span></div>
              </div>

              <p className="text-xs text-[#80868B] mb-6">Coordinate the exact pickup spot with Arjun via the contact details that will be shared once he confirms.</p>

              <Link href="/dashboard" className="btn-primary w-full py-3 text-base block text-center">
                Back to dashboard
              </Link>
            </div>
          )}

          {decision === "declined" && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-[#F1F3F4] rounded-full flex items-center justify-center mx-auto mb-5">
                <X className="w-8 h-8 text-[#80868B]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] mb-2">Match declined</h2>
              <p className="text-sm text-[#5F6368] mb-6">No problem. We'll look for other travellers matching your route and time window.</p>

              <div className="bg-[#FEF7E0] border border-[#F9AB00]/30 rounded-xl p-4 text-sm text-[#5F6368] mb-6">
                <p className="font-medium text-[#202124] mb-1">Re-matching in progress</p>
                <p>We re-run matching at T-48h, T-24h and T-6h before your flight. You'll be notified if a new match is found.</p>
              </div>

              <Link href="/dashboard" className="btn-primary w-full py-3 text-base block text-center">
                Back to dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
