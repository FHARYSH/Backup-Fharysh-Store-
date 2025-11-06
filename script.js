// ===================================================
// --- 0. KONFIGURASI GOOGLE SHEET & INISIALISASI ---
// ===================================================

// Link publik CSV dari Google Sheet Anda
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJM96AooAlxUb0Vq9PRuvZofejCc01FytrE4FjmysgvFUAhsqiyJePy6ZmxGoqdyTdZjHoandHExwo/pub?gid=0&single=true&output=csv';

// Elemen Preloader Utama
const preloader = document.getElementById('preloader');

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNGSI UTAMA: AMBIL & TAMPILKAN PRODUK ---
    
    /**
     * Mengubah teks CSV mentah menjadi array objek produk.
     * @param {string} csvText - Teks mentah dari file CSV.
     * @returns {Array<Object>} Array berisi objek produk.
     */
    function parseCSV(csvText) {
        try {
            const rows = csvText.trim().split('\n');
            if (rows.length < 2) return []; // Tidak ada data jika hanya ada header

            // Ambil header, bersihkan dari spasi/karakter aneh
            const headers = rows.shift().split(',').map(h => h.trim().replace(/^"|"$/g, ''));

            return rows.map(row => {
                // Parser CSV sederhana yang menangani koma di dalam deskripsi (jika terbungkus kutip)
                // Ini regex sederhana, data Anda harus bersih
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));

                if (values.length === headers.length) {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    return obj;
                }
                return null; // Baris tidak valid
            }).filter(Boolean); // Hapus baris yang tidak valid
        
        } catch (error) {
            console.error("Error parsing CSV:", error, csvText);
            return [];
        }
    }

    /**
     * Mengambil data dari Google Sheet dan merender kartu produk.
     */
    async function fetchAndDisplayProducts() {
        // Objek untuk menampung HTML per kategori
        const categoryHtml = {
            editing: '',
            streaming: '',
            edukasi: '',
            utilitas: ''
        };
        
        let productsLoaded = false;

        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            const products = parseCSV(csvText);

            if (products.length === 0 && csvText.length > 0) {
                 throw new Error("Data CSV tidak bisa di-parse. Cek format Sheet.");
            }

            // Loop setiap produk dan buat HTML Card
            products.forEach(product => {
                // Pastikan semua data ada
                if (!product.id || !product.kategori || !categoryHtml.hasOwnProperty(product.kategori)) {
                    console.warn("Produk dilewati (data tidak lengkap/kategori salah):", product.nama);
                    return; // Lewati produk ini
                }

                // Buat link WA yang di-encode dengan benar
                const waMessage = encodeURIComponent(`Halo FHARYSH STORE, saya mau order ${product.nama}`);
                const waLink = `https://wa.me/6285853409699?text=${waMessage}`;

                const productCardHTML = `
                    <div class="product-card" id="${product.id}" data-aos="fade-up">
                        <img src="${product.linkGambar}" alt="Logo ${product.nama}" loading="lazy">
                        <h2>${product.nama}</h2>
                        <p class="description">${product.deskripsi}</p>
                        <p class="price">${product.hargaRange}</p>
                        <a href="${waLink}" class="btn-order" target="_blank">Order via WA</a>
                    </div>
                `;
                
                categoryHtml[product.kategori] += productCardHTML;
            });

            // Masukkan semua HTML yang sudah terkumpul ke dalam grid
            for (const categoryId in categoryHtml) {
                const gridElement = document.getElementById(`${categoryId}-grid`);
                if (gridElement) {
                    if (categoryHtml[categoryId]) {
                        gridElement.innerHTML = categoryHtml[categoryId]; // Ganti loader dengan kartu produk
                    } else {
                        gridElement.innerHTML = "<p>Belum ada produk untuk kategori ini.</p>";
                    }
                }
            }
            
            productsLoaded = true;

        } catch (error) {
            console.error("Error mengambil produk dari Google Sheet: ", error);
            // Tampilkan error di semua grid
            for (const categoryId in categoryHtml) {
                 const gridElement = document.getElementById(`${categoryId}-grid`);
                 if (gridElement) {
                    gridElement.innerHTML = "<p>Gagal memuat produk. Coba refresh halaman.</p>";
                 }
            }
        } finally {
            // Sembunyikan preloader utama SETELAH fetch selesai (baik berhasil maupun gagal)
            if (preloader) {
                preloader.classList.add('hidden');
            }
            // Re-inisialisasi AOS agar animasi berfungsi pada kartu yang baru dimuat
            if (productsLoaded) {
                setTimeout(() => {
                    AOS.refresh();
                }, 100); // Beri jeda sedikit agar DOM update
            }
        }
    }
    
    // Panggil fungsi untuk memuat produk
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

    // --- 6. KODE FUNGSI HAMBURGER MENU ---
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

    // --- 7. KODE FUNGSI DROPDOWN KATALOG ---
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
        const productLinksInDropdown = catalogMenu.querySelectorAll('.category-links a');
        productLinksInDropdown.forEach(link => { 
             link.addEventListener('click', () => { closeAllDropdownsAndEnableScroll(); }); 
        });
    }
    document.addEventListener('click', (e) => {
        if (dropdownWrapper && !dropdownWrapper.contains(e.target) && hamburger && !hamburger.contains(e.target) && !e.target.closest('.hamburger-menu')) {
             closeAllDropdownsAndEnableScroll();
        }
    });

    // --- 8. KODE FUNGSI SMOOTH SCROLL ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    let navHeight = 0;
    if (navbar) { navHeight = navbar.offsetHeight; }

    scrollLinks.forEach(link => { 
        if (link.id !== 'catalog-toggle') { 
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                         e.preventDefault(); 
                         if (navbar) { navHeight = navbar.offsetHeight; }
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
            });
        }
    });

}); // Akhir DOMContentLoaded
