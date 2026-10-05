import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, BookOpen } from 'lucide-react';
import { GajahOlingMotif } from './GajahOlingMotif';
import { OmprokGandrung } from './OmprokGandrung';

interface CulturalSidebarShowcaseProps {
  className?: string;
}

export const CulturalSidebarShowcase: React.FC<CulturalSidebarShowcaseProps> = ({ className = '' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'seblang' | 'gandrung' | 'gajah-oling'>('seblang');

  return (
    <>
      {/* ================= AESTHETIC CULTURAL SIDEBAR SHOWCASE CARD ================= */}
      <div
        className={`p-3.5 rounded-2xl bg-gradient-to-br from-[#0F2D4C] via-[#091F35] to-[#061423] border border-[#D4A359]/35 hover:border-[#D4A359]/60 shadow-lg relative overflow-hidden group transition-all duration-300 ${className}`}
      >
        {/* Subtle Decorative Golden Corner Accent */}
        <div className="absolute -top-6 -right-6 w-20 h-20 opacity-10 pointer-events-none select-none">
          <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
        </div>

        {/* Card Header: Refined Insignia */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4A359]/15 relative z-10">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#F3E2C4]">
            <div className="w-4.5 h-4.5 rounded-full bg-[#D4A359]/20 border border-[#D4A359]/50 flex items-center justify-center text-[9px] text-[#D4A359] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
            <span className="tracking-wide">Warisan Budaya</span>
          </div>
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#D4A359] bg-[#D4A359]/15 px-2 py-0.5 rounded-full border border-[#D4A359]/30 shadow-2xs">
            Banyuwangi
          </span>
        </div>

        {/* Main Content Layout: Balanced Aesthetic Arrangement */}
        <div className="pt-2 flex items-center justify-between gap-2.5 relative z-10">
          {/* Left Column: Descriptive Typography & Cultural Badges */}
          <div className="flex-1 space-y-1.5 text-left">
            <div>
              <h4 className="text-xs font-bold text-[#F5E6CC] leading-tight flex items-center gap-1">
                <span>Seblang & Gandrung</span>
              </h4>
              <p className="text-[9.5px] text-slate-300 leading-snug font-normal mt-0.5">
                Harmoni ritual sakral <strong className="text-white font-semibold">Tari Seblang</strong>, keelokan <strong className="text-white font-semibold">Gandrung</strong>, & filosofi <strong className="text-white font-semibold">Batik Gajah Oling</strong>.
              </p>
            </div>

            {/* Cultural Tags / Badges */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[7.5px] font-bold bg-[#D4A359]/20 text-[#F5DEB3] border border-[#D4A359]/40 px-1.5 py-0.5 rounded-md leading-none">
                ✦ Ritual Seblang
              </span>
              <span className="text-[7.5px] font-bold bg-[#D4A359]/20 text-[#F5DEB3] border border-[#D4A359]/40 px-1.5 py-0.5 rounded-md leading-none">
                ✦ Tari Gandrung
              </span>
              <span className="text-[7.5px] font-bold bg-white/10 text-slate-300 border border-white/10 px-1.5 py-0.5 rounded-md leading-none">
                Gajah Oling
              </span>
            </div>
          </div>

          {/* Right Column: Beautiful Spotlight on Penari Seblang & Motifs */}
          <div className="relative shrink-0 w-20 h-24 flex items-end justify-center">
            {/* Ambient Golden Radial Glow */}
            <div className="absolute inset-0 bg-radial from-[#D4A359]/25 via-transparent to-transparent blur-xs pointer-events-none" />

            {/* Behind Seblang: Tiny Omprok Crest */}
            <div className="absolute top-0 right-1 w-7 h-7 opacity-35 pointer-events-none">
              <OmprokGandrung variant="gold" className="w-full h-full object-contain" />
            </div>

            {/* Penari Seblang Clean Silhouette (Cleaned from all text, pure gold finish) */}
            <img
              src="/assets/penari-seblang-gold.png"
              alt="Penari Seblang Banyuwangi"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.35)] group-hover:scale-105 transition-transform duration-300"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Bottom Interactive Trigger: Read Cultural Story */}
        <div className="pt-2 mt-2 border-t border-[#D4A359]/15 flex items-center justify-between relative z-10">
          <span className="text-[8.5px] text-slate-400 font-medium">
            Kearifan Lokal Blambangan
          </span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-[9px] font-bold text-[#E5BE7E] hover:text-white transition-colors cursor-pointer group/btn"
          >
            <span>Telusuri Kisah</span>
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform text-[#D4A359]" />
          </button>
        </div>
      </div>

      {/* ================= CULTURAL HERITAGE STORY MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-[#091F35] text-white w-full max-w-lg rounded-3xl border border-[#D4A359]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0F2D4C] via-[#091F35] to-[#061423] border-b border-[#D4A359]/30 flex items-center justify-between relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4A359]/20 border border-[#D4A359]/40 flex items-center justify-center text-[#D4A359]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#F5E6CC] leading-tight">
                    Warisan Seni Budaya Banyuwangi
                  </h3>
                  <p className="text-xs text-slate-300">
                    Kearifan Tradisi Bumi Blambangan
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

            {/* Cultural Category Tabs */}
            <div className="grid grid-cols-3 p-2 bg-[#061423]/80 border-b border-white/10 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('seblang')}
                className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                  activeTab === 'seblang'
                    ? 'bg-[#D4A359] text-[#051829] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Tari Seblang
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gandrung')}
                className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                  activeTab === 'gandrung'
                    ? 'bg-[#D4A359] text-[#051829] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Tari Gandrung
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gajah-oling')}
                className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                  activeTab === 'gajah-oling'
                    ? 'bg-[#D4A359] text-[#051829] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Batik Gajah Oling
              </button>
            </div>

            {/* Modal Body with Cultural Details */}
            <div className="p-5 overflow-y-auto space-y-4 text-left text-xs text-slate-200 leading-relaxed">
              {activeTab === 'seblang' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-[#0E2C48] to-[#081B2E] p-3.5 rounded-2xl border border-[#D4A359]/30">
                    <img
                      src="/assets/penari-seblang-gold.png"
                      alt="Tari Seblang"
                      className="w-20 h-28 object-contain filter drop-shadow"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-[#D4A359] uppercase tracking-wider block">
                        Ritual Adat Kuno
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Ritual Sakral Tari Seblang
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Upacara adat tolak bala masyarakat Osing yang dilangsungkan di Desa Olehsari (penari remaja putri) dan Kelurahan Bakungan (penari wanita senior).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <h5 className="font-bold text-[#E5BE7E] text-xs">Ciri Khas & Filosofi:</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11.5px]">
                      <li><strong className="text-white">Mahkota Omprok Daun Pisang:</strong> Dihiasi daun pisang muda (pupus) dan aneka bunga segar beraroma harum semerbak.</li>
                      <li><strong className="text-white">Kondisi Kejiman (Trance):</strong> Penari menari berjam-jam dalam kondisi tidak sadar yang dipandu oleh pawang dan iringan gending sakral.</li>
                      <li><strong className="text-white">Tolak Bala & Kesuburan:</strong> Memohon keselamatan desa, tolak bala dari wabah, serta ungkapan rasa syukur atas hasil bumi.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'gandrung' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-[#0E2C48] to-[#081B2E] p-3.5 rounded-2xl border border-[#D4A359]/30">
                    <div className="w-20 h-28 flex items-center justify-center">
                      <img
                        src="/assets/penari-gandrung-wpap.png"
                        alt="Tari Gandrung"
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#D4A359] uppercase tracking-wider block">
                        Ikon Banyuwangi
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Keagungan Tari Gandrung
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Seni tari pergaulan dan penyambutan kehormatan yang menjadi identitas resmi Kabupaten Banyuwangi dan diakui secara nasional maupun internasional.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <h5 className="font-bold text-[#E5BE7E] text-xs">Ciri Khas & Nilai Budaya:</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11.5px]">
                      <li><strong className="text-white">Omprok Gandrung:</strong> Mahkota berkilau emas berbentuk burung merak berhias manik-manik indah.</li>
                      <li><strong className="text-white">Selendang (Sampur):</strong> Gerakan tangan lincah mengibaskan sampur menyambut para tamu dengan penuh rasa hormat.</li>
                      <li><strong className="text-white">Festival Gandrung Sewu:</strong> Kolaborasi ribuan penari Gandrung di Pantai Marina Boom yang memesona dunia.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'gajah-oling' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-[#0E2C48] to-[#081B2E] p-3.5 rounded-2xl border border-[#D4A359]/30">
                    <div className="w-20 h-24 flex items-center justify-center p-2 bg-[#051829] rounded-xl border border-[#D4A359]/30">
                      <GajahOlingMotif variant="gold" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#D4A359] uppercase tracking-wider block">
                        Batik Pusaka Tertua
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Filosofi Batik Gajah Oling
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Motif batik tertua dan paling sakral khas bumi Blambangan Banyuwangi dengan pola spiral meliuk menyerupai belalai gajah.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <h5 className="font-bold text-[#E5BE7E] text-xs">Makna Filosofis:</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11.5px]">
                      <li><strong className="text-white">Gajah (Kekuasaan & Kebesaran):</strong> Melambangkan hewan perkasa bertubuh besar ciptaan Tuhan.</li>
                      <li><strong className="text-white">Oling / Uling (Belut Air):</strong> Melambangkan keluwesan, kebersihan hati, dan adaptasi kehidupan.</li>
                      <li><strong className="text-white">Makna "Eling" (Ingat):</strong> Mengingatkan manusia untuk senantiasa "eling" dan berserah diri kepada keagungan Sang Maha Pencipta.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#061423] border-t border-[#D4A359]/25 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                Pusat Pelestarian Budaya Blambangan
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
