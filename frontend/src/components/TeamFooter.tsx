import { Radio, Mail, Award, Users, User, ShieldCheck } from 'lucide-react';

export default function TeamFooter() {
  const teamMembers = [
    'Rajveer Singh',
    'Harshit Sharma',
    'Ankit Kumar',
    'Himanshi',
    'Vaibhav Sharma'
  ];

  return (
    <footer className="mt-8 border-t border-panel-border bg-[#070b13] text-gray-400 select-none rounded-lg overflow-hidden shadow-xl">
      {/* Top 3-Column Section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* LEFT COLUMN: TraffiQ Brand & Core Manifesto */}
        <div className="flex flex-col justify-between space-y-3 pr-2">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center p-0.5">
                <Radio size={14} className="text-black" />
              </div>
              <span className="text-base font-black tracking-wider text-white font-mono">
                TRAFFIQ
              </span>
            </div>
            <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              City-Wide AI Traffic Intelligence
            </div>
          </div>

          <div className="border-l-2 border-accent/80 pl-3 py-1 bg-black/30 rounded-r">
            <p className="text-[11px] text-gray-300 italic leading-snug">
              "One Vehicle. Multiple Cameras. One Continuous Journey."
            </p>
          </div>

          <div className="text-[10px] text-gray-500 pt-1">
            Engineered for automated multi-camera ANPR tracking and spatial-temporal mobility analytics.
          </div>
        </div>

        {/* CENTER COLUMN: Team TraffiQ-1 & Members (Balanced, Professional Hierarchy) */}
        <div className="border-t md:border-t-0 md:border-l border-panel-border/80 md:pl-6 space-y-3">
          <div className="flex items-center space-x-1.5 text-white font-bold text-xs uppercase tracking-wider">
            <Users size={14} className="text-accent" />
            <span>Team TraffiQ-1</span>
          </div>

          {/* Factual, un-exaggerated Team Leader */}
          <div className="space-y-0.5">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">
              Team Leader
            </div>
            <div className="text-xs font-bold text-white tracking-wide">
              Golu Kumar Singh
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-1 pt-1 border-t border-gray-800/80">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">
              Team Members
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-300">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center space-x-1.5">
                  <span className="text-accent font-bold text-[10px]">{idx + 1}.</span>
                  <span>{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Smart India Hackathon 2026 Submission */}
        <div className="border-t md:border-t-0 md:border-l border-panel-border/80 md:pl-6 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-white font-bold text-xs uppercase tracking-wider">
              <Award size={14} className="text-orange-400" />
              <span>Smart India Hackathon 2026</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
                <div className="text-[10px] text-gray-500 uppercase">Problem Statement</div>
                <div className="font-bold text-accent mt-0.5">SIH 26127</div>
              </div>
              <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
                <div className="text-[10px] text-gray-500 uppercase">Team ID</div>
                <div className="font-bold text-white mt-0.5">143412</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 bg-[#0b101c] p-2.5 rounded border border-gray-800/80">
            <div className="text-[10px] text-gray-500 uppercase font-semibold flex items-center space-x-1">
              <Mail size={11} className="text-gray-400" />
              <span>Contact</span>
            </div>
            <div>
              <a
                href="mailto:golusingh94712@gmail.com"
                className="text-gray-300 hover:text-accent font-semibold transition-colors flex items-center space-x-1.5 break-all text-[11px]"
              >
                <span>golusingh94712@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT / IDENTIFIER STRIP */}
      <div className="border-t border-panel-border/80 bg-[#05080e] px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500">
        <div>
          TraffiQ-1 • Smart India Hackathon 2026
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-1 sm:mt-0">
          <ShieldCheck size={12} className="text-online" />
          <span>Verified SIH 26127 Demonstration Prototype</span>
        </div>
      </div>
    </footer>
  );
}
