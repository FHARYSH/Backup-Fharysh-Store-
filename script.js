document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => preloader.classList.add('hidden'));
        setTimeout(() => preloader.classList.add('hidden'), 1500);
    }

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

    // --- 6. KODE FUNGSI PENCARIAN (SEARCH BAR) ---
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        const productSections = document.querySelectorAll('.product-section');
        const kontakSection = document.getElementById('kontak');

        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filterSection = (section, cardSelector, titleSelector) => {
                // ... (Kode filter search sama seperti sebelumnya) ...
                let matchFoundInSection = false;
                const cards = section.querySelectorAll(cardSelector);
                cards.forEach(card => {
                    const titleElement = card.querySelector(titleSelector);
                    if (titleElement) {
                        const title = titleElement.textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            card.style.display = (cardSelector === '.product-card') ? "flex" : "";
                            matchFoundInSection = true;
                        } else { card.style.display = "none"; }
                    } else { card.style.display = "none"; }
                });
                if (matchFoundInSection || searchTerm === "") { section.style.display = ""; }
                else { section.style.display = "none"; }
            };
            productSections.forEach(section => filterSection(section, '.product-card', 'h2'));
            if (kontakSection) { filterSection(kontakSection, '.info-card', '.info-card'); }
        });
    }

    // --- 7. KODE FUNGSI HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const searchContainerNav = document.querySelector('.search-container-nav');

    if (hamburger && navLinksContainer && searchContainerNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            searchContainerNav.classList.toggle('active');
            if (!navLinksContainer.classList.contains('active')) {
                 closeAllDropdowns();
                 document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL *** Hapus noscroll jika hamburger ditutup
            } else {
                 // Jika hamburger dibuka DAN dropdown katalog aktif, tambahkan noscroll
                 if (dropdownWrapper && dropdownWrapper.classList.contains('active')) {
                     document.body.classList.add('noscroll'); // *** TAMBAHAN NOSCROLL ***
                 }
            }
        });
    }

    // --- 8. KODE FUNGSI DROPDOWN KATALOG (Update Noscroll) ---
    const catalogToggle = document.getElementById('catalog-toggle');
    const catalogMenu = document.getElementById('catalog-menu');
    const dropdownWrapper = catalogToggle ? catalogToggle.closest('.dropdown') : null;
    const categoryToggles = document.querySelectorAll('.category-toggle');

    const closeAllCategoryDropdowns = (exceptThisCategory = null) => {
        categoryToggles.forEach(toggle => {
            const category = toggle.closest('.dropdown-category');
            if (category !== exceptThisCategory) {
                category.classList.remove('active');
            }
        });
    };

     const closeMainDropdown = () => {
         if (dropdownWrapper && catalogMenu) {
             dropdownWrapper.classList.remove('active');
             document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL *** Hapus noscroll saat dropdown utama ditutup
         }
     };

     const closeAllDropdowns = () => {
         closeMainDropdown();
         closeAllCategoryDropdowns();
     };


    if (catalogToggle && catalogMenu && dropdownWrapper) {
        catalogToggle.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target === catalogToggle || e.target.closest('#catalog-toggle')) { // Periksa klik pada A atau tombol itu sendiri
                 e.preventDefault();
            }

            const isActive = dropdownWrapper.classList.toggle('active');
            if (!isActive) {
                 closeAllCategoryDropdowns();
                 document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL ***
            } else {
                 document.body.classList.add('noscroll'); // *** TAMBAHAN NOSCROLL *** Tambah noscroll saat dropdown dibuka
            }
        });

        categoryToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const parentCategory = toggle.closest('.dropdown-category');
                const wasActive = parentCategory.classList.contains('active');
                closeAllCategoryDropdowns(parentCategory);
                if (!wasActive) {
                    parentCategory.classList.add('active');
                }
                 // Set timeout agar scrollbar muncul setelah animasi expand selesai
                 setTimeout(() => {
                     // Jika menu dropdown terlalu panjang setelah expand, pastikan scrollbar terlihat
                     if (catalogMenu.scrollHeight > catalogMenu.clientHeight) {
                         // Tidak perlu aksi khusus, overflow:auto sudah menangani
                     }
                 }, 400); // Sesuaikan durasi dengan transisi max-height
            });
        });

        const productLinksInDropdown = catalogMenu.querySelectorAll('.category-links a');
        productLinksInDropdown.forEach(link => {
            link.addEventListener('click', () => {
                 closeAllDropdowns(); // Otomatis menutup dropdown
                 document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL *** Hapus noscroll
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (dropdownWrapper && !dropdownWrapper.contains(e.target) && hamburger && !hamburger.contains(e.target) && !e.target.closest('.hamburger-menu')) {
             closeAllDropdowns();
             document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL *** Hapus noscroll
        }
    });


    // --- 9. KODE FUNGSI SMOOTH SCROLL (Untuk SEMUA Link #) ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    let navHeight = 0;
    if (navbar) { navHeight = navbar.offsetHeight; }

    scrollLinks.forEach(link => {
        if (link.id !== 'catalog-toggle') { // Jangan ganggu toggle utama
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

                // Tutup menu hamburger di HP setelah link diklik
                if (navLinksContainer && hamburger && searchContainerNav && navLinksContainer.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                    searchContainerNav.classList.remove('active');
                     closeAllDropdowns();
                     document.body.classList.remove('noscroll'); // *** TAMBAHAN NOSCROLL ***
                }
            });
        }
    });

}); // Akhir DOMContentLoaded