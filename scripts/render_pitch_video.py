import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
WIDTH = 1280
HEIGHT = 720
FPS = 24
OUTPUT_FILE = "video_pitching_museum_blambangan.mp4"

# Colors
NAVY_DEEP = (6, 21, 36)
NAVY_MID = (16, 43, 72)
GOLD = (212, 163, 89)
GOLD_LIGHT = (245, 230, 204)
WHITE = (255, 255, 255)
SLATE_GRAY = (148, 163, 184)
EMERALD = (16, 185, 129)
ROSE = (244, 63, 94)

# Fonts
FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
if not os.path.exists(FONT_BOLD):
    FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
if not os.path.exists(FONT_REGULAR):
    FONT_REGULAR = "C:/Windows/Fonts/arial.ttf"

def get_font(size, bold=False):
    path = FONT_BOLD if bold else FONT_REGULAR
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_gradient_background(draw, width, height, progress_slow=0.0):
    for y in range(height):
        ratio = y / height
        r = int(6 + ratio * 15 + np.sin(progress_slow) * 4)
        g = int(21 + ratio * 28 + np.cos(progress_slow) * 4)
        b = int(36 + ratio * 45)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_header(draw, title_category):
    # Top Brand Bar
    draw.rectangle([0, 0, WIDTH, 75], fill=(8, 24, 40, 230))
    draw.line([(0, 75), (WIDTH, 75)], fill=(34, 74, 114), width=1)
    
    # Left Emblem & Title
    draw.rectangle([40, 22, 48, 52], fill=GOLD)
    draw.text((60, 20), "MUSEUM BLAMBANGAN BANYUWANGI", font=get_font(18, True), fill=WHITE)
    draw.text((60, 44), "Dinas Kebudayaan & Pariwisata Kab. Banyuwangi • Poliwangi", font=get_font(12, False), fill=GOLD_LIGHT)
    
    # Right Category Pill
    pill_w = 260
    pill_x = WIDTH - 40 - pill_w
    draw.rounded_rectangle([pill_x, 20, pill_x + pill_w, 54], radius=10, fill=(212, 163, 89, 40), outline=GOLD, width=1)
    draw.text((pill_x + 20, 26), title_category, font=get_font(13, True), fill=GOLD_LIGHT)

def draw_footer_progress(draw, current_scene, total_scenes, scene_progress):
    # Bottom Subtitle & Progress Bar
    draw.line([(0, HEIGHT - 8), (WIDTH, HEIGHT - 8)], fill=(30, 50, 75), width=6)
    overall_progress = (current_scene + scene_progress) / total_scenes
    draw.line([(0, HEIGHT - 8), (int(WIDTH * overall_progress), HEIGHT - 8)], fill=GOLD, width=6)

# Scenes Definition
SCENES = [
    {
        "category": "01 • PENDAHULUAN & PROYEK",
        "duration": 5.0,  # seconds
        "title": "MUSEWANGI",
        "subtitle": "Sistem Informasi & E-Ticketing Resmi Museum Blambangan",
        "badge": "PROYEK MAGANG D4 TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)",
        "desc": [
            "Inovasi digitalisasi layanan publik pariwisata daerah",
            "Mendukung pelestarian cagar budaya & optimalisasi Pendapatan Asli Daerah (PAD)",
            "Politeknik Negeri Banyuwangi • 2026"
        ],
        "narration": "MUSEWANGI: Sistem E-Ticketing dan Katalog Digital Museum Blambangan Banyuwangi."
    },
    {
        "category": "02 • LATAR BELAKANG & TANTANGAN",
        "duration": 6.0,
        "title": "Tantangan Pengelolaan Museum Konvensional",
        "subtitle": "Hambatan operasional loket manual yang dihadapi selama ini",
        "cards": [
            ("Pencatatan Tiket Kertas Manual", "Rentan selisih hitung fisik dan pencatatan buku tamu yang lambat."),
            ("Risiko Kebocoran Retribusi", "Potensi inkonsistensi setoran PAD tanpa sistem rekap otomatis."),
            ("Minim Akses Wisatawan Luar", "Wisatawan luar kota sulit melihat kuota dan jadwal buka operasional."),
        ],
        "narration": "Pencatatan manual dan antrean loket fisik berisiko menimbulkan kebocoran retribusi."
    },
    {
        "category": "03 • SOLUSI: EKOSISTEM DIGITAL",
        "duration": 6.0,
        "title": "Solusi Terpadu: Ekosistem Web E-Ticketing",
        "subtitle": "Satu platform terintegrasi untuk wisatawan, loket, dan dinas",
        "cards": [
            ("Pemesanan 24/7 & Kuota Sesi", "Wisatawan dapat memesan tiket kapan saja dengan jatah kuota terkontrol."),
            ("QRIS Resmi Bank Jatim", "Pembayaran non-tunai langsung masuk ke rekening resmi Disbudpar."),
            ("E-Tiket Standar Gate Otomatis", "Tiket digital berformat PDF 300 DPI dengan barcode unik anti-duplikat."),
        ],
        "narration": "Hadirkan ekosistem E-Ticketing resmi terintegrasi QRIS daerah dan e-tiket digital."
    },
    {
        "category": "04 • PENGALAMAN WISATAWAN",
        "duration": 6.0,
        "title": "Reservasi Mudah Cukup dari Ponsel",
        "subtitle": "Pengunjung dapat memesan tiket dalam 3 langkah singkat",
        "cards": [
            ("Pilih Tanggal & Sesi", "Tersedia pilihan sesi pagi & siang, pembagian kuota mencegah penumpukan."),
            ("Kategori Tarif Resmi", "Pelajar Rp5.000 • Umum Rp7.500 • Mancanegara Rp20.000 • Rombongan Rp5.000"),
            ("Penerbitan E-Tiket Instan", "Unduh PDF A4 satu halaman atau simpan gambar tiket langsung ke galeri HP."),
        ],
        "narration": "Wisatawan memilih sesi kunjungan, bayar QRIS, dan menerima e-tiket digital seketika."
    },
    {
        "category": "05 • GATE PETUGAS & SCANNER",
        "duration": 6.0,
        "title": "Validasi Tiket Cepat & Efek Suara Kasir",
        "subtitle": "Petugas loket memindai QR tiket pengunjung dalam milidetik",
        "cards": [
            ("Akselerasi BarcodeDetector", "Kamera HP membaca QR di layar ponsel tamu secara instan tanpa lag."),
            ("Suara Scanner Kasir (Pip!)", "Efek suara scanner supermarket Honeywell/Zebra saat tiket valid."),
            ("Proteksi Tiket Ganda", "Sistem menolak tiket bekas dengan peringatan buzzer negatif yang jelas."),
        ],
        "narration": "Petugas memindai QR dengan akselerasi perangkat keras, lengkap dengan bunyi kasir supermarket."
    },
    {
        "category": "06 • KEUANGAN & CAGAR BUDAYA",
        "duration": 6.0,
        "title": "Transparansi PAD & Katalog Koleksi",
        "subtitle": "Akuntabilitas retribusi daerah serta edukasi sejarah interaktif",
        "cards": [
            ("Laporan Keuangan PAD", "Rekap transaksi otomatis harian, bulanan, dan ekspor data audit resmi."),
            ("Katalog Koleksi Musewangi", "Digitalisasi cagar budaya & label QR etalase edukasi bagi pengunjung."),
            ("Akses Berbasis Peran (RBAC)", "Pemisahan hak akses: Keuangan, Gate, Kurator, dan Administrator."),
        ],
        "narration": "Laporan pendapatan asli daerah tercatat transparan dan koleksi cagar budaya terdokumentasi digital."
    },
    {
        "category": "07 • TIM PENGEMBANG TRPL",
        "duration": 7.0,
        "title": "Tim Pengembang Proyek Magang TRPL",
        "subtitle": "Mahasiswa D4 Teknologi Rekayasa Perangkat Lunak - Politeknik Negeri Banyuwangi",
        "team": [
            ("Fitria Nur Aini", "Project Manager & UI/UX Specialist"),
            ("Syifa'ul Qolbi", "Frontend Developer & System Integrator"),
            ("Ahmad Rofi Ridho", "Backend Developer & Database Architect"),
            ("Samuel Christian H.", "Lead Developer & Mobile Specialist"),
        ],
        "narration": "Dikembangkan oleh mahasiswa TRPL: Fitria Nur Aini, Syifa'ul Qolbi, Ahmad Rofi Ridho, dan Samuel Christian H."
    },
    {
        "category": "08 • PENUTUP & IMPLEMENTASI",
        "duration": 5.0,
        "title": "Melestarikan Sejarah dengan Teknologi Masa Kini",
        "subtitle": "Sistem Informasi & E-Ticketing Museum Blambangan Siap Diimplementasikan",
        "badge": "STATUS: LIVE & TERVERIFIKASI DI NETLIFY",
        "desc": [
            "Akses URL: museum-blambangan-banyuwangi.netlify.app",
            "Mendukung digitalisasi pariwisata Banyuwangi Rebound",
            "Matur Nuwun • Terima Kasih"
        ],
        "narration": "Melestarikan sejarah dengan teknologi masa kini. Siap digunakan melayani masyarakat!"
    }
]

def render_frame(scene_idx, frame_in_scene, total_scene_frames):
    scene = SCENES[scene_idx]
    progress = frame_in_scene / total_scene_frames
    
    # Create PIL Image
    img = Image.new("RGB", (WIDTH, HEIGHT), NAVY_DEEP)
    draw = ImageDraw.Draw(img)
    
    # 1. Background
    draw_gradient_background(draw, WIDTH, HEIGHT, progress_slow=frame_in_scene * 0.03)
    
    # 2. Header
    draw_header(draw, scene["category"])
    
    # Subtle fade in / fade out at scene transitions
    alpha = 1.0
    fade_len = int(FPS * 0.5)
    if frame_in_scene < fade_len:
        alpha = frame_in_scene / fade_len
    elif frame_in_scene > total_scene_frames - fade_len:
        alpha = (total_scene_frames - frame_in_scene) / fade_len
    
    # Y-offset animation
    y_offset = int((1.0 - alpha) * 12)
    
    # 3. Main Content Rendering
    if "cards" in scene:
        # Title & Subtitle
        draw.text((70, 115 + y_offset), scene["title"], font=get_font(32, True), fill=WHITE)
        draw.text((70, 162 + y_offset), scene["subtitle"], font=get_font(16, False), fill=GOLD_LIGHT)
        
        # 3 Horizontal Cards
        card_w = 360
        card_h = 360
        spacing = 30
        start_x = 70
        y_pos = 210 + y_offset
        
        for i, (ctitle, cdesc) in enumerate(scene["cards"]):
            cx = start_x + i * (card_w + spacing)
            
            # Card Background
            draw.rounded_rectangle([cx, y_pos, cx + card_w, y_pos + card_h], radius=18, fill=(13, 34, 58), outline=(32, 68, 106), width=2)
            
            # Card Top Badge
            draw.rounded_rectangle([cx + 20, y_pos + 20, cx + 55, y_pos + 55], radius=10, fill=(212, 163, 89, 40), outline=GOLD, width=1)
            draw.text((cx + 31, y_pos + 25), str(i + 1), font=get_font(18, True), fill=GOLD)
            
            # Card Title
            draw.text((cx + 20, y_pos + 75), ctitle, font=get_font(20, True), fill=WHITE)
            draw.line([(cx + 20, y_pos + 120), (cx + 100, y_pos + 120)], fill=GOLD, width=2)
            
            # Card Description (wrapped)
            words = cdesc.split()
            lines = []
            curr = ""
            for w in words:
                if len(curr + " " + w) > 30:
                    lines.append(curr)
                    curr = w
                else:
                    curr = (curr + " " + w).strip()
            if curr:
                lines.append(curr)
                
            text_y = y_pos + 140
            for l in lines:
                draw.text((cx + 20, text_y), l, font=get_font(15, False), fill=SLATE_GRAY)
                text_y += 24
                
    elif "team" in scene:
        # Title & Subtitle
        draw.text((70, 115 + y_offset), scene["title"], font=get_font(32, True), fill=WHITE)
        draw.text((70, 162 + y_offset), scene["subtitle"], font=get_font(16, False), fill=GOLD_LIGHT)
        
        # 4 Team Member Cards
        card_w = 265
        card_h = 360
        spacing = 25
        start_x = 70
        y_pos = 210 + y_offset
        
        for i, (name, role) in enumerate(scene["team"]):
            cx = start_x + i * (card_w + spacing)
            
            # Card box
            draw.rounded_rectangle([cx, y_pos, cx + card_w, y_pos + card_h], radius=18, fill=(13, 34, 58), outline=(32, 68, 106), width=2)
            
            # Avatar placeholder circle
            center_x = cx + card_w // 2
            draw.ellipse([center_x - 45, y_pos + 35, center_x + 45, y_pos + 125], fill=(22, 54, 88), outline=GOLD, width=2)
            
            # Initials
            initials = "".join([w[0] for w in name.split()[:2]])
            draw.text((center_x - 18, y_pos + 62), initials, font=get_font(24, True), fill=GOLD_LIGHT)
            
            # Name
            draw.text((cx + 15, y_pos + 155), name, font=get_font(17, True), fill=WHITE)
            draw.line([(cx + 20, y_pos + 195), (cx + card_w - 20, y_pos + 195)], fill=(32, 68, 106), width=1)
            
            # Role
            role_words = role.split("&")
            r1 = role_words[0].strip()
            r2 = ("& " + role_words[1].strip()) if len(role_words) > 1 else ""
            draw.text((cx + 15, y_pos + 215), r1, font=get_font(13, True), fill=GOLD)
            if r2:
                draw.text((cx + 15, y_pos + 238), r2, font=get_font(12, False), fill=GOLD_LIGHT)
                
            # Badge
            draw.rounded_rectangle([cx + 15, y_pos + 300, cx + card_w - 15, y_pos + 335], radius=8, fill=(16, 185, 129, 30), outline=EMERALD, width=1)
            draw.text((cx + 35, y_pos + 308), "✓ Mahasiswa D4 TRPL", font=get_font(12, True), fill=EMERALD)
            
    else:
        # Title Hero Scenes (Scene 1 & 8)
        # Badge
        badge_text = scene.get("badge", "MUSEUM BLAMBANGAN")
        draw.rounded_rectangle([70, 130 + y_offset, 650, 168 + y_offset], radius=10, fill=(212, 163, 89, 35), outline=GOLD, width=1)
        draw.text((85, 140 + y_offset), badge_text, font=get_font(12, True), fill=GOLD_LIGHT)
        
        # Giant Title
        draw.text((70, 190 + y_offset), scene["title"], font=get_font(48, True), fill=WHITE)
        draw.text((70, 260 + y_offset), scene["subtitle"], font=get_font(22, True), fill=GOLD)
        
        draw.line([(70, 310 + y_offset), (700, 310 + y_offset)], fill=GOLD, width=2)
        
        # Bullet description list
        desc_y = 340 + y_offset
        for item in scene.get("desc", []):
            draw.ellipse([70, desc_y + 4, 82, desc_y + 16], fill=GOLD)
            draw.text((100, desc_y), item, font=get_font(18, False), fill=SLATE_GRAY)
            desc_y += 42
            
        # Right Preview Box
        rx = 780
        ry = 140 + y_offset
        rw = 430
        rh = 420
        draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=24, fill=(10, 28, 48), outline=GOLD, width=2)
        draw.text((rx + 30, ry + 30), "MUSEUM BLAMBANGAN", font=get_font(20, True), fill=WHITE)
        draw.text((rx + 30, ry + 60), "Kabupaten Banyuwangi", font=get_font(14, False), fill=GOLD_LIGHT)
        
        # Stats / Feature pills
        pills = [
            ("Pemesanan Tiket", "Online & Terverifikasi"),
            ("Metode Bayar", "QRIS Resmi Daerah"),
            ("Keamanan Gate", "QR Barcode Scanner"),
            ("Katalog Digital", "Koleksi Musewangi")
        ]
        py = ry + 110
        for p1, p2 in pills:
            draw.rounded_rectangle([rx + 25, py, rx + rw - 25, py + 55], radius=12, fill=(18, 44, 72), outline=(32, 68, 106), width=1)
            draw.text((rx + 40, py + 10), p1, font=get_font(13, True), fill=GOLD_LIGHT)
            draw.text((rx + 40, py + 30), p2, font=get_font(12, False), fill=SLATE_GRAY)
            py += 68

    # 4. Narration Subtitle Bar (Bottom overlay)
    sub_y = HEIGHT - 78
    draw.rectangle([0, sub_y, WIDTH, sub_y + 65], fill=(4, 14, 25, 240))
    draw.line([(0, sub_y), (WIDTH, sub_y)], fill=(32, 68, 106), width=1)
    
    # Mic icon & Text
    draw.rounded_rectangle([40, sub_y + 16, 120, sub_y + 48], radius=8, fill=(212, 163, 89, 40), outline=GOLD, width=1)
    draw.text((52, sub_y + 24), "NARASI", font=get_font(11, True), fill=GOLD)
    
    narration_text = scene.get("narration", "")
    draw.text((135, sub_y + 22), narration_text, font=get_font(16, True), fill=WHITE)
    
    # 5. Footer Progress Line
    draw_footer_progress(draw, scene_idx, len(SCENES), progress)
    
    # Convert PIL Image (RGB) to OpenCV format (BGR)
    frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    return frame

def main():
    print(f"[START] Starting video rendering: {OUTPUT_FILE} (1280x720 @ {FPS} FPS)...")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(OUTPUT_FILE, fourcc, FPS, (WIDTH, HEIGHT))
    
    total_scenes = len(SCENES)
    total_frames = 0
    
    for s_idx, scene in enumerate(SCENES):
        duration = scene["duration"]
        scene_frames = int(duration * FPS)
        print(f"  Rendering Scene {s_idx + 1}/{total_scenes}: {scene['category']} ({scene_frames} frames)...")
        
        for f in range(scene_frames):
            frame = render_frame(s_idx, f, scene_frames)
            out.write(frame)
            total_frames += 1
            
    out.release()
    file_size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    duration_sec = total_frames / FPS
    print(f"[SUCCESS] Video rendering complete!")
    print(f"Output file: {os.path.abspath(OUTPUT_FILE)}")
    print(f"Total duration: {duration_sec:.1f} seconds ({total_frames} frames)")
    print(f"File size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    main()
