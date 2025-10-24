// Menampilkan pesan di konsol browser untuk memastikan file JS terhubung
console.log("Selamat Datang di Website FHARYSH STORE!");

// ===========================================
// FUNGSI UTAMA (dijalankan saat Halaman Siap)
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Sembunyikan preloader setelah halaman selesai dimuat sepenuhnya
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
        // Pengaman: Sembunyikan juga setelah beberapa detik jika 'load' lambat
        setTimeout(() => {
             preloader.classList.add('hidden');
        }, 1500); // 1.5 detik
    }

    // --- 2. INISIALISASI AOS (ANIMASI SCROLL) ---
    AOS.init({
        duration: 800, // Durasi animasi (ms)
        once: true,    // Animasi hanya terjadi sekali saat scroll ke bawah
        offset: 50     // Jarak trigger animasi (px) sebelum elemen terlihat
    });

    // --- 3. INISIALISASI TYPED.JS (EFEK KETIK) ---
    const typedTarget = document.querySelector('.typed-text');
    if (typedTarget) {
        const typed = new Typed('.typed-text', {
            strings: ['Hiburan.', 'Kreativitas.', 'Produktivitas.'], // Kata-kata yang akan diketik
            typeSpeed: 70,  // Kecepatan ketik
            backSpeed: 50,  // Kecepatan hapus
            backDelay: 1500,// Jeda sebelum menghapus
            loop: true      // Mengulang terus
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
        // Smooth scroll saat tombol diklik (tanpa # di URL)
        backToTopButton.addEventListener('click', (e) => {
             e.preventDefault(); // Mencegah link '#' default
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 6. KODE FUNGSI PENCARIAN (SEARCH BAR) ---
    const searchBar = document.getElementById('search-bar');
    if (searchBar) { 
        const productSections = document.querySelectorAll('.product-section');
        const infoSection = document.getElementById('info-tambahan');

        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Loop section produk (Kode sama seperti sebelumnya)
            productSections.forEach(section => {
                let matchFoundInSection = false; 
                const products = section.querySelectorAll('.product-card');
                products.forEach(card => {
                    const title = card.querySelector('h2').textContent.toLowerCase();
                    if (title.includes(searchTerm)) {
                        card.style.display = "flex";
                        matchFoundInSection = true;
                    } else { card.style.display = "none"; }
                });
                if (matchFoundInSection || searchTerm === "") { section.style.display = ""; } 
                else { section.style.display = "none"; }
            });
            // Loop section info (Kode sama seperti sebelumnya)
             if (infoSection) {
                 let infoMatchFound = false;
                 const infoCards = infoSection.querySelectorAll('.info-card');
                 infoCards.forEach(card => {
                     const infoText = card.textContent.toLowerCase();
                     if (infoText.includes(searchTerm)) { card.style.display = ""; infoMatchFound = true; } 
                     else { card.style.display = "none"; }
                 });
                 if (infoMatchFound || searchTerm === "") { infoSection.style.display = ""; } 
                 else { infoSection.style.display = "none"; }
             }
        });
    }

    // --- 7. KODE FUNGSI HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active'); 
            navLinksContainer.classList.toggle('active');
        });
    }

    // --- 8. KODE FUNGSI SMOOTH SCROLL UNTUK LINK NAVBAR ---
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    let navHeight = 0;
    if (navbar) {
        navHeight = navbar.offsetHeight; 
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Penyesuaian: Jika link #hero, scroll ke paling atas
            if (targetId === '#hero') {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                 const targetElement = document.querySelector(targetId);
                 if (targetElement) {
                     // Recalculate navHeight here in case it changed due to shrink
                     if (navbar) { navHeight = navbar.offsetHeight; } 
                     const targetPosition = targetElement.offsetTop - navHeight - 15; 
                     window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                 }
            }

            // Otomatis tutup menu di HP setelah link diklik
            if (navLinksContainer && hamburger && navLinksContainer.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    });

}); // Akhir dari document.addEventListener('DOMContentLoaded')