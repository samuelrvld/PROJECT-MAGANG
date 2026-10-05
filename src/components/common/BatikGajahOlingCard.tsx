import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, BookOpen } from 'lucide-react';
import { GajahOlingMotif } from './GajahOlingMotif';

interface BatikGajahOlingCardProps {
  className?: string;
}

export const BatikGajahOlingCard: React.FC<BatikGajahOlingCardProps> = ({ className = '' }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ================= DEDICATED BATIK GAJAH OLING MOTIF CARD ================= */}
      <div
        className={`p-3.5 rounded-2xl bg-gradient-to-br from-[#0F2F50]/90 via-[#0A223B]/90 to-[#061423]/95 border border-[#D4A359]/40 hover:border-[#D4A359]/70 shadow-lg relative overflow-hidden group transition-all duration-300 ${className}`}
      >
        {/* Soft Ambient Radial Gold Sheen */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A359]/10 rounded-full blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A359]/20 relative z-10">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#F3E2C4]">
            <div className="w-4 h-4 rounded-full bg-[#D4A359]/20 border border-[#D4A359]/50 flex items-center justify-center text-[9px] text-[#D4A359]">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
            <span className="tracking-wide">Motif Khas Blambangan</span>
          </div>
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#D4A359] bg-[#D4A359]/15 px-2 py-0.5 rounded-full border border-[#D4A359]/30">
            Banyuwangi
          </span>
        </div>

        {/* Card Body: Batik Gajah Oling Art & Philosophy */}
        <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
          {/* Left Column: Descriptive Text & Philosophy */}
          <div className="flex-1 space-y-1.5 text-left">
            <div>
              <h4 className="text-xs font-bold text-[#F5E6CC] leading-tight">
                Batik Gajah Oling
              </h4>
              <p className="text-[9.5px] text-slate-300 leading-snug font-normal mt-0.5">
                Motif tertua kebanggaan Banyuwangi bermakna luhur <strong className="text-white font-semibold">"Eling marang Gusti"</strong> (senantiasa mengingat kebesaran Tuhan).
              </p>
            </div>

            {/* Cultural Tags */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[7.5px] font-bold bg-[#D4A359]/20 text-[#F5DEB3] border border-[#D4A359]/40 px-1.5 py-0.5 rounded-md leading-none">
                ✦ Pusaka Tertua
              </span>
              <span className="text-[7.5px] font-bold bg-[#D4A359]/20 text-[#F5DEB3] border border-[#D4A359]/40 px-1.5 py-0.5 rounded-md leading-none">
                ✦ Filosofi Eling
              </span>
            </div>
          </div>

          {/* Right Column: Authentic Batik Gajah Oling Spiral Visual */}
          <div className="relative shrink-0 w-16 h-20 flex items-center justify-center">
            {/* Golden Ambient Glow */}
            <div className="absolute inset-0 bg-radial from-[#D4A359]/30 via-transparent to-transparent blur-xs pointer-events-none" />

            {/* Full High-Resolution Gold Gajah Oling Motif */}
            <img
              src="/assets/gajah-oling-gold.png"
              alt="Motif Batik Gajah Oling"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.45)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Bottom Interactive Link */}
        <div className="pt-2 mt-2 border-t border-[#D4A359]/15 flex items-center justify-between relative z-10">
          <span className="text-[8.5px] text-slate-400 font-medium">
            Warisan Budaya Takbenda
          </span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-[9px] font-bold text-[#E5BE7E] hover:text-white transition-colors cursor-pointer group/btn"
          >
            <span>Makna Filosofis</span>
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform text-[#D4A359]" />
          </button>
        </div>
      </div>

      {/* ================= MODAL FILOSOFI BATIK GAJAH OLING ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-[#091F35] text-white w-full max-w-md rounded-3xl border border-[#D4A359]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0F2D4C] via-[#091F35] to-[#061423] border-b border-[#D4A359]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4A359]/20 border border-[#D4A359]/40 flex items-center justify-center text-[#D4A359]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-bold text-[#F5E6CC] leading-tight">
                    Filosofi Batik Gajah Oling
                  </h3>
                  <p className="text-xs text-slate-300">
                    Motif Pusaka Sakral Banyuwangi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-left text-xs text-slate-200 leading-relaxed">
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#0E2C48] to-[#081B2E] p-4 rounded-2xl border border-[#D4A359]/30">
                <div className="w-20 h-24 flex items-center justify-center p-1 bg-[#051829] rounded-xl border border-[#D4A359]/30 shrink-0">
                  <GajahOlingMotif variant="gold" className="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#D4A359] uppercase tracking-wider block">
                    Pusaka Tertua Bumi Blambangan
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Motif Batik Gajah Oling
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Gajah Oling merupakan motif batik tertua khas Banyuwangi yang sudah ada sejak era Kerajaan Blambangan.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <h5 className="font-bold text-[#E5BE7E] text-xs">Makna Simbolik:</h5>
                <ul className="list-disc list-inside space-y-2 text-slate-300 text-[11.5px]">
                  <li>
                    <strong className="text-white">Gajah (Kebesaran & Kekuatan):</strong> Melambangkan makhluk bertubuh besar sebagai cerminan keagungan alam semesta ciptaan Tuhan Yang Maha Esa.
                  </li>
                  <li>
                    <strong className="text-white">Oling / Uling (Belut Air):</strong> Melambangkan keluwesan, ketangkasan, dan kebersihan diri dalam menjalani lika-liku kehidupan.
                  </li>
                  <li>
                    <strong className="text-white">Makna Kata "Eling":</strong> Kata "Oling" bermakna "Eling" dalam bahasa Jawa/Osing, yaitu pesan spiritual agar manusia senantiasa mengingat (eling) kepada Sang Pencipta dalam setiap hembusan nafas.
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-[#061423] border-t border-[#D4A359]/25 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                Museum Blambangan Banyuwangi
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#D4A359] text-[#051829] font-bold hover:bg-[#E5BE7E] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
