import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-2 text-sm">
          <HeartPulse className="w-5 h-5 text-blue-500" />
          <span>
            MedCare
          </span>
        </div>

        {/* CENTER */}
        <div className="text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} All rights reserved
        </div>

        {/* RIGHT */}
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>

      </div>

    </footer>
  );
}
