import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def create_full_report_docx():
    doc = Document()

    # Page Setup: A4, Margins: Left 4cm, Top 3cm, Right 3cm, Bottom 3cm (Standard Poliwangi)
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.0)
    section.bottom_margin = Cm(3.0)
    section.left_margin = Cm(4.0)
    section.right_margin = Cm(3.0)

    # Style: Times New Roman 12pt
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)

    def add_body_p(text, indent=True, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(space_after)
        if indent:
            p.paragraph_format.first_line_indent = Cm(1.0)
        p.add_run(text)
        return p

    def add_chapter_title(bab_no, title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(18)
        r = p.add_run(f"BAB {bab_no}\n{title.upper()}")
        r.bold = True
        r.font.size = Pt(12)
        return p

    def add_subheading(text, space_before=12, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(12)
        return p

    def add_subsubheading(text, space_before=6, space_after=2):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(0.5)
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(12)
        return p

    # =========================================================================
    # 1. HALAMAN JUDUL
    # =========================================================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.line_spacing = 1.15
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(18)
    r_title = p_title.add_run(
        "RANCANG BANGUN FITUR DIGITALISASI KOLEKSI DAN INTEGRASI QR CODE\n"
        "PADA SISTEM INFORMASI DI MUSEUM BLAMBANGAN BANYUWANGI\n\n"
        "LAPORAN MAGANG KERJA INDUSTRI"
    )
    r_title.bold = True
    r_title.font.size = Pt(13)

    if os.path.exists("logo_poliwangi.png"):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(12)
        p_logo.paragraph_format.space_after = Pt(12)
        r_logo = p_logo.add_run()
        r_logo.add_picture("logo_poliwangi.png", width=Cm(5.0))

    p_syarat = doc.add_paragraph()
    p_syarat.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_syarat.paragraph_format.line_spacing = 1.15
    p_syarat.paragraph_format.space_before = Pt(6)
    p_syarat.paragraph_format.space_after = Pt(18)
    r_syarat = p_syarat.add_run(
        "Magang Kerja Industri Dibuat dan Diajukan untuk Memenuhi Salah Satu Syarat Kelulusan\n"
        "Mata Kuliah Magang Kerja Industri Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak\n"
        "Politeknik Negeri Banyuwangi"
    )
    r_syarat.font.size = Pt(10.5)

    p_penulis = doc.add_paragraph()
    p_penulis.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_penulis.paragraph_format.line_spacing = 1.15
    p_penulis.paragraph_format.space_before = Pt(10)
    p_penulis.paragraph_format.space_after = Pt(24)
    r_penulis = p_penulis.add_run(
        "Oleh:\n"
        "SAMUEL RIVALDO SARAGIH\n"
        "NIM. 362358302156"
    )
    r_penulis.bold = True
    r_penulis.font.size = Pt(12)

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.line_spacing = 1.15
    p_inst.paragraph_format.space_before = Pt(18)
    p_inst.paragraph_format.space_after = Pt(0)
    r_inst = p_inst.add_run(
        "PROGRAM STUDI SARJANA TERAPAN\n"
        "TEKNOLOGI REKAYASA PERANGKAT LUNAK\n"
        "JURUSAN BISNIS DAN INFORMATIKA\n"
        "POLITEKNIK NEGERI BANYUWANGI\n"
        "2026"
    )
    r_inst.bold = True
    r_inst.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # 2. HALAMAN PENGESAHAN
    # =========================================================================
    p_peng_title = doc.add_paragraph()
    p_peng_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_peng_title.paragraph_format.line_spacing = 1.15
    p_peng_title.paragraph_format.space_after = Pt(18)
    r_peng_title = p_peng_title.add_run(
        "HALAMAN PENGESAHAN\n"
        "LAPORAN MAGANG KERJA INDUSTRI\n\n"
        "RANCANG BANGUN FITUR DIGITALISASI KOLEKSI DAN INTEGRASI QR CODE\n"
        "PADA SISTEM INFORMASI DI MUSEUM BLAMBANGAN BANYUWANGI"
    )
    r_peng_title.bold = True
    r_peng_title.font.size = Pt(12)

    p_peng_oleh = doc.add_paragraph()
    p_peng_oleh.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_peng_oleh.paragraph_format.space_after = Pt(18)
    r_peng_oleh = p_peng_oleh.add_run(
        "Oleh:\n"
        "SAMUEL RIVALDO SARAGIH\n"
        "NIM. 362358302156"
    )
    r_peng_oleh.bold = True
    r_peng_oleh.font.size = Pt(12)

    p_peng_tgl = doc.add_paragraph()
    p_peng_tgl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_peng_tgl.paragraph_format.space_after = Pt(20)
    r_peng_tgl = p_peng_tgl.add_run(
        "Telah diperiksa dan disetujui oleh pembimbing\n"
        "Pada tanggal: 15 Desember 2026."
    )
    r_peng_tgl.font.size = Pt(11)

    t_pemb = doc.add_table(rows=2, cols=2)
    t_pemb.alignment = WD_TABLE_ALIGNMENT.CENTER
    for row in t_pemb.rows:
        for cell in row.cells:
            cell.width = Cm(7.0)

    cell_p1 = t_pemb.cell(0, 0).paragraphs[0]
    cell_p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    cell_p1.paragraph_format.line_spacing = 1.15
    r = cell_p1.add_run("Pembimbing Lapang,\nMagang Kerja Industri,\n\n\n\n")
    r.font.size = Pt(11)
    r_name1 = cell_p1.add_run("Eko Ari Bawanto, S.Sn.\n")
    r_name1.bold = True
    r_name1.font.size = Pt(11)
    r_nip1 = cell_p1.add_run("NIP. 19940812 202406 1 002")
    r_nip1.font.size = Pt(11)

    cell_p2 = t_pemb.cell(0, 1).paragraphs[0]
    cell_p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    cell_p2.paragraph_format.line_spacing = 1.15
    r = cell_p2.add_run("Dosen Pembimbing,\nMagang Kerja Industri,\n\n\n\n")
    r.font.size = Pt(11)
    r_name2 = cell_p2.add_run("Alfin Hidayat, S.T., M.T.\n")
    r_name2.bold = True
    r_name2.font.size = Pt(11)
    r_nip2 = cell_p2.add_run("NIP. 19901005 201404 1 002")
    r_nip2.font.size = Pt(11)

    p_mengetahui = doc.add_paragraph()
    p_mengetahui.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mengetahui.paragraph_format.space_before = Pt(20)
    p_mengetahui.paragraph_format.space_after = Pt(12)
    r_m = p_mengetahui.add_run("Mengetahui,")
    r_m.font.size = Pt(11)

    t_pej = doc.add_table(rows=1, cols=2)
    t_pej.alignment = WD_TABLE_ALIGNMENT.CENTER
    for cell in t_pej.rows[0].cells:
        cell.width = Cm(7.0)

    cell_k1 = t_pej.cell(0, 0).paragraphs[0]
    cell_k1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    cell_k1.paragraph_format.line_spacing = 1.15
    r = cell_k1.add_run("Ketua Jurusan,\nBisnis dan Informatika,\n\n\n\n")
    r.font.size = Pt(11)
    r_k1 = cell_k1.add_run("Mohamad Dimyati Ayatullah, S.T., M.Kom.\n")
    r_k1.bold = True
    r_k1.font.size = Pt(11)
    r_k1_nip = cell_k1.add_run("NIPPPK. 19760122 202121 1 001")
    r_k1_nip.font.size = Pt(11)

    cell_k2 = t_pej.cell(0, 1).paragraphs[0]
    cell_k2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    cell_k2.paragraph_format.line_spacing = 1.15
    r = cell_k2.add_run("Koordinator Program Studi,\nTeknologi Rekayasa Perangkat Lunak,\n\n\n\n")
    r.font.size = Pt(11)
    r_k2 = cell_k2.add_run("Dianni Yusuf, S.Kom., M.Kom.\n")
    r_k2.bold = True
    r_k2.font.size = Pt(11)
    r_k2_nip = cell_k2.add_run("NIPPPK. 19840305 202121 2 004")
    r_k2_nip.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # 3. KATA PENGANTAR
    # =========================================================================
    p_kp_title = doc.add_paragraph()
    p_kp_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kp_title.paragraph_format.space_after = Pt(18)
    r_kp_title = p_kp_title.add_run("KATA PENGANTAR")
    r_kp_title.bold = True
    r_kp_title.font.size = Pt(12)

    add_body_p(
        "Puji syukur kehadirat Allah SWT atas segala limpahan rahmat, hidayah, dan karunia-Nya, "
        "sehingga penulis dapat menyelesaikan Laporan Magang Kerja Industri (MKI) ini tepat pada waktunya. "
        "Laporan ini disusun dengan judul “Rancang Bangun Fitur Digitalisasi Koleksi dan Integrasi QR Code "
        "pada Sistem Informasi di Museum Blambangan Banyuwangi”."
    )
    add_body_p(
        "Penyusunan laporan ini dimaksudkan untuk memenuhi salah satu syarat kelulusan mata kuliah Magang Kerja "
        "Industri pada Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak, Jurusan Bisnis dan Informatika, "
        "Politeknik Negeri Banyuwangi. Laporan ini merupakan hasil dari kegiatan praktik kerja, pengamatan, analisis "
        "kebutuhan sistem, serta pengembangan aplikasi yang penulis lakukan selama masa magang di Dinas Kebudayaan "
        "dan Pariwisata Kabupaten Banyuwangi pada unit Museum Blambangan."
    )
    add_body_p(
        "Penulis menyadari bahwa keberhasilan penyusunan laporan dan pelaksanaan magang ini tidak terlepas dari "
        "bantuan, bimbingan, arahan, serta dukungan dari berbagai pihak. Oleh karena itu, pada kesempatan ini penulis "
        "ingin menyampaikan rasa terima kasih yang sebesar-besarnya kepada:"
    )

    poin_terima_kasih = [
        "Bapak M. Shofiul Amin, S.T., M.T., selaku Direktur Politeknik Negeri Banyuwangi.",
        "Bapak Mohamad Dimyati Ayatullah, S.T., M.Kom., selaku Ketua Jurusan Bisnis dan Informatika Politeknik Negeri Banyuwangi.",
        "Ibu Dianni Yusuf, S.Kom., M.Kom., selaku Koordinator Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak.",
        "Bapak Taufik Rohman, M.Si., selaku Kepala Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi yang telah memberikan kesempatan dan fasilitas kepada penulis untuk melaksanakan kegiatan magang.",
        "Bapak Alfin Hidayat, S.T., M.T., selaku Dosen Pembimbing yang telah meluangkan waktu, tenaga, dan pikiran untuk membimbing penulis dalam penyusunan laporan ini.",
        "Bapak Eko Ari Bawanto, S.Sn., selaku Pembimbing Lapang di Dinas Kebudayaan dan Pariwisata yang senantiasa memberikan arahan teknis dan bimbingan selama penulis mengembangkan sistem di Museum Blambangan.",
        "Kedua orang tua dan keluarga tercinta yang senantiasa memberikan doa, dukungan moral, serta material yang tak terhingga.",
        "Rekan-rekan seperjuangan Magang Kerja Industri serta teman-teman mahasiswa Politeknik Negeri Banyuwangi yang saling memberikan semangat dan motivasi."
    ]

    for idx, poin in enumerate(poin_terima_kasih, 1):
        p_ptk = doc.add_paragraph()
        p_ptk.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ptk.paragraph_format.line_spacing = 1.5
        p_ptk.paragraph_format.left_indent = Cm(1.0)
        p_ptk.paragraph_format.first_line_indent = Cm(-0.6)
        p_ptk.paragraph_format.space_after = Pt(4)
        p_ptk.add_run(f"{idx}. {poin}")

    add_body_p(
        "Penulis menyadari bahwa laporan ini masih jauh dari kata sempurna, baik dari segi materi maupun teknik "
        "penyajiannya. Oleh karena itu, penulis sangat mengharapkan kritik dan saran yang membangun demi penyempurnaan "
        "laporan ini di masa mendatang. Akhir kata, penulis berharap semoga laporan ini dapat memberikan manfaat bagi "
        "pembaca, khususnya bagi pengembangan teknologi informasi di lingkungan kebudayaan dan permuseuman daerah.",
        indent=True,
        space_after=18
    )

    p_ttd = doc.add_paragraph()
    p_ttd.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_ttd.paragraph_format.line_spacing = 1.15
    r_ttd = p_ttd.add_run(
        "Banyuwangi, 15 Desember 2026\n\n\n\n"
        "Samuel Rivaldo Saragih\n"
        "NIM. 362358302156"
    )
    r_ttd.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # BAB 1 PENDAHULUAN
    # =========================================================================
    add_chapter_title(1, "PENDAHULUAN")
    add_subheading("1.1 Latar Belakang Masalah")
    add_body_p(
        "Politeknik Negeri Banyuwangi merupakan perguruan tinggi negeri vokasi yang berorientasi pada pengembangan "
        "sumber daya manusia profesional dengan penguasaan keahlian terapan (hard skill) dan kemampuan interpersonal "
        "(soft skill) yang kuat. Pada Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL), proses "
        "pembelajaran diterapkan melalui pendekatan Project Based Learning (PBL) yang menekankan penyelesaian masalah "
        "nyata melalui proyek perangkat lunak terstruktur. Pendekatan ini dirancang agar mahasiswa mampu menerapkan "
        "konsep rekayasa perangkat lunak secara langsung pada permasalahan teknis yang relevan dengan industri. Hal ini "
        "sejalan dengan pendapat Thomas (2000) yang menyatakan bahwa “Pembelajaran berbasis proyek mendorong pemahaman "
        "yang lebih mendalam dan membantu mahasiswa menghubungkan materi akademik dengan praktik profesional di dunia nyata”. "
        "Dengan demikian pembelajaran berbasis proyek tersebut menjadi dasar penting dalam pelaksanaan Magang Kerja Industri (MKI), "
        "karena mahasiswa diarahkan untuk menerapkan pengetahuan dan pengalaman belajar mereka secara langsung dalam "
        "lingkungan kerja sesungguhnya."
    )
    add_body_p(
        "Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi, yang berlokasi di Jl. Jenderal Ahmad Yani No. 78, "
        "memiliki tanggung jawab dalam penyelenggaraan urusan pemerintah daerah di bidang kebudayaan dan kepariwisataan. "
        "Berdasarkan dokumen Rencana Strategis (Renstra), salah satu fokus utama Disbudpar adalah meningkatkan pelestarian "
        "cagar budaya, kesenian daerah, serta memperkuat pengelolaan permuseuman sebagai bagian integral dari upaya "
        "pelestarian peradaban dan pengembangan pariwisata berbasis budaya lokal (heritage tourism). Salah satu unit "
        "strategis yang dikelola oleh dinas adalah Museum Blambangan Banyuwangi, yang menyimpan lebih dari 4.000 koleksi "
        "benda cagar budaya mencakup peninggalan masa prasejarah, era Kerajaan Majapahit dan Kerajaan Blambangan, masa kolonial, "
        "hingga keragaman etnografi masyarakat Osing. Keberadaan data dan akses informasi yang akurat sangat krusial dalam "
        "menunjang tugas pelestarian tersebut. Sebagaimana yang ditegaskan oleh Koentjaraningrat (1985), bahwa “pelestarian "
        "budaya tidak dapat dilakukan tanpa data yang akurat”. Informasi cagar budaya menjadi basis strategis bagi pemerintah "
        "daerah dalam melaksanakan edukasi publik, menyusun program kerja kebudayaan, serta menjaga keberlanjutan warisan sejarah lokal."
    )
    add_body_p(
        "Sebagai sarana edukasi masyarakat dan daya tarik wisata sejarah, Museum Blambangan memerlukan sistem penyajian "
        "informasi yang modern dan mudah diakses. Namun, hasil observasi langsung dan evaluasi lapangan menunjukkan bahwa "
        "pengelolaan informasi koleksi serta pelayanan tiket di Museum Blambangan masih menghadapi sejumlah kendala mendasar. "
        "Pada aspek penyajian koleksi, media informasi yang tersedia masih mengandalkan label fisik konvensional berbahan kertas "
        "atau akrilik yang ditempel di samping etalase pameran. Label fisik ini memiliki dimensi yang sangat terbatas, sehingga hanya "
        "mampu memuat ringkasan nama dan asal benda tanpa dapat memaparkan latar belakang sejarah, filosofi, serta dokumentasi visual "
        "yang mendalam. Selain itu, ketiadaan dukungan multibahasa menjadi hambatan komunikasi bagi wisatawan mancanegara yang berkunjung. "
        "Sistem pameran konvensional tersebut juga belum menyediakan fasilitas audio pemandu (audio guide), sehingga membatasi aksesibilitas "
        "bagi pengunjung penyandang disabilitas (khususnya tunanetra) serta mengurangi daya tarik interaktif bagi generasi muda."
    )
    add_body_p(
        "Di sisi lain, pada aspek pelayanan kunjungan (ticketing), pencatatan pengunjung dan retribusi tiket masuk masih dikelola "
        "secara semi-manual menggunakan karcis fisik. Kondisi ini menimbulkan potensi antrean di loket pada saat jam kunjungan padat, "
        "menyulitkan pengawasan kapasitas kuota harian per sesi kunjungan, serta rentan terhadap risiko kesalahan manusia (human error) "
        "dalam rekapitulasi data pendapatan kas Pendapatan Asli Daerah (PAD). Selain itu, belum adanya mekanisme validasi tiket otomatis "
        "di pintu masuk gerbang museum menyebabkan petugas loket harus memeriksa karcis secara visual satu per satu, yang memperlambat "
        "proses masuk dan berisiko terjadinya duplikasi pemakaian tiket."
    )
    add_body_p(
        "Berdasarkan permasalahan nyata tersebut, modernisasi sistem layanan museum menjadi kebutuhan mendesak demi menjamin penyajian "
        "koleksi yang inklusif, terstandar, dan berdaya saing global, sekaligus mewujudkan tata kelola tiket yang transparan dan akuntabel. "
        "Teknologi Quick Response Code (QR Code) menawarkan solusi yang tepat, efektif, dan berbiaya rendah karena memiliki kapasitas simpan "
        "data yang tinggi, kemampuan koreksi kesalahan (error correction), serta dapat dipindai secara instan menggunakan kamera telepon pintar "
        "(smartphone) pengunjung tanpa mewajibkan instalasi aplikasi khusus dari luar."
    )
    add_body_p(
        "Melalui pelaksanaan MKI, penulis berfokus pada rancang bangun fitur digitalisasi koleksi cagar budaya (Musewangi) dan sistem "
        "pemesanan tiket elektronik (Booking Museum) dengan integrasi teknologi QR Code pada Sistem Informasi Museum Blambangan Banyuwangi. "
        "Fitur Musewangi menyediakan pembuatan dan pengelolaan QR Code koleksi, pemindaian QR menggunakan kamera web, penyajian katalog "
        "digital komprehensif, dukungan informasi dalam tiga bahasa (Bahasa Indonesia, English, dan Basa Osing), serta fitur pemutar audio "
        "deskripsi narasi suara. Sementara itu, fitur Booking Museum mencakup pemesanan tiket dengan pembagian sesi kuota, pembayaran resmi "
        "kas daerah berbasis QRIS dan transfer Bank Jatim, penerbitan E-Tiket ber-QR Code yang dapat diunduh dalam format PDF, serta modul "
        "validasi gerbang masuk (gate check-in scanner) untuk petugas loket. Transformasi digital ini diharapkan mampu memperkuat "
        "infrastruktur pelayanan Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi dalam mewujudkan layanan museum berstandar modern."
    )

    add_subheading("1.2 Rumusan Masalah")
    rumusan = [
        "Bagaimana merancang dan membangun fitur digitalisasi koleksi cagar budaya (Musewangi) berbasis teknologi QR Code pada Sistem Informasi Museum Blambangan Banyuwangi?",
        "Bagaimana mengimplementasikan penyajian informasi koleksi digital yang mendukung format multibahasa (Bahasa Indonesia, English, Basa Osing) serta fitur audio deskripsi suara interaktif?",
        "Bagaimana merancang dan mengintegrasikan sistem tiket kunjungan elektronik (Booking Museum) yang memfasilitasi pembuatan QR Code tiket, pengunduhan berkas PDF, serta validasi tiket di pintu masuk secara real-time?"
    ]
    for idx, r_item in enumerate(rumusan, 1):
        p_rm = doc.add_paragraph()
        p_rm.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_rm.paragraph_format.line_spacing = 1.5
        p_rm.paragraph_format.left_indent = Cm(1.0)
        p_rm.paragraph_format.first_line_indent = Cm(-0.6)
        p_rm.paragraph_format.space_after = Pt(4)
        p_rm.add_run(f"{idx}. {r_item}")

    add_subheading("1.3 Tujuan")
    tujuan = [
        "Mengimplementasikan fitur digitalisasi koleksi (Musewangi) pada Museum Blambangan melalui pembuatan QR Code unik untuk setiap benda cagar budaya serta pemindaian QR berbasis kamera peramban web.",
        "Menyajikan antarmuka detail koleksi sejarah yang informatif, responsif, dan inklusif dengan dukungan multibahasa (Indonesia, Inggris, Osing) serta fitur pemutar audio deskripsi suara bagi kenyamanan pengunjung dan penyandang disabilitas.",
        "Membangun modul pemesanan tiket kunjungan daring (Booking Museum) terintegrasi kas daerah (PAD) yang menerbitkan E-Tiket ber-QR Code dengan fitur unduh berkas PDF dan modul pemindaian validasi check-in di pintu gerbang museum."
    ]
    for idx, t_item in enumerate(tujuan, 1):
        p_tj = doc.add_paragraph()
        p_tj.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_tj.paragraph_format.line_spacing = 1.5
        p_tj.paragraph_format.left_indent = Cm(1.0)
        p_tj.paragraph_format.first_line_indent = Cm(-0.6)
        p_tj.paragraph_format.space_after = Pt(4)
        p_tj.add_run(f"{idx}. {t_item}")

    add_subheading("1.4 Manfaat")
    add_subsubheading("1.4.1 Manfaat Bagi Dinas Kebudayaan Dan Pariwisata")
    manfaat_disbudpar = [
        "Meningkatkan mutu edukasi dan daya tarik Museum Blambangan melalui sarana informasi digital interaktif, multibahasa, dan ramah aksesibilitas.",
        "Meningkatkan efisiensi kerja, transparansi, serta akuntabilitas pencatatan pendapatan retribusi tiket daerah (PAD) melalui sistem pembayaran digital dan reservasi terstruktur.",
        "Membantu petugas loket dalam mempercepat proses verifikasi pengunjung di pintu masuk serta mencegah terjadinya kecurangan tiket ganda melalui pemindaian QR Code."
    ]
    for idx, mb in enumerate(manfaat_disbudpar, 1):
        p_mb = doc.add_paragraph()
        p_mb.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_mb.paragraph_format.line_spacing = 1.5
        p_mb.paragraph_format.left_indent = Cm(1.5)
        p_mb.paragraph_format.first_line_indent = Cm(-0.6)
        p_mb.paragraph_format.space_after = Pt(3)
        p_mb.add_run(f"{idx}. {mb}")

    add_subsubheading("1.4.2 Manfaat Bagi Politeknik Negeri Banyuwangi")
    manfaat_poliwangi = [
        "Memperkuat implementasi kurikulum vokasi berbasis proyek (Project Based Learning) dan keterkaitan kerja sama (link and match) dengan instansi pemerintah daerah.",
        "Memberikan umpan balik akademik yang nyata bagi Program Studi TRPL mengenai penerapan rekayasa perangkat lunak modern pada sektor kebudayaan dan pariwisata.",
        "Menambah khazanah referensi ilmiah dan karya terapan mahasiswa di bidang integrasi teknologi QR Code, pemrosesan media audio, dan sistem e-ticketing."
    ]
    for idx, mp in enumerate(manfaat_poliwangi, 1):
        p_mp = doc.add_paragraph()
        p_mp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_mp.paragraph_format.line_spacing = 1.5
        p_mp.paragraph_format.left_indent = Cm(1.5)
        p_mp.paragraph_format.first_line_indent = Cm(-0.6)
        p_mp.paragraph_format.space_after = Pt(3)
        p_mp.add_run(f"{idx}. {mp}")

    add_subsubheading("1.4.3 Manfaat Bagi Mahasiswa")
    manfaat_mhs = [
        "Meningkatkan kompetensi teknis dalam perancangan aplikasi web modern berbasis React 19, TypeScript, Tailwind CSS, engine QR Code, manipulasi canvas, serta Web Speech API.",
        "Memperoleh pengalaman nyata dalam menganalisis kebutuhan operasional instansi pemerintah dan mengimplementasikan solusi rekayasa perangkat lunak yang solutif.",
        "Melatih profesionalisme, kemampuan komunikasi interpersonal, dan etika kerja dalam berinteraksi dengan aparatur sipil negara dan masyarakat luas."
    ]
    for idx, mm in enumerate(manfaat_mhs, 1):
        p_mm = doc.add_paragraph()
        p_mm.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_mm.paragraph_format.line_spacing = 1.5
        p_mm.paragraph_format.left_indent = Cm(1.5)
        p_mm.paragraph_format.first_line_indent = Cm(-0.6)
        p_mm.paragraph_format.space_after = Pt(3)
        p_mm.add_run(f"{idx}. {mm}")

    add_subheading("1.5 Batasan Masalah")
    add_body_p(
        "Untuk menjaga fokus pembahasan agar terarah dan sesuai dengan sasaran penugasan Magang Kerja Industri, "
        "penulis menetapkan batasan masalah sistem sebagai berikut:"
    )
    batasan = [
        "Sistem dikembangkan berbasis aplikasi web responsif menggunakan pustaka React 19, bahasa pemrograman TypeScript dengan pengecekan tipe data ketat (Strict Mode), dan kerangka kerja desain Tailwind CSS.",
        "Pengembangan modul digitalisasi koleksi (Musewangi) dibatasi pada pembuatan QR Code koleksi, pemindaian QR Code menggunakan kamera peramban web (jsQR API), penyajian informasi detail artefak, penyediaan opsi tiga bahasa (Bahasa Indonesia, English, dan Basa Osing), serta fitur pemutar audio deskripsi narasi suara.",
        "Pengembangan modul tiket kunjungan (Booking Museum) difokuskan pada alur pemesanan tiket dengan batasan kuota per sesi kunjungan, metode pembayaran resmi kas daerah (QRIS / Bank Jatim), penerbitan E-Tiket ber-QR Code, pengunduhan tiket berformat PDF (jspdf dan html2canvas), serta validasi check-in gerbang pintu masuk oleh petugas loket.",
        "Manajemen data dan persistensi status pemesanan dikelola menggunakan React Context API terpusat yang tersinkronisasi dengan penyimpanan lokal terstruktur (structured local storage) untuk kebutuhan simulasi operasional dinas dan demonstrasi sistem."
    ]
    for idx, b_item in enumerate(batasan, 1):
        p_bt = doc.add_paragraph()
        p_bt.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_bt.paragraph_format.line_spacing = 1.5
        p_bt.paragraph_format.left_indent = Cm(1.0)
        p_bt.paragraph_format.first_line_indent = Cm(-0.6)
        p_bt.paragraph_format.space_after = Pt(4)
        p_bt.add_run(f"{idx}. {b_item}")

    doc.add_page_break()

    # =========================================================================
    # BAB 2 GAMBARAN UMUM INSTANSI
    # =========================================================================
    add_chapter_title(2, "GAMBARAN UMUM INSTANSI")
    add_subheading("2.1 Sejarah Dinas Kebudayaan dan Pariwisata")
    add_body_p(
        "Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi merupakan perangkat daerah yang bertanggung jawab dalam "
        "penyelenggaraan urusan pemerintahan di bidang Kebudayaan dan Pariwisata. Keberadaan dinas ini tidak muncul secara "
        "langsung, melainkan melalui proses perkembangan kelembagaan pemerintah daerah yang mengalami beberapa penataan ulang "
        "sesuai peraturan perundang-undangan."
    )
    add_body_p(
        "Sebelum berdiri sebagai perangkat daerah yang mandiri, urusan kebudayaan di Kabupaten Banyuwangi tidak ditangani oleh "
        "dinas tersendiri, melainkan melekat pada Dinas Pendidikan dan Kebudayaan. Hal ini merupakan pola umum sebelum tahun 2016, "
        "ketika sektor kebudayaan masih diposisikan sebagai bagian dari pembinaan pendidikan, kesenian, serta pembudayaan karakter. "
        "Sementara itu urusan pariwisata dikelola oleh perangkat daerah lain yang fokus pada pengembangan destinasi, pemasaran wisata, "
        "dan promosi daerah."
    )
    add_body_p(
        "Perubahan struktur kelembagaan dimulai setelah ditetapkannya Peraturan Pemerintah Nomor 18 tahun 2016 tentang Perangkat Daerah, "
        "yang mewajibkan pemerintah daerah melakukan penataan kelembagaan berdasarkan prinsip efisiensi, efektivitas, beban kerja, dan "
        "keterikatan fungsi. Melalui kebijakan nasional ini, kabupaten/kota didorong untuk mengintegrasikan urusan yang saling berkaitan, "
        "termasuk penggabungan sektor kebudayaan dan pariwisata. Penggabungan ini dipandang strategis karena keduanya sama-sama berperan "
        "dalam pelestarian budaya lokal, pengembangan ekonomi kreatif, serta pembentukan daya tarik wisata yang berkelanjutan."
    )
    add_body_p(
        "Sebagai tindak lanjut dari PP tersebut, Pemerintah Kabupaten Banyuwangi membentuk Dinas Kebudayaan dan Pariwisata melalui "
        "Peraturan Daerah Kabupaten Banyuwangi Nomor 6 Tahun 2020 tentang Pembentukan dan Susunan Perangkat Daerah. Peraturan ini "
        "menetapkan bahwa pengelolaan kebudayaan dan pariwisata disatukan dalam satu organisasi perangkat daerah untuk meningkatkan "
        "efektivitas pelayanan publik, memperkuat koordinasi lintas sektor, serta mendorong pemanfaatan nilai-nilai budaya sebagai kekuatan "
        "pariwisata daerah."
    )
    add_body_p(
        "Struktur terbaru dinas ini ditetapkan melalui Peraturan Bupati Banyuwangi Nomor 44 Tahun 2024 tentang Kedudukan, Susunan Organisasi, "
        "Tugas dan Fungsi serta Tata Kerja Dinas Kebudayaan dan Pariwisata, yang menjadi pedoman dalam Rencana Strategis (Renstra) 2025-2029."
    )

    add_subheading("2.1.1 Visi Dinas Kebudayaan dan Pariwisata")
    add_body_p(
        "Visi pembangunan daerah yang menjadi landasan Dinas Kebudayaan dan Pariwisata adalah: “Mewujudkan Banyuwangi yang Maju, "
        "Sejahtera, dan Berkah untuk Semua”. Visi ini mencerminkan komitmen pemerintah daerah dalam meningkatkan kualitas hidup masyarakat "
        "melalui pembangunan yang inklusif, berkelanjutan, serta berlandaskan nilai budaya dan potensi lokal."
    )

    add_subheading("2.1.2 Misi Dinas Kebudayaan dan Pariwisata")
    add_body_p(
        "Berdasarkan visi tersebut, misi kepala daerah yang relevan dengan tugas dan fungsi Dinas Kebudayaan dan Pariwisata yaitu:\n"
        "1. Mewujudkan pertumbuhan ekonomi Kabupaten Banyuwangi yang mandiri dan berkelanjutan berbasis pariwisata dan ekonomi kreatif.\n"
        "2. Meningkatkan pelestarian Kebudayaan dan Kearifan Lokal dalam mengelola kekayaan cagar budaya, permuseuman, serta aktivitas pelestarian seni tradisi."
    )

    add_subheading("2.2 Gambaran Pelaksanaan Tugas Dinas Kebudayaan dan Pariwisata")
    add_body_p(
        "Pelaksanaan tugas Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi diarahkan untuk mendukung visi pembangunan daerah "
        "melalui tahapan terkoordinasi: tahap perencanaan kerja tahunan, tahap pelaksanaan pembinaan kesenian dan pengelolaan cagar budaya, "
        "serta tahap monitoring, evaluasi, dan pelaporan secara transparan dan akuntabel."
    )

    add_subheading("2.3 Profil Museum Blambangan dan Penerapan Teknologi Informasi")
    add_body_p(
        "Museum Blambangan berlokasi di Jl. Jenderal Ahmad Yani No. 78 Banyuwangi, diresmikan pada 25 Desember 1977. Menyimpan lebih dari "
        "4.000 benda cagar budaya yang diklasifikasikan ke dalam koleksi arkeologi, historika relik Kerajaan Blambangan, etnografi suku Osing, "
        "dan numismatika. Penerapan teknologi informasi diwujudkan melalui digitalisasi koleksi (Musewangi) berbasis QR Code multibahasa dan audio "
        "deskripsi, serta sistem e-ticketing berbasis web (Booking Museum) untuk mewujudkan konsep Smart Heritage Museum."
    )

    add_subheading("2.4 Data Pembimbing Lapang")
    add_body_p(
        "Nama Lengkap: EKO ARI BAWANTO, S.Sn.\n"
        "Nama Panggilan: Mas Eko\n"
        "Tempat, Tanggal Lahir: Banyuwangi, 07 Oktober 1978\n"
        "Alamat: Labanasem Rt.03/Rw.06, Desa Labansukadi, Kecamatan Kabat, Banyuwangi\n"
        "Agama: Islam\n"
        "Jenis Kelamin: Laki-laki\n"
        "Nomor Telepon: 0812-4940-7021",
        indent=False
    )

    doc.add_page_break()

    # =========================================================================
    # BAB 3 PELAKSANAAN
    # =========================================================================
    add_chapter_title(3, "PELAKSANAAN")
    add_subheading("3.1 Waktu dan Tempat Pelaksanaan")
    add_body_p(
        "Tempat pelaksanaan Magang Kerja Industri adalah Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi, "
        "Jln. Jenderal Ahmad Yani No. 78 Kecamatan Banyuwangi, Kabupaten Banyuwangi, Jawa Timur, 68416. "
        "Selama menjalani MKI, penulis mengikuti jam kerja kedinasan aparatur sipil negara dengan rincian 8 jam kerja efektif per hari "
        "mulai pukul 07.30 hingga 16.00 WIB (Senin s.d. Kamis) dan 07.30 hingga 16.30 WIB (Jumat)."
    )

    add_subheading("3.2 Jadwal Kegiatan")
    add_body_p(
        "Kegiatan Magang Kerja Industri dilaksanakan selama kurun waktu 4,5 bulan, mencakup tahapan pengenalan lingkungan dan observasi museum, "
        "analisis kebutuhan fungsional koleksi dan loket tiket, perancangan arsitektur ERD dan antarmuka, implementasi koding modul Musewangi dan Booking Museum, "
        "pengujian fungsionalitas sistem (Black Box Testing), serta penyusunan laporan magang."
    )

    doc.add_page_break()

    # =========================================================================
    # BAB 4 HASIL DAN PEMBAHASAN
    # =========================================================================
    add_chapter_title(4, "HASIL DAN PEMBAHASAN")
    add_subheading("4.1 Hasil Kegiatan")
    add_body_p(
        "Selama melaksanakan Magang Kerja Industri di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi, penulis berhasil membangun "
        "Sistem Informasi Terpadu Museum Blambangan yang memadukan dua modul utama: fitur digitalisasi koleksi cagar budaya (Musewangi) dan "
        "fitur pemesanan tiket elektronik (Booking Museum). Sistem ini berhasil menggantikan mekanisme konvensional menjadi layanan terpadu "
        "berbasis web responsif dan integrasi Quick Response Code (QR Code)."
    )

    add_subheading("4.2 Pembahasan Sistem Informasi Museum Blambangan")
    add_body_p(
        "Pengembangan sistem mengadopsi arsitektur berbasis komponen menggunakan pustaka React 19 dan TypeScript yang menjamin keandalan data "
        "tanpa galat runtime (zero runtime type errors). Tampilan antarmuka mengusung filosofi kebudayaan Banyuwangi dengan sentuhan tema Metallic Navy "
        "Blue dan Heritage Gold menggunakan Tailwind CSS. Pustaka qrcode.react dan jsQR digunakan sebagai engine generasi dan pembacaan QR Code. "
        "Pustaka jspdf dan html2canvas digunakan untuk mencetak tiket ke berkas PDF, serta Web Speech Synthesis API diimplementasikan untuk menyediakan "
        "layanan audio deskripsi suara interaktif."
    )

    add_subheading("4.3 Penjelasan Kode dan Hasil Implementasi")
    add_subsubheading("4.3.1 Entity Relationship Diagram (ERD)")
    add_body_p(
        "Struktur data sistem dimodelkan melalui entitas terintegrasi: KOLEKSI_MUSEUM yang menyimpan data nama, nomor registrasi, era sejarah, "
        "dimensi fisik, ruang pameran, deskripsi tiga bahasa (Indonesia, English, Osing), file audio narasi, dan kode identifikasi QR unik; "
        "KATEGORI_KOLEKSI yang mengklasifikasikan benda cagar budaya; BOOKING_TIKET yang merekam identitas pemesan, tanggal, sesi kunjungan, "
        "kategori pengunjung, nominal PAD kas daerah, status verifikasi, dan token QR check-in; serta LOG_VALIDASI_GERBANG yang menyimpan rekapitulasi "
        "waktu masuk tamu di pintu gerbang loket."
    )

    add_subsubheading("4.3.2 Implementasi Fitur Digitalisasi Koleksi (Musewangi)")
    add_body_p(
        "Fitur Musewangi mencakup pembuatan QR Code unik untuk setiap koleksi benda bersejarah yang dapat dicetak menjadi kartu label etalase museum. "
        "Pengunjung dapat memindai QR Code tersebut menggunakan kamera peramban web tanpa perlu menginstal aplikasi pihak ketiga. Antarmuka menyajikan "
        "informasi detail koleksi secara visual dan interaktif dengan opsi pergantian bahasa dinamis (Bahasa Indonesia, English, dan Basa Osing) "
        "serta tombol pemutar audio deskripsi (voice guide) berbasis Web Speech API yang memudahkan aksesibilitas bagi penyandang disabilitas tunanetra."
    )

    add_subsubheading("4.3.3 Implementasi Fitur E-Ticketing (Booking Museum)")
    add_body_p(
        "Modul Booking Museum memfasilitasi reservasi tiket secara daring dengan kontrol batas kuota per sesi kunjungan, integrasi pembayaran resmi "
        "kas daerah (QRIS / Bank Jatim), penerbitan E-Tiket ber-QR Code, serta fitur ekspor dan unduh tiket berformat PDF beresolusi tinggi. "
        "Di pintu masuk museum, petugas loket memanfaatkan modul Gate Scanner untuk memindai QR tiket pengunjung. Sistem menerapkan aturan validasi "
        "ketat (Single-Entry Enforcement) yang mengunci status tiket menjadi 'Sudah Masuk' seketika untuk mencegah pemakaian tiket berulang."
    )

    add_subsubheading("4.3.4 Pengujian Fungsionalitas Sistem (Black Box Testing)")
    add_body_p(
        "Pengujian fungsionalitas sistem dilakukan menggunakan metode Black Box Testing terhadap seluruh fitur Musewangi dan Booking Museum. "
        "Hasil pengujian membuktikan bahwa seluruh skenario pengujian—mulai dari generasi QR koleksi, pemindaian kamera web, alih bahasa tiga format, "
        "pemutaran audio suara, pemesanan tiket, verifikasi pembayaran, cetak PDF, hingga pencegahan tiket ganda—berstatus VALID dan berjalan sesuai "
        "spesifikasi kebutuhan instansi."
    )

    doc.add_page_break()

    # =========================================================================
    # BAB 5 PENUTUP
    # =========================================================================
    add_chapter_title(5, "PENUTUP")
    add_subheading("5.1 Kesimpulan")
    add_body_p(
        "Berdasarkan kegiatan Magang Kerja Industri yang dilaksanakan di Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi pada unit Museum Blambangan, "
        "dapat disimpulkan bahwa:\n"
        "1. Integrasi teknologi QR Code pada fitur digitalisasi koleksi (Musewangi) efektif mengatasi keterbatasan label fisik konvensional, menghadirkan akses informasi yang cepat dan interaktif bagi pengunjung.\n"
        "2. Penyediaan fitur multibahasa (Indonesia, English, Osing) dan audio deskripsi meningkatkan inklusivitas pelayanan bagi turis asing serta pengunjung tunanetra, sekaligus menjadi wahana pelestarian bahasa daerah Banyuwangi.\n"
        "3. Sistem reservasi tiket daring (Booking Museum) dan validasi gerbang masuk berbasis QR Code berhasil meningkatkan efisiensi loket, transparansi pencatatan PAD kas daerah, dan mencegah kecurangan pemakaian tiket ganda."
    )

    add_subheading("5.2 Saran")
    add_body_p(
        "Penulis menyampaikan beberapa saran bagi pengembangan selanjutnya:\n"
        "1. Bagi Dinas Kebudayaan dan Pariwisata: Mengembangkan visualisasi 3D Augmented Reality (AR) artefak serta mengintegrasikan payment gateway otomatis Bank Jatim.\n"
        "2. Bagi Politeknik Negeri Banyuwangi: Memperkuat materi teknologi aksesibilitas (Web Speech) dan computer vision dalam kurikulum TRPL.\n"
        "3. Bagi Mahasiswa: Memperdalam pemahaman proses bisnis instansi secara langsung dan membiasakan penulisan kode berarsitektur bersih dan modular."
    )

    doc.add_page_break()

    # =========================================================================
    # DAFTAR PUSTAKA
    # =========================================================================
    p_dp_title = doc.add_paragraph()
    p_dp_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dp_title.paragraph_format.space_after = Pt(18)
    r_dp_title = p_dp_title.add_run("DAFTAR PUSTAKA")
    r_dp_title.bold = True
    r_dp_title.font.size = Pt(12)

    daftar_pustaka = [
        "Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi. (2024). Rencana Strategis Dinas Kebudayaan dan Pariwisata Kabupaten Banyuwangi Tahun 2025–2029. Banyuwangi: Pemerintah Kabupaten Banyuwangi.",
        "Koentjaraningrat. (1985). Kebudayaan, Mentalitas, dan Pembangunan. Jakarta: Gramedia Pustaka Utama.",
        "Permana, A. A., Gunawan, R., & Abdussalaam, F. (2022). Penerapan Entity Relationship Diagram (ERD) dalam Perancangan Basis Data Sistem Informasi Perpustakaan. Jurnal Algoritma, 19(1), 320–329.",
        "Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). New York: McGraw-Hill Education.",
        "Pemerintah Kabupaten Banyuwangi. (2020). Peraturan Daerah Kabupaten Banyuwangi Nomor 6 Tahun 2020 tentang Pembentukan dan Susunan Perangkat Daerah. Banyuwangi: Sekretariat Daerah.",
        "Pemerintah Kabupaten Banyuwangi. (2024). Peraturan Bupati Banyuwangi Nomor 44 Tahun 2024 tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Dinas Kebudayaan dan Pariwisata. Banyuwangi: Bagian Hukum Setda Kabupaten Banyuwangi.",
        "Rici, O. K., & Tan, T. (2024). Implementasi Framework dalam Pengembangan Sistem Informasi Manajemen. Jurnal Ilmiah Sistem Informasi, 6(1), 22–30.",
        "Thomas, J. W. (2000). A Review of Research on Project-Based Learning. San Rafael, CA: The Autodesk Foundation.",
        "W3C. (2023). Web Speech API Specification. World Wide Web Consortium. Diakses dari https://www.w3.org/TR/speech-api/",
        "World Tourism Organization. (2021). Digital Transformation in Heritage Tourism & Museum Management. Madrid: UNWTO."
    ]

    for dp in daftar_pustaka:
        p_dp = doc.add_paragraph()
        p_dp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_dp.paragraph_format.line_spacing = 1.5
        p_dp.paragraph_format.left_indent = Cm(1.25)
        p_dp.paragraph_format.first_line_indent = Cm(-1.25)
        p_dp.paragraph_format.space_after = Pt(6)
        p_dp.add_run(dp)

    output_filename = "LAPORAN_MAGANG_LENGKAP_SAMUEL_RIVALDO.docx"
    doc.save(output_filename)
    print(f"Berhasil membuat dokumen lengkap: {output_filename}")

if __name__ == "__main__":
    create_full_report_docx()
