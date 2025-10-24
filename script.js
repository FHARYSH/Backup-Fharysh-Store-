// ===========================================
// FUNGSI UTAMA (dijalankan saat Halaman Siap)
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
        setTimeout(() => { preloader.classList.add('hidden'); }, 1500);
    }

    // --- 2. INISIALISASI AOS (ANIMASI SCROLL - LOOPING) ---
    AOS.init({
        duration: 800, 
        once: false, // *** INI KUNCINYA AGAR LOOPING ***
        offset: 80 // Offset sedikit lebih besar agar lebih sensitif
    });

    // --- 3. INISIALISASI TYPED.JS (EFEK KETIK) ---
    const typedTarget = document.querySelector('.typed-text');
    if (typedTarget) {
        const typed = new Typed('.typed-text', {
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
        // Define sections *outside* the event listener if they don't change
        const productSections = document.querySelectorAll('.product-section');
        const infoSection = document.getElementById('kontak'); // Ganti ID jika berubah

        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // Function to filter cards within a section
            const filterSection = (section, cardSelector, titleSelector) => {
                let matchFoundInSection = false; 
                const cards = section.querySelectorAll(cardSelector);
                cards.forEach(card => {
                    const titleElement = card.querySelector(titleSelector);
                    if (titleElement) {
                        const title = titleElement.textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            // Use 'flex' for product cards, default for info cards
                            card.style.display = (cardSelector === '.product-card') ? "flex" : ""; 
                            matchFoundInSection = true;
                        } else { card.style.display = "none"; }
                    } else {
                        // Handle cases where titleSelector might not match (optional)
                         console.warn("Title element not found for selector:", titleSelector, "in card:", card);
                         card.style.display = "none"; 
                    }
                });
                // Show/hide the entire section
                if (matchFoundInSection || searchTerm === "") { section.style.display = ""; } 
                else { section.style.display = "none"; }
            };

            // Filter product sections
            productSections.forEach(section => filterSection(section, '.product-card', 'h2'));
            
            // Filter info section
            if (infoSection) { filterSection(infoSection, '.info-card', '.info-card'); /* Title is the card itself */ }
        });
    }


    // --- 7. KODE FUNGSI HAMBURGER MENU (Update u/ Search Box) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const searchContainerNav = document.querySelector('.search-container-nav'); // Ambil search container

    if (hamburger && navLinksContainer && searchContainerNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active'); 
            navLinksContainer.classList.toggle('active');
            searchContainerNav.classList.toggle('active'); // Togel search box juga
        });
    }

    // --- 8. KODE FUNGSI SMOOTH SCROLL (Update u/ Product List) ---
    // Gabungkan link navbar dan link product list
    const scrollLinks = document.querySelectorAll('.nav-links a[href^="#"], #product-quick-list a[href^="#"]'); 
    let navHeight = 0;
    if (navbar) { navHeight = navbar.offsetHeight; }

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Cek jika targetId valid dan bukan hanya '#'
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                 if (targetElement) {
                      // Recalculate navHeight here in case it changed due to shrink or load
                     if (navbar) { navHeight = navbar.offsetHeight; } 
                     const targetPosition = targetElement.offsetTop - navHeight - 15; // Offset
                     window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                 } else {
                     console.warn("Target element not found for:", targetId); // Debugging
                 }
            } else if (targetId === '#hero' || targetId === '#') { // Link Home/#
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Otomatis tutup menu di HP setelah link diklik (jika menu terbuka)
            if (navLinksContainer && hamburger && searchContainerNav && navLinksContainer.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
                searchContainerNav.classList.remove('active');
            }
        });
    });

}); // Akhir dari document.addEventListener('DOMContentLoaded')
