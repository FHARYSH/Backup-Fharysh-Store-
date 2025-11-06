// ===================================================
// --- 0. KONFIGURASI ---
// ===================================================

// URL Google Sheet CSV Anda
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJM96AooAlxUb0Vq9PRuvZofejCc01FytrE4FjmysgvFUAhsqiyJePy6ZmxGoqdyTdZjHoandHExwo/pub?gid=0&single=true&output=csv';

//
// ▼▼▼ PENTING! MASUKKAN GEMINI API KEY ANDA DI SINI ▼▼▼
//
// Dapatkan key Anda dari Google AI Studio: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyAl2ja8kktn2sOFUaUFbutRBcIsxFrftkc"; 
//
// ▲▲▲ PENTING! MASUKKAN GEMINI API KEY ANDA DI SINI ▲▲▲
//

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
const preloader = document.getElementById('preloader');
let allProductsList = []; // Variabel global untuk menyimpan daftar produk

// --- Mulai Eksekusi ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNGSI UTAMA: AMBIL & TAMPILKAN PRODUK (DAN DROPDOWN) ---
    
    function parseCSV(csvText) {
        try {
            const rows = csvText.trim().split('\n');
            if (rows.length < 2) return []; 
            const headers = rows.shift().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            return rows.map(row => {
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
                if (values.length === headers.length) {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    return obj;
                }
                return null;
            }).filter(Boolean);
        } catch (error) {
            console.error("Error parsing CSV:", error, csvText); return [];
        }
    }

    async function fetchAndDisplayProducts() {
        const categoryGridHtml = { editing: '', streaming: '', edukasi: '', utilitas: '' };
        const categoryLinksHtml = { editing: '', streaming: '', edukasi: '', utilitas: '' };
        let productsLoaded = false;

        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const csvText = await response.text();
            const products = parseCSV(csvText);
            if (products.length === 0 && csvText.length > 0) { throw new Error("Data CSV tidak bisa di-parse. Cek format Sheet."); }
            
            allProductsList = products; // Simpan produk ke variabel global untuk AI

            products.forEach(product => {
                if (!product.id || !product.kategori || !categoryGridHtml.hasOwnProperty(product.kategori)) {
                    console.warn("Produk dilewati (data tidak lengkap/kategori salah):", product.nama);
                    return; 
                }
                const waMessage = encodeURIComponent(`Halo FHARYSH STORE, saya mau order ${product.nama}`);
                const waLink = `https://wa.me/6285853409699?text=${waMessage}`;
                
                // 1. Buat HTML Card
                categoryGridHtml[product.kategori] += `
                    <div class="product-card" id="${product.id}" data-aos="fade-up">
                        <img src="${product.linkGambar}" alt="Logo ${product.nama}" loading="lazy">
                        <h2>${product.nama}</h2>
                        <p class="description">${product.deskripsi}</p>
                        <p class="price">${product.hargaRange}</p>
                        <a href="${waLink}" class="btn-order" target="_blank">Order via WA</a>
                    </div>`;
                
                // 2. Buat HTML Link Dropdown
                categoryLinksHtml[product.kategori] += `<a href="#${product.id}">${product.nama}</a>`;
            });

            // 3. Masukkan HTML ke Grid
            for (const categoryId in categoryGridHtml) {
                const gridElement = document.getElementById(`${categoryId}-grid`);
                if (gridElement) {
                    gridElement.innerHTML = categoryGridHtml[categoryId] || "<p>Belum ada produk untuk kategori ini.</p>";
                }
            }
            
            // 4. Masukkan HTML ke Dropdown
            for (const categoryId in categoryLinksHtml) {
                 const linksContainer = document.getElementById(`${categoryId}-links-container`);
                 if (linksContainer) {
                     linksContainer.innerHTML = categoryLinksHtml[categoryId] || "<p style='padding-left:15px; font-size:0.85rem; color: #888;'>Kosong</p>";
                 }
            }
            productsLoaded = true;

        } catch (error) {
            console.error("Error mengambil produk dari Google Sheet: ", error);
            for (const categoryId in categoryGridHtml) {
                 const gridElement = document.getElementById(`${categoryId}-grid`);
                 if (gridElement) { gridElement.innerHTML = "<p>Gagal memuat produk. Coba refresh halaman.</p>"; }
            }
        } finally {
            if (preloader) { preloader.classList.add('hidden'); }
            if (productsLoaded) {
                setTimeout(() => { AOS.refresh(); }, 100);
                setupSmoothScroll(); // Panggil ulang setup scroll untuk link baru
            }
        }
    }
    fetchAndDisplayProducts();


    // --- 2. INISIALISASI AOS (ANIMASI SCROLL - LOOPING) ---
    AOS.init({ duration: 800, once: false, offset: 80 });

    // --- 3. INISIALISASI TYPED.JS (EFEK KETIK) ---
    const typedTarget = document.querySelector('.typed-text');
    if (typedTarget) {
        new Typed('.typed-text', {
            strings: ['Hiburan.', 'Kreativitas.', 'Produktivitas.'],
            typeSpeed: 70, backSpeed: 50, backDelay: 1500, loop: true
        });
    }
    
    // --- 4. NAVBAR SHRINK ON SCROLL ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { navbar.classList.add('navbar-scrolled'); } 
            else { navbar.classList.remove('navbar-scrolled'); }
        });
    }

    // --- 5. BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { backToTopButton.classList.add('visible'); } 
            else { backToTopButton.classList.remove('visible'); }
        });
        backToTopButton.addEventListener('click', (e) => {
             e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 6. FUNGSI ASISTEN AI GEMINI ---
    const aiPromptInput = document.getElementById('ai-prompt-input');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiResponseContainer = document.getElementById('ai-response-container');
    const aiBtnText = aiGenerateBtn ? aiGenerateBtn.querySelector('.btn-text') : null;
    const aiBtnLoader = aiGenerateBtn ? aiGenerateBtn.querySelector('.loader-ai') : null;

    if (aiGenerateBtn && aiPromptInput && aiResponseContainer) {
        aiGenerateBtn.addEventListener('click', async () => {
            const userPrompt = aiPromptInput.value;
            if (!userPrompt.trim()) {
                aiResponseContainer.innerHTML = "<p>Harap masukkan kebutuhan Anda di kotak teks.</p>";
                aiResponseContainer.style.display = "block";
                return;
            }
            if (!GEMINI_API_KEY || GEMINI_API_KEY === "MASUKKAN_API_KEY_ANDA_DI_SINI") {
                aiResponseContainer.innerHTML = "<p><strong>Error:</strong> API Key Gemini belum diatur. Fitur AI tidak bisa berjalan.</p>";
                aiResponseContainer.style.display = "block";
                return;
            }

            // Tampilkan loading
            aiBtnText.style.display = 'none';
            aiBtnLoader.style.display = 'block';
            aiGenerateBtn.disabled = true;
            aiResponseContainer.style.display = 'none';

            try {
                const responseText = await callGeminiApi(userPrompt);
                const formattedHtml = simpleMarkdownToHtml(responseText);
                aiResponseContainer.innerHTML = formattedHtml;
                aiResponseContainer.style.display = 'block';
            } catch (error) {
                console.error("Error:", error);
                aiResponseContainer.innerHTML = `<p><strong>Maaf, terjadi kesalahan.</strong> Coba lagi nanti atau hubungi admin. Error: ${error.message}</p>`;
                aiResponseContainer.style.display = 'block';
            } finally {
                // Sembunyikan loading
                aiBtnText.style.display = 'block';
                aiBtnLoader.style.display = 'none';
                aiGenerateBtn.disabled = false;
            }
        });
    }

    /**
     * Mengirim prompt ke Gemini API dengan retry logic.
     */
    async function callGeminiApi(userPrompt) {
        // Buat daftar produk sederhana untuk konteks AI
        const productListForAI = allProductsList.map(p => `${p.nama} (Kategori: ${p.kategori}, Deskripsi: ${p.deskripsi})`).join('\n');
        
        const systemPrompt = `Anda adalah "Asisten AI FHARYSH STORE". Tugas Anda adalah membantu pengunjung menemukan produk yang tepat dari daftar katalog kami.

Katalog Kami:
${productListForAI}

Aturan:
1.  BACA permintaan pengguna.
2.  IDENTIFIKASI produk dari KATALOG KAMI yang paling sesuai dengan kebutuhan pengguna.
3.  Berikan 2-3 rekomendasi. Jelaskan MENGAPA produk itu cocok.
4.  Gunakan format **Nama Produk** (diikuti penjelasan).
5.  Gunakan bahasa Indonesia yang ramah dan profesional.
6.  JANGAN merekomendasikan produk yang tidak ada di katalog.
7.  JANGAN mengarang harga. Fokus pada rekomendasi berdasarkan deskripsi.
8.  Akhiri dengan ajakan untuk mengecek katalog atau bertanya ke admin via WA.`;
        
        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            // (Opsional: Tambahkan tools: [{ "google_search": {} }] jika ingin AI bisa browsing)
        };

        const responseText = await fetchWithRetry(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return responseText;
    }

    /**
     * Fetch dengan logic retry sederhana (exponential backoff).
     */
    async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Handle 429 (Too Many Requests) atau 5xx (Server Error)
                if ((response.status === 429 || response.status >= 500) && retries > 0) {
                    console.warn(`Retry ${retries}... menunggu ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchWithRetry(url, options, retries - 1, delay * 2);
                }
                const errorData = await response.json().catch(() => ({})); // Coba parse error JSON
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }
            
            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                throw new Error("Respons AI tidak valid atau kosong.");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error; // Lempar error agar bisa ditangani di .catch()
        }
    }

    /**
     * Konverter Markdown sederhana ke HTML.
     */
    function simpleMarkdownToHtml(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')     // Italic
            .replace(/^- (.*?)($|\n)/gm, '<li>$1</li>') // List item
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') // Bungkus list
            .replace(/\n/g, '<br>'); // Ganti baris baru
    }


    // --- 7. KODE FUNGSI HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    const closeAllDropdownsAndEnableScroll = () => {
        closeAllDropdowns();
        document.body.classList.remove('noscroll');
    };

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            if (!navLinksContainer.classList.contains('active')) {
                 closeAllDropdownsAndEnableScroll();
            } else {
                 if (dropdownWrapper && dropdownWrapper.classList.contains('active')) {
                     document.body.classList.add('noscroll');
                 }
            }
        });
    }

    // --- 8. KODE FUNGSI DROPDOWN KATALOG ---
    const catalogToggle = document.getElementById('catalog-toggle');
    const catalogMenu = document.getElementById('catalog-menu');
    const dropdownWrapper = catalogToggle ? catalogToggle.closest('.dropdown') : null;
    const categoryToggles = document.querySelectorAll('.category-toggle');

    const closeAllCategoryDropdowns = (exceptThisCategory = null) => {
        categoryToggles.forEach(toggle => {
            const category = toggle.closest('.dropdown-category');
            if (category !== exceptThisCategory) { category.classList.remove('active'); }
        });
    };
     const closeMainDropdown = () => {
         if (dropdownWrapper && catalogMenu && dropdownWrapper.classList.contains('active')) {
             dropdownWrapper.classList.remove('active'); 
             document.body.classList.remove('noscroll');
         }
     };
     const closeAllDropdowns = () => {
         closeMainDropdown(); 
         closeAllCategoryDropdowns();
     };

    if (catalogToggle && catalogMenu && dropdownWrapper) {
        catalogToggle.addEventListener('click', (e) => {
             if (e.target.tagName === 'A' || e.target === catalogToggle || e.target.closest('#catalog-toggle')) { e.preventDefault(); }
             const isActive = dropdownWrapper.classList.toggle('active');
             if (!isActive) { 
                 closeAllCategoryDropdowns(); 
                 document.body.classList.remove('noscroll'); 
             } else { 
                 document.body.classList.add('noscroll'); 
                 catalogMenu.scrollTop = 0; 
             }
        });
        categoryToggles.forEach(toggle => {
             toggle.addEventListener('click', () => {
                 const parentCategory = toggle.closest('.dropdown-category');
                 const currentlyActive = parentCategory.classList.contains('active');
                 closeAllCategoryDropdowns(parentCategory); 
                 if (!currentlyActive) { parentCategory.classList.add('active'); } 
                 else { parentCategory.classList.remove('active'); }
             });
        });
    }
    
    document.addEventListener('click', (e) => {
        if (dropdownWrapper && !dropdownWrapper.contains(e.target) && hamburger && !hamburger.contains(e.target) && !e.target.closest('.hamburger-menu')) {
             closeAllDropdownsAndEnableScroll();
        }
    });

    // --- 9. KODE FUNGSI SMOOTH SCROLL ---
    // Pisahkan fungsi ini agar bisa dipanggil ulang setelah data dimuat
    function setupSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]'); 
        let navHeight = 0;
        if (navbar) { navHeight = navbar.offsetHeight; }

        scrollLinks.forEach(link => { 
            if (link.id !== 'catalog-toggle') { 
                link.removeEventListener('click', handleScrollLinkClick); 
                link.addEventListener('click', handleScrollLinkClick); 
            }
        });
    }

    function handleScrollLinkClick(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                 e.preventDefault(); 
                 let navHeight = navbar ? navbar.offsetHeight : 0;
                 const targetPosition = targetElement.offsetTop - navHeight - 15;
                 window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        } else if (targetId === '#hero' || targetId === '#') {
             e.preventDefault(); 
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (navLinksContainer && hamburger && navLinksContainer.classList.contains('active')) {
            hamburger.classList.remove('active'); 
            navLinksContainer.classList.remove('active');
            closeAllDropdownsAndEnableScroll();
        }
        
        // Tutup dropdown jika link berasal dari dalam dropdown
        if (this.closest('.dropdown-menu')) {
            closeAllDropdownsAndEnableScroll();
        }
    }
    
    // Panggil sekali saat DOM load untuk link statis
    setupSmoothScroll();

}); // Akhir DOMContentLoaded
