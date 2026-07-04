document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');
    const overlayBackdrop = document.getElementById('overlayBackdrop');

    if (menuToggle && mobileNav && mobileClose && overlayBackdrop) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
            overlayBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMobile = () => {
            mobileNav.classList.remove('open');
            overlayBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileClose.addEventListener('click', closeMobile);
        overlayBackdrop.addEventListener('click', closeMobile);

        // Close mobile nav when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobile);
        });
    }

    // 2. Sticky Header Scroll Effect
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Hero Carousel Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }

    // 4. Statistics Count-up Animation
    const stats = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    const startStatsAnimation = () => {
        stats.forEach(stat => {
            const targetStr = stat.getAttribute('data-target');
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            const target = parseFloat(targetStr);
            let count = 0;
            const duration = 2000; // 2 seconds
            const stepTime = 30;
            const stepValue = target / (duration / stepTime);

            const timer = setInterval(() => {
                count += stepValue;
                if (count >= target) {
                    clearInterval(timer);
                    stat.innerHTML = prefix + target + suffix;
                } else {
                    stat.innerHTML = prefix + Math.floor(count) + suffix;
                }
            }, stepTime);
        });
    };

    const handleStatsScroll = () => {
        const statsBanner = document.querySelector('.stats-banner');
        if (statsBanner && !statsAnimated) {
            const rect = statsBanner.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
                statsAnimated = true;
                startStatsAnimation();
            }
        }
    };

    if (stats.length > 0) {
        window.addEventListener('scroll', handleStatsScroll);
        // Trigger check on load
        handleStatsScroll();
    }

    // 5. Barter Value Calculator
    const calcArea = document.getElementById('calcArea');
    const calcRate = document.getElementById('calcRate');
    const calcAsset = document.getElementById('calcAsset');
    
    const resProjectVal = document.getElementById('resProjectVal');
    const resSavingsVal = document.getElementById('resSavingsVal');
    const resBarterUnits = document.getElementById('resBarterUnits');
    
    const breakdownProjectVal = document.getElementById('breakdownProjectVal');
    const breakdownOutflow = document.getElementById('breakdownOutflow');
    const breakdownRate = document.getElementById('breakdownRate');

    if (calcArea && calcRate && calcAsset) {
        const calculateBarter = () => {
            const area = parseFloat(calcArea.value) || 0;
            const rate = parseFloat(calcRate.value) || 0;
            const assetType = calcAsset.value;

            // Total construction cost = area * construction rate (e.g. ₹2,200 per sq ft for RCC + finishing)
            const totalProjectCost = area * rate;
            
            // Barter savings (builders save around 35%-40% liquid cash flow requirement by paying in units)
            const cashFlowSaved = totalProjectCost * 0.40; 
            
            // Estimated value of flats required to pay for project
            // Assuming average flat size and rate in Mumbai/Pune
            let avgUnitValue = 12000000; // Default ₹1.2 Cr per flat
            if (assetType === 'commercial') {
                avgUnitValue = 18000000; // ₹1.8 Cr per commercial unit
            } else if (assetType === 'villa') {
                avgUnitValue = 25000000; // ₹2.5 Cr per luxury villa
            }

            // Number of units builders need to allocate (rounded up)
            const unitsRequired = Math.ceil(totalProjectCost / avgUnitValue) || 0;

            // Update DOM with Indian Numbering Format
            const formatCurrency = (val) => {
                if (val >= 10000000) { // Crores
                    return '₹' + (val / 10000000).toFixed(2) + ' Cr';
                } else if (val >= 100000) { // Lakhs
                    return '₹' + (val / 100000).toFixed(2) + ' L';
                }
                return '₹' + val.toLocaleString('en-IN');
            };

            if (resProjectVal) resProjectVal.innerText = formatCurrency(totalProjectCost);
            if (resSavingsVal) resSavingsVal.innerText = formatCurrency(cashFlowSaved);
            if (resBarterUnits) resBarterUnits.innerText = unitsRequired + ' ' + (unitsRequired === 1 ? 'Unit' : 'Units');

            // Update breakdown rows
            if (breakdownProjectVal) breakdownProjectVal.innerText = formatCurrency(totalProjectCost);
            if (breakdownOutflow) breakdownOutflow.innerText = formatCurrency(totalProjectCost - cashFlowSaved);
            if (breakdownRate) breakdownRate.innerText = '₹' + rate.toLocaleString('en-IN') + '/sq.ft';
        };

        // Event listeners
        calcArea.addEventListener('input', calculateBarter);
        calcRate.addEventListener('input', calculateBarter);
        calcAsset.addEventListener('change', calculateBarter);

        // Initial run
        calculateBarter();
    }

    // 6. Contact and Newsletter Form Submit Simulation
    const contactForm = document.getElementById('barterContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('formName').value.trim();
            const company = document.getElementById('formCompany').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const service = document.getElementById('formService').value;
            const budget = document.getElementById('formBudget').value;
            const barterAsset = document.getElementById('formAsset').value;
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !phone || !email || !service || !barterAsset) {
                alert('Please fill in all mandatory fields.');
                return;
            }

            // Simple Success Dialog
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Submitting Enquiry...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert(`Thank you ${name}! Your barter proposal for ${company || 'your project'} has been received. Our executive will reach out to you within 24 hours.`);
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                if (typeof calculateBarter === 'function') calculateBarter();
            }, 1500);
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();

            if (!email) {
                alert('Please enter a valid email address.');
                return;
            }

            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Subscribed!';
            btn.disabled = true;

            setTimeout(() => {
                alert(`Successfully subscribed ${email} to Barter Constructions Newsletter.`);
                emailInput.value = '';
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }

    // 7. FAQ Accordion Handler
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(el => {
                    el.classList.remove('active');
                    const answer = el.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                });

                // Open clicked item if not active
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        }
    });
});
