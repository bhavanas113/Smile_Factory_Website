// 1. ORIGINAL: Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// 2. ORIGINAL + UPDATED: Change navbar background and Smart Scroll logic
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (window.scrollY > 50) {
        if (window.innerWidth <= 768) {
            nav.style.padding = '8px 5%';
        } else {
            nav.style.padding = '12px 10%';
        }
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        if (window.innerWidth <= 768) {
            nav.style.padding = '15px 5%';
        } else {
            nav.style.padding = '20px 10%';
        }
        nav.style.boxShadow = 'none';
        nav.style.background = 'transparent'; 
    }

    nav.style.transform = 'translateY(0)'; 
    lastScroll = currentScroll;
});

// 3. ORIGINAL: Smooth Scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 4. ADVANCED: 3D Mouse Tilt Effect for Service Cards
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
    });
});

// 5. ADVANCED: Page Load Reveal
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        setTimeout(() => {
            hero.style.transition = 'all 1.2s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 300);
    }
});

// 6. ADVANCED: Form Success Animation
const btnNav = document.querySelector('.btn-nav');
if (btnNav) {
    btnNav.addEventListener('mousedown', () => { btnNav.style.transform = 'scale(0.95)'; });
    btnNav.addEventListener('mouseup', () => { btnNav.style.transform = 'scale(1)'; });
}

// 7. ADVANCED: Image Parallax for Gallery
const galleryItems = document.querySelectorAll('.gallery-item img');
window.addEventListener('scroll', () => {
    galleryItems.forEach(img => {
        const speed = 0.05;
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yOffset = (window.innerHeight - rect.top) * speed;
            img.style.transform = `scale(1.1) translateY(${yOffset}px)`;
        }
    });
});

// 8. ADVANCED: Dynamic Greeting
const checkStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isOpen = (day >= 1 && day <= 6) && (hour >= 10 && hour < 20);
    console.log(isOpen ? "Dr. Siddhi's Clinic is currently OPEN" : "Dr. Siddhi's Clinic is currently CLOSED");
};
checkStatus();

// 9. MOBILE: Toggle Navigation Drawer
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });
}

// 10. MOBILE: Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle) menuToggle.classList.remove('is-active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// 11. MOBILE: Highlight Bottom Nav active item on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    let current = "";
    sections.forEach(section => {
        if (window.pageYOffset >= (section.offsetTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(item => {
        item.style.color = '#041e42';
        if (item.getAttribute('href') === `#${current}`) {
            item.style.color = '#007bff';
        }
        if (item.classList.contains('call-hub')) { item.style.color = 'white'; }
    });
});

// 12. Fix small font issue
const adjustForMobileText = () => {
    if (window.innerWidth <= 480) {
        document.body.style.webkitTextSizeAdjust = "100%";
        const mainHeading = document.querySelector('.hero-content h1');
        if (mainHeading) { mainHeading.style.fontSize = "2.8rem"; }
    }
};
window.addEventListener('resize', adjustForMobileText);
window.addEventListener('DOMContentLoaded', adjustForMobileText);

// 13. UPDATED: Video Modal Controller (With Orange Back Icon & Verified Links)
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const backBtn = document.getElementById("backToServices");

// Verified Medical Animations IDs
const serviceVideos = {
    "Root Canal": "https://www.youtube.com/embed/jH_P-W_I-nI",
    "Extraction": "https://www.youtube.com/embed/1onTAb3K_M4",
    "Scaling": "https://www.youtube.com/embed/fSStm_4G_nQ",
    "Braces": "https://www.youtube.com/embed/f9M_y8uYypo",
    "Teeth Whitening": "https://www.youtube.com/embed/BvS9p8u7Iio",
    "Dental Implants": "https://www.youtube.com/embed/7SInW6FvHTo"
};

function openVideo(url) {
    if(videoModal && videoFrame) {
        videoModal.style.display = "block";
        const origin = window.location.origin;
        const separator = url.includes('?') ? '&' : '?';
        // Enhanced URL for privacy and autoplay
        const finalUrl = `${url}${separator}autoplay=1&rel=0&modestbranding=1&origin=${origin}`;
        videoFrame.src = finalUrl;
        document.body.style.overflow = "hidden";
    }
}

// Link Service Cards to Videos
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const serviceTitle = card.querySelector('h3').innerText.trim();
        const videoUrl = serviceVideos[serviceTitle];
        if (videoUrl) {
            openVideo(videoUrl);
        }
    });
});

// BACK ICON LOGIC: Closing the modal and stopping playback
if (backBtn) {
    backBtn.addEventListener('click', () => {
        videoModal.style.display = "none";
        videoFrame.src = ""; 
        document.body.style.overflow = "auto";
    });
}

// 14. Modal Control Functions (Appointments)
const openAppointmentModal = () => {
    const overlay = document.getElementById('appointmentModalOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

const closeAppointmentModal = () => {
    const overlay = document.getElementById('appointmentModalOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// ==================================================
// 15. DATABASE PROCESSOR (Node.js + MySQL Integration)
// ==================================================

async function processBooking(event, data, statusElement, isModal = false) {
    event.preventDefault();
    statusElement.innerText = "Processing your appointment...";
    statusElement.style.color = "#041e42";

    // Standard port for Node.js backend
    const API_URL = 'http://localhost:5000/api/book';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            statusElement.innerText = "✅ Appointment Confirmed! Check WhatsApp.";
            statusElement.style.color = "green";
            
            event.target.reset();
            if(isModal) {
                setTimeout(closeAppointmentModal, 3000);
            }
        } else {
            statusElement.innerText = "❌ Oops: " + (result.message || "Failed to link.");
            statusElement.style.color = "red";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        statusElement.innerText = "❌ Connection Failed. Check if Node server is running.";
        statusElement.style.color = "red";
    }
}

// Footer Form Listener
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        const data = {
            name: document.getElementById('cust_name').value,
            phone: document.getElementById('cust_phone').value,
            service: document.getElementById('requested_service').value,
            date: document.getElementById('appointment_date').value
        };
        processBooking(e, data, document.getElementById('formStatus'));
    });
}

// Modal Form Listener
const modalBookingForm = document.getElementById('modalBookingForm');
if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
        const data = {
            name: document.getElementById('modal_cust_name').value,
            phone: document.getElementById('modal_cust_phone').value,
            service: document.getElementById('modal_requested_service').value,
            date: document.getElementById('modal_appointment_date').value
        };
        processBooking(e, data, document.getElementById('modalFormStatus'), true);
    });
}