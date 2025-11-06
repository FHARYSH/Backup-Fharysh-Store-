document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Sembunyikan preloader setelah halaman selesai dimuat
        window.addEventListener('load', () => preloader.classList.add('hidden'));
        // Fallback: Sembunyikan paksa setelah beberapa detik jika 'load' lambat
        setTimeout(() => preloader.classList.add('hidden'), 1500);
    }

    // --- 2. INISIALISASI AOS (ANIMASI SCROLL - LOOPING) ---
    AOS.init({ 
        duration: 800, // Durasi animasi
        once: false,   // 'false' berarti animasi akan berulang (looping) setiap kali scroll
        offset: 80     // Jarak trigger animasi
    });

    // --- 3. INISIALISASI TYPED.JS (EFEK KETIK) ---
    const typedTarget = document.querySelector('.typed-text');
    if (typedTarget) {
        new Typed('.typed-text', {
            strings: ['Hiburan.', 'Kreativitas.', 'Produktivitas.'],
            typeSpeed: 70, 
            backSpeed: 50, 
            backDelay: 1500, 
            loop: true
        });
    }
    
    // --- 4. NAVBAR SHRINK ON SCROLL ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Jika scroll lebih dari 50px
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // --- 5. BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Tampilkan setelah scroll 300px
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        // Klik untuk smooth scroll ke atas
        backToTopButton.addEventListener('click', (e) => {
             e.preventDefault(); 
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- (Bagian Search Bar sengaja dihapus sesuai permintaan) ---

    // --- 7. KODE FUNGSI HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    // Fungsi utilitas untuk menutup semua dropdown & mengaktifkan scroll body
    const closeAllDropdownsAndEnableScroll = () => {
        closeAllDropdowns();
        document.body.classList.remove('noscroll');
    };

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            
            // Jika menu hamburger ditutup
            if (!navLinksContainer.classList.contains('active')) {
                 closeAllDropdownsAndEnableScroll();
            } else {
                 // Jika menu hamburger dibuka DAN dropdown katalog sedang aktif
                 if (dropdownWrapper && dropdownWrapper.classList.contains('active')) {
                     document.body.classList.add('noscroll');
                 }
            }
        });
    }

    // --- 8. KODE FUNGSI DROPDOWN KATALOG (Klik & Nested) ---
    const catalogToggle = document.getElementById('catalog-toggle');
    const catalogMenu = document.getElementById('catalog-menu');
    const dropdownWrapper = catalogToggle ? catalogToggle.closest('.dropdown') : null;
    const categoryToggles = document.querySelectorAll('.category-toggle');

    // Fungsi untuk menutup semua sub-kategori
    const closeAllCategoryDropdowns = (exceptThisCategory = null) => {
        categoryToggles.forEach(toggle => {
            const category = toggle.closest('.dropdown-category');
            if (category !== exceptThisCategory) { 
                category.classList.remove('active'); 
            }
        });
    };
     // Fungsi untuk menutup dropdown utama "Katalog"
     const closeMainDropdown = () => {
         if (dropdownWrapper && catalogMenu && dropdownWrapper.classList.contains('active')) {
             dropdownWrapper.classList.remove('active'); 
             document.body.classList.remove('noscroll'); // Aktifkan lagi scroll body
         }
     };
     // Fungsi untuk menutup semua (utama + sub)
     const closeAllDropdowns = () => {
         closeMainDropdown(); 
         closeAllCategoryDropdowns();
     };

    if (catalogToggle && catalogMenu && dropdownWrapper) {
        // Event listener untuk tombol "Katalog" utama
        catalogToggle.addEventListener('click', (e) => {
             // Mencegah link #katalog melompat
             if (e.target.tagName === 'A' || e.target === catalogToggle || e.target.closest('#catalog-toggle')) { 
                 e.preventDefault(); 
             }
             
             const isActive = dropdownWrapper.classList.toggle('active');
             
             if (!isActive) { // Jika baru saja ditutup
                 closeAllCategoryDropdowns(); // Tutup semua sub-kategori
                 document.body.classList.remove('noscroll'); // Aktifkan scroll body
             } else { // Jika baru saja dibuka
                 document.body.classList.add('noscroll'); // Nonaktifkan scroll body
                 catalogMenu.scrollTop = 0; // Reset scroll dropdown ke atas
             }
        });

        // Event listener untuk tombol sub-kategori (Editing, Streaming, dll.)
        categoryToggles.forEach(toggle => {
             toggle.addEventListener('click', () => {
                 const parentCategory = toggle.closest('.dropdown-category');
                 const currentlyActive = parentCategory.classList.contains('active');
                 
                 closeAllCategoryDropdowns(parentCategory); // Tutup kategori lain
                 
                 if (!currentlyActive) { 
                     parentCategory.classList.add('active'); // Buka kategori ini
                 } else { 
                     parentCategory.classList.remove('active'); // Tutup kategori ini (jika diklik lagi)
                 }
             });
        });

        // Event listener untuk link produk di dalam dropdown
        const productLinksInDropdown = catalogMenu.querySelectorAll('.category-links a');
        productLinksInDropdown.forEach(link => { 
             link.addEventListener('click', () => { 
                 closeAllDropdownsAndEnableScroll(); // Tutup semua & aktifkan scroll
             }); 
        });
    }
    
    // Event listener untuk klik di luar area dropdown/navbar
    document.addEventListener('click', (e) => {
        // Jika klik di luar dropdown DAN di luar hamburger
        if (dropdownWrapper && !dropdownWrapper.contains(e.target) && hamburger && !hamburger.contains(e.target) && !e.target.closest('.hamburger-menu')) {
             closeAllDropdownsAndEnableScroll();
        }
    });

    // --- 9. KODE FUNGSI SMOOTH SCROLL (Untuk SEMUA Link #) ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    let navHeight = 0;
    if (navbar) { navHeight = navbar.offsetHeight; } // Ambil tinggi navbar awal

    scrollLinks.forEach(link => { 
        // Pastikan kita tidak menimpa listener tombol dropdown utama
        if (link.id !== 'catalog-toggle') { 
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Cek jika link valid (#hero, #katalog, #prod-netflix, dll)
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                         e.preventDefault(); 
                         if (navbar) { navHeight = navbar.offsetHeight; } // Ambil tinggi navbar terbaru (jika shrink)
                         const targetPosition = targetElement.offsetTop - navHeight - 15; // Offset 15px
                         window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                } else if (targetId === '#hero' || targetId === '#') { // Link ke Home/#
                     e.preventDefault(); 
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                // Tutup hamburger menu (jika terbuka) setelah link diklik
                if (navLinksContainer && hamburger && navLinksContainer.classList.contains('active')) {
                    hamburger.classList.remove('active'); 
                    navLinksContainer.classList.remove('active');
                    // (searchContainerNav dihapus dari sini)
                    closeAllDropdownsAndEnableScroll(); // Pastikan semua tertutup
                }
            });
        }
    });

}); // Akhir dari document.addEventListener('DOMContentLoaded')
