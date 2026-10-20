import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Award, Cpu, AlertTriangle, ExternalLink, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service // VeerRacerss Electric",
  description: "Terms and conditions of use for VeerRacerss Electric web portal and Formula Student candidate applications.",
};

export default function TermsPage() {
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
            <Scale className="w-4 h-4 text-racing-red" />
            <span>VSSUT BURLA // REGULATORY & INSTITUTIONAL FRAMEWORK</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            TERMS OF <span className="text-racing-red">SERVICE</span>
          </h1>

          <p className="font-sans text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Standard terms, conditions, and governance rules regulating access to the VeerRacerss Electric web portal, induction portals, and digital assets.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-white/40">
            <span>VERSION 2.1</span>
            <span>•</span>
            <span>LAST REVISED: OCTOBER 2026</span>
            <span>•</span>
            <span className="text-racing-red">VSSUT-FS-RULES</span>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="space-y-8 font-sans text-sm text-white/70 font-light leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="mb-3">
              By accessing, browsing, or submitting information through the VeerRacerss Electric website (the "Site"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
            </p>
            <p>
              If you do not accept these terms in their entirety, you should discontinue access to the portal immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                2. Collegiate Institutional Status
              </h2>
            </div>
            <p className="mb-3">
              VeerRacerss Electric is the official collegiate Formula Student electric vehicle engineering team representing Veer Surendra Sai University of Technology (VSSUT), Burla.
            </p>
            <p>
              The team operates as an educational engineering society affiliated with national and international collegiate design series, including SAE India (SUPRA SAE), Formula Bharat, and Formula Imperial. All operations are non-profit and educational in scope.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                3. Intellectual Property Rights
              </h2>
            </div>
            <p className="mb-3">
              All proprietary digital artifacts displayed on this platform—including but not limited to 3D CAD models, SolidWorks vehicle simulations, telemetry plots, structural FEA stress diagrams, team emblems, competition photography, and custom codebase components—remain the intellectual property of VeerRacerss Electric and VSSUT Burla.
            </p>
            <p>
              No commercial reproduction, distribution, reverse engineering, or scraping of these assets is permissible without prior written consent from the team council.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                4. Recruitment Induction Conduct & Truthfulness
              </h2>
            </div>
            <p className="mb-3">
              Applicants utilizing the recruitment portal (`/recruitment`) warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60 font-mono text-xs mb-3">
              <li>All personal, academic, and registration details submitted are truthful and accurate.</li>
              <li>Submitted engineering portfolios, past project summaries, and code repositories reflect the applicant's genuine work without misrepresentation or plagiarism.</li>
              <li>Submission does not guarantee interview scheduling or selection into the technical squad.</li>
            </ul>
            <p>
              The executive council reserves the right to reject or nullify any induction application found to contain falsified credentials.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                5. Third-Party Links & Corporate Sponsors
              </h2>
            </div>
            <p className="mb-3">
              The Site contains links to external corporate sponsors, technical partners, and social platforms (such as KTM, SolidWorks, Ansys, Snap-on, Bender, MCL, and LinkedIn). These external references are provided strictly for informational and attribution purposes.
            </p>
            <p>
              VeerRacerss Electric exercises no control over the privacy policies or practices of third-party domains and assumes no responsibility for external content.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-racing-red shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-wide">
                6. Contact Desk & Inquiries
              </h2>
            </div>
            <p className="mb-4">
              For any queries concerning these Terms of Service or official team relations, please direct communication to:
            </p>
            <div className="p-4 bg-white/5 border border-white/10 font-mono text-xs space-y-1.5 text-white/80">
              <div><strong className="text-white">Legal Entity:</strong> VeerRacerss Electric, VSSUT Burla</div>
              <div><strong className="text-white">Jurisdiction:</strong> Sambalpur District, Odisha, India</div>
              <div>
                <strong className="text-white">Official Desk: </strong>
                <a
                  href="mailto:veerracersselectric.database@gmail.com?subject=Terms%20Inquiry%20-%20VeerRacerss%20Electric"
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
