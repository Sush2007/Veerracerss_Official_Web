import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Server, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy // VeerRacerss Electric",
  description: "Official Privacy Policy for VeerRacerss Electric, Formula Student collegiate team of VSSUT Burla.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 sm:pt-28 pb-20 relative">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Back Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-racing-red text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-10">
          <div className="inline-flex items-center gap-2 mb-3 text-racing-red font-mono text-xs uppercase tracking-widest font-bold">
            <Shield className="w-4 h-4 text-racing-red" />
            <span>VSSUT BURLA // DATA PROTOCOL & GOVERNANCE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            PRIVACY <span className="text-racing-red">POLICY</span>
          </h1>

          <p className="font-sans text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            VeerRacerss Electric is committed to safeguarding personal information collected through our official portal, recruitment application forms, and communications channels.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-white/40">
            <span>VERSION 2.4</span>
            <span>•</span>
            <span>LAST REVISED: OCTOBER 2026</span>
            <span>•</span>
            <span className="text-racing-red">BUR-ODISHA-IND</span>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="space-y-8 font-sans text-sm text-white/70 font-light leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                1. Data Collection Scope
              </h2>
            </div>
            <p className="mb-4">
              When applying via our Induction Portal or interacting with our technical desks, we collect candidate and visitor information necessary for team operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60 font-mono text-xs">
              <li>Candidate Identification: Full name, university registration / roll number, academic department/branch, and year of study.</li>
              <li>Communication Channels: WhatsApp phone number, official institutional email, and personal email address.</li>
              <li>Engineering Profile: Technical domain preferences (Powertrain, Chassis & Aero, Suspension, Brakes, Electronics & Telemetry, PR/Sponsorship).</li>
              <li>Portfolio & Credentials: Prior technical experience, GitHub / CAD portfolio URLs, and resume documents.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                2. Purpose of Processing
              </h2>
            </div>
            <p className="mb-4">
              Data collected through this website is utilized exclusively for legitimate non-commercial collegiate motorsport club operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60 font-mono text-xs">
              <li>Recruitment Evaluations: Technical lead assessment, domain interview scheduling, and candidate scoring.</li>
              <li>Official Communications: Dispatching automated induction confirmations and interview call letters via authorized SMTP/email services.</li>
              <li>Team Council Roster: Maintaining historical squad archives, department distribution telemetry, and annual progression records.</li>
              <li>Corporate Sponsorship & Mentorship: Facilitating contact between prospective partners, alumni mentors, and executive leads.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                3. Data Storage & Security Safeguards
              </h2>
            </div>
            <p className="mb-3">
              Application submissions are stored securely within Supabase PostgreSQL infrastructure configured with Row-Level Security (RLS) policies. Access is strictly authenticated and restricted to designated faculty advisors and authorized student council officers.
            </p>
            <p>
              We implement industry-standard TLS 1.3 encryption in transit. We do not sell, license, lease, or monetize applicant or user personal records to any external advertising platforms or third-party marketing entities.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                4. Third-Party Infrastructure Services
              </h2>
            </div>
            <p className="mb-3">
              Our website leverages secure, compliant cloud services to deliver reliable performance:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60 font-mono text-xs">
              <li>Hosting & Content Delivery: Vercel Cloud Edge Network.</li>
              <li>Database & Session Authentication: Supabase (managed Postgres with AES-256 encrypted storage).</li>
              <li>Transactional Notifications: Resend Developer API for recruitment response emails.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                5. Applicant Data Rights & Retention
              </h2>
            </div>
            <p className="mb-3">
              Induction records are retained across active competition seasons for university archival and performance progression tracking. Applicants retain the right to request review, rectification, or complete deletion of their profile records from our active database.
            </p>
            <p>
              To request removal or update of your submitted candidate datasheet, contact the official database desk using the credentials below.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                6. Contact the Database & Privacy Desk
              </h2>
            </div>
            <p className="mb-4">
              For any privacy-related questions, data rectifications, or security disclosures, reach out directly to our team administration:
            </p>
            <div className="p-4 bg-white/5 border border-white/10 font-mono text-xs space-y-1.5 text-white/80">
              <div><strong className="text-white">Organization:</strong> VeerRacerss Electric (Formula Student Team)</div>
              <div><strong className="text-white">Institution:</strong> Veer Surendra Sai University of Technology (VSSUT)</div>
              <div><strong className="text-white">Location:</strong> Central Workshop, Burla, Sambalpur, Odisha 768018, India</div>
              <div>
                <strong className="text-white">Email Desk: </strong>
                <a
                  href="mailto:veerracersselectric.database@gmail.com?subject=Privacy%20%26%20Data%20Inquiry%20-%20VeerRacerss%20Electric"
                  className="text-racing-red hover:underline"
                >
                  veerracersselectric.database@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
