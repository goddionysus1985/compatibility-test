document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const manNameInput = document.getElementById('man-name');
    const manAgeInput = document.getElementById('man-age');
    const manPhotoInput = document.getElementById('man-photo');
    const womanNameInput = document.getElementById('woman-name');
    const womanAgeInput = document.getElementById('woman-age');
    const womanPhotoInput = document.getElementById('woman-photo');
    const compatibilityInput = document.getElementById('compatibility-pct');
    
    // Displays & Bars
    const pctDisplay = document.getElementById('pct-display');
    const imgMan = document.getElementById('img-man');
    const imgWoman = document.getElementById('img-woman');
    const labelMan = document.getElementById('label-man');
    const labelWoman = document.getElementById('label-woman');
    const barManComp = document.querySelector('#bar-man .compatibility');
    const barWomanComp = document.querySelector('#bar-woman .compatibility');

    // Indicators
    const indMan = document.getElementById('ind-man');
    const indWoman = document.getElementById('ind-woman');

    // Theme Switcher Logic
    const themeBtns = document.querySelectorAll('.theme-btn');
    let currentTheme = localStorage.getItem('theme') || 'midnight';

    function setTheme(theme) {
        document.body.className = ''; // Reset
        if (theme !== 'midnight') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        localStorage.setItem('theme', theme);
        setTimeout(updateBars, 50); // Small delay to let CSS variables update
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setTheme(btn.dataset.theme);
        });
    });

    // Handle initial state
    setTheme(currentTheme);

    function updateBars() {
        let percentage = parseFloat(compatibilityInput.value) || 0;
        if (percentage < 90) {
            percentage = Math.round(percentage);
            compatibilityInput.value = percentage;
        }
        const manName = manNameInput.value || 'Man';
        const manAge = manAgeInput.value || '0';
        const manPhoto = manPhotoInput.value.trim();
        const womanName = womanNameInput.value || 'Woman';
        const womanAge = womanAgeInput.value || '0';
        const womanPhoto = womanPhotoInput.value.trim();

        // Calculate dynamic color based on theme
        let hueEnd = 120; // Emerald (Midnight)
        
        if (document.body.classList.contains('theme-slate')) { hueEnd = 240; } // Indigo
        if (document.body.classList.contains('theme-vibrant')) { hueEnd = 340; } // Rose

        const hue = Math.floor((percentage / 100) * hueEnd);
        const color = `hsl(${hue}, 80%, 45%)`;
        const colorGlow = `hsl(${hue}, 80%, 45%, 0.4)`;

        const displayPercentage = percentage >= 90 ? percentage.toFixed(1) : percentage;

        // Update Text
        if (pctDisplay) {
            pctDisplay.textContent = `${displayPercentage}%`;
            pctDisplay.style.color = color;
            if (percentage > 50) {
                pctDisplay.style.textShadow = `0 0 20px ${colorGlow}`;
            } else {
                pctDisplay.style.textShadow = `none`;
            }
        }

        if (labelMan) labelMan.textContent = `${manName}, ${manAge}`;
        if (labelWoman) labelWoman.textContent = `${womanName}, ${womanAge}`;
        
        if (imgMan) {
            if (manPhoto) {
                imgMan.src = manPhoto;
                imgMan.style.display = 'block';
            } else {
                imgMan.style.display = 'none';
                imgMan.src = '';
            }
        }
        
        if (imgWoman) {
            if (womanPhoto) {
                imgWoman.src = womanPhoto;
                imgWoman.style.display = 'block';
            } else {
                imgWoman.style.display = 'none';
                imgWoman.src = '';
            }
        }

        // Update Bars
        if (barManComp) {
            barManComp.style.height = `${percentage}%`;
            barManComp.style.background = color;
        }
        if (barWomanComp) {
            barWomanComp.style.height = `${percentage}%`;
            barWomanComp.style.background = color;
        }

        // Update Indicators
        if (indMan) {
            indMan.textContent = `${displayPercentage}%`;
            indMan.style.bottom = `${percentage}%`;
            indMan.style.background = color;
        }
        if (indWoman) {
            indWoman.textContent = `${displayPercentage}%`;
            indWoman.style.bottom = `${percentage}%`;
            indWoman.style.background = color;
        }
    }

    // Event Listeners
    [manNameInput, manAgeInput, manPhotoInput, womanNameInput, womanAgeInput, womanPhotoInput, compatibilityInput].forEach(input => {
        if (input) input.addEventListener('input', updateBars);
    });

    // ==========================================
    // HEART COLLAGE LOGIC
    // ==========================================

    // Collage DOM Selectors
    const btnOpenCollage = document.getElementById('btn-open-collage');
    const btnCloseCollage = document.getElementById('btn-close-collage');
    const collageOverlay = document.getElementById('collage-overlay');
    const collageParticlesContainer = document.getElementById('collage-particles-container');
    const btnExportCollage = document.getElementById('btn-export-collage');

    // Controls
    const collageManNameInput = document.getElementById('collage-man-name');
    const collageManAgeInput = document.getElementById('collage-man-age');
    const collageManPhotoInput = document.getElementById('collage-man-photo');
    const collageWomanNameInput = document.getElementById('collage-woman-name');
    const collageWomanAgeInput = document.getElementById('collage-woman-age');
    const collageWomanPhotoInput = document.getElementById('collage-woman-photo');
    const collageCompatibilityPctInput = document.getElementById('collage-compatibility-pct');
    
    // File inputs
    const fileManPhoto = document.getElementById('file-man-photo');
    const fileWomanPhoto = document.getElementById('file-woman-photo');

    // Frames
    const frameManCollage = document.getElementById('frame-man-collage');
    const frameWomanCollage = document.getElementById('frame-woman-collage');

    // Display Elements
    const collageRenderCard = document.getElementById('collage-render-card');
    const displayImgMan = document.getElementById('display-img-man');
    const displayImgWoman = document.getElementById('display-img-woman');
    const displayNameMan = document.getElementById('display-name-man');
    const displayAgeMan = document.getElementById('display-age-man');
    const displayNameWoman = document.getElementById('display-name-woman');
    const displayAgeWoman = document.getElementById('display-age-woman');
    
    const glowBtns = document.querySelectorAll('.glow-btn');

    let particleInterval = null;
    let localManPhotoSrc = '';
    let localWomanPhotoSrc = '';

    // Initialize Collage Card Theme Class
    let currentCollageTheme = 'rose';
    if (collageRenderCard) {
        collageRenderCard.className = 'collage-card glow-rose';
    }

    // Toggle Collage View
    if (btnOpenCollage) {
        btnOpenCollage.addEventListener('click', () => {
            if (collageOverlay) {
                collageOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop page scrolling
                
                // Sync data from main page
                syncDataFromMain();
                
                // Start background floating hearts particle system
                startParticles();
                
                // Trigger an initial burst of hearts in the overlay
                for (let i = 0; i < 15; i++) {
                    setTimeout(() => spawnParticle(), i * 150);
                }
                
                // Staggered merging hearts stream from avatars to the center badge on launch!
                setTimeout(() => {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            if (frameManCollage) launchMergingHeart(frameManCollage);
                        }, i * 250);
                        setTimeout(() => {
                            if (frameWomanCollage) launchMergingHeart(frameWomanCollage);
                        }, i * 250 + 120);
                    }
                }, 400);
            }
        });
    }

    if (btnCloseCollage) {
        btnCloseCollage.addEventListener('click', () => {
            if (collageOverlay) {
                collageOverlay.style.display = 'none';
                document.body.style.overflow = ''; // Restore page scrolling
                
                // Stop particle system to conserve resources
                stopParticles();
            }
        });
    }

    // Sync input values from the main form to the collage customization overlay
    function syncDataFromMain() {
        const percentage = compatibilityInput ? compatibilityInput.value : 0;
        const manName = manNameInput ? manNameInput.value.trim() : '';
        const manAge = manAgeInput ? manAgeInput.value : '';
        const manPhoto = manPhotoInput ? manPhotoInput.value.trim() : '';
        const womanName = womanNameInput ? womanNameInput.value.trim() : '';
        const womanAge = womanAgeInput ? womanAgeInput.value : '';
        const womanPhoto = womanPhotoInput ? womanPhotoInput.value.trim() : '';

        // Update Customizer form fields
        if (collageManNameInput) collageManNameInput.value = manName || 'Mike';
        if (collageManAgeInput) collageManAgeInput.value = manAge || '28';
        if (collageManPhotoInput) collageManPhotoInput.value = manPhoto === 'Local Uploaded File' ? '' : manPhoto;
        if (collageWomanNameInput) collageWomanNameInput.value = womanName || 'Inna';
        if (collageWomanAgeInput) collageWomanAgeInput.value = womanAge || '25';
        if (collageWomanPhotoInput) collageWomanPhotoInput.value = womanPhoto === 'Local Uploaded File' ? '' : womanPhoto;
        if (collageCompatibilityPctInput) collageCompatibilityPctInput.value = percentage;
        
        // Handle images (prioritize local uploaded files if they exist, else use URL inputs)
        updateCollageManPhoto(localManPhotoSrc || manPhoto);
        updateCollageWomanPhoto(localWomanPhotoSrc || womanPhoto);

        // Run live preview updates to draw text inside card
        updateCollagePreviewText();

        // Dynamically match glow theme with main app theme initially
        let matchedTheme = 'rose';
        if (document.body.classList.contains('theme-slate')) { matchedTheme = 'sapphire'; }
        else if (document.body.classList.contains('theme-vibrant')) { matchedTheme = 'rose'; }
        else { matchedTheme = 'emerald'; } // midnight

        setCollageTheme(matchedTheme);
    }

    // Set collage color theme presets
    function setCollageTheme(color) {
        if (!collageRenderCard) return;
        collageRenderCard.className = `collage-card glow-${color}`;
        currentCollageTheme = color;
        
        // Active preset class selector
        glowBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === color);
        });
    }

    glowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setCollageTheme(btn.dataset.color);
            // Spawn some colored splash hearts
            spawnHeartBurst(btn, 6);
        });
    });

    // Helper functions for photo displays
    function updateCollageManPhoto(src) {
        const placeholder = frameManCollage ? frameManCollage.querySelector('.heart-placeholder') : null;
        if (displayImgMan) {
            if (src) {
                displayImgMan.src = src;
                displayImgMan.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            } else {
                displayImgMan.style.display = 'none';
                displayImgMan.src = '';
                if (placeholder) placeholder.style.display = 'flex';
            }
        }
    }

    // Live sync uploads/inputs back to the main form
    function syncToMainForm() {
        if (manNameInput && collageManNameInput) manNameInput.value = collageManNameInput.value;
        if (manAgeInput && collageManAgeInput) manAgeInput.value = collageManAgeInput.value;
        if (womanNameInput && collageWomanNameInput) womanNameInput.value = collageWomanNameInput.value;
        if (womanAgeInput && collageWomanAgeInput) womanAgeInput.value = collageWomanAgeInput.value;
        
        // Sync URL text values back to the main form inputs
        if (manPhotoInput && collageManPhotoInput) {
            manPhotoInput.value = collageManPhotoInput.value.trim();
        }
        if (womanPhotoInput && collageWomanPhotoInput) {
            womanPhotoInput.value = collageWomanPhotoInput.value.trim();
        }

        // Trigger update to update bars
        updateBars();
    }

    function updateCollageWomanPhoto(src) {
        const placeholder = frameWomanCollage ? frameWomanCollage.querySelector('.heart-placeholder') : null;
        if (displayImgWoman) {
            if (src) {
                displayImgWoman.src = src;
                displayImgWoman.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            } else {
                displayImgWoman.style.display = 'none';
                displayImgWoman.src = '';
                if (placeholder) placeholder.style.display = 'flex';
            }
        }
    }

    // Live update preview text
    function updateCollagePreviewText() {
        if (displayNameMan && collageManNameInput) {
            displayNameMan.textContent = collageManNameInput.value || 'Man';
        }
        if (displayAgeMan && collageManAgeInput) {
            const ageVal = collageManAgeInput.value;
            displayAgeMan.textContent = ageVal ? `Age ${ageVal}` : '';
        }

        if (displayNameWoman && collageWomanNameInput) {
            displayNameWoman.textContent = collageWomanNameInput.value || 'Woman';
        }
        if (displayAgeWoman && collageWomanAgeInput) {
            const ageVal = collageWomanAgeInput.value;
            displayAgeWoman.textContent = ageVal ? `Age ${ageVal}` : '';
        }

        // Keep main form inputs synced live
        syncToMainForm();
    }

    // Live customization listeners
    [collageManNameInput, collageManAgeInput, collageWomanNameInput, collageWomanAgeInput].forEach(input => {
        if (input) input.addEventListener('input', updateCollagePreviewText);
    });

    if (collageManPhotoInput) {
        collageManPhotoInput.addEventListener('input', () => {
            localManPhotoSrc = ''; // Clear local file to prioritize the link URL
            updateCollageManPhoto(collageManPhotoInput.value.trim());
            syncToMainForm();
        });
    }

    if (collageWomanPhotoInput) {
        collageWomanPhotoInput.addEventListener('input', () => {
            localWomanPhotoSrc = ''; // Clear local file to prioritize the link URL
            updateCollageWomanPhoto(collageWomanPhotoInput.value.trim());
            syncToMainForm();
        });
    }

    // Range slider live syncing & merging hearts stream
    let alternateMergeSide = true;
    let lastLaunchTime = 0;
    if (collageCompatibilityPctInput) {
        collageCompatibilityPctInput.addEventListener('input', () => {
            let val = parseFloat(collageCompatibilityPctInput.value);
            if (val < 90) {
                val = Math.round(val);
                collageCompatibilityPctInput.value = val;
            }
            
            // Sync to main form
            if (compatibilityInput) {
                compatibilityInput.value = val;
            }
            
            // Update main page bars
            updateBars();
            
            // Launch a heart flying to the center from alternate sides with throttle
            if (val > 0) {
                const now = Date.now();
                if (now - lastLaunchTime > 60) {
                    if (alternateMergeSide && frameManCollage) {
                        launchMergingHeart(frameManCollage);
                    } else if (!alternateMergeSide && frameWomanCollage) {
                        launchMergingHeart(frameWomanCollage);
                    }
                    alternateMergeSide = !alternateMergeSide;
                    lastLaunchTime = now;
                }
            }
        });
    }

    // File selection triggers (Clicking heart frames triggers file selectors)
    if (frameManCollage && fileManPhoto) {
        frameManCollage.addEventListener('click', () => fileManPhoto.click());
    }
    if (frameWomanCollage && fileWomanPhoto) {
        frameWomanCollage.addEventListener('click', () => fileWomanPhoto.click());
    }

    // File upload reader handles
    if (fileManPhoto) {
        fileManPhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    localManPhotoSrc = event.target.result;
                    updateCollageManPhoto(localManPhotoSrc);
                    // Sync back to main form if desired!
                    if (manPhotoInput) manPhotoInput.value = 'Local Uploaded File';
                    if (collageManPhotoInput) collageManPhotoInput.value = '';
                    if (imgMan) {
                        imgMan.src = localManPhotoSrc;
                        imgMan.style.display = 'block';
                    }
                    // Trigger dynamic heart burst inside the uploaded frame
                    spawnHeartBurst(frameManCollage, 12);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (fileWomanPhoto) {
        fileWomanPhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    localWomanPhotoSrc = event.target.result;
                    updateCollageWomanPhoto(localWomanPhotoSrc);
                    // Sync back to main form
                    if (womanPhotoInput) womanPhotoInput.value = 'Local Uploaded File';
                    if (collageWomanPhotoInput) collageWomanPhotoInput.value = '';
                    if (imgWoman) {
                        imgWoman.src = localWomanPhotoSrc;
                        imgWoman.style.display = 'block';
                    }
                    // Trigger dynamic heart burst inside the uploaded frame
                    spawnHeartBurst(frameWomanCollage, 12);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Interactive Hover & Click bursts for the photo frames
    if (frameManCollage) {
        frameManCollage.addEventListener('mouseenter', () => spawnHeartBurst(frameManCollage, 4));
        frameManCollage.addEventListener('click', () => spawnHeartBurst(frameManCollage, 8));
    }
    if (frameWomanCollage) {
        frameWomanCollage.addEventListener('mouseenter', () => spawnHeartBurst(frameWomanCollage, 4));
        frameWomanCollage.addEventListener('click', () => spawnHeartBurst(frameWomanCollage, 8));
    }

    // PARTICLE ENGINE (Floating rising hearts)
    const HEART_CHARACTERS = ['♥', '💖', '💕', '💙', '💜', '💚', '💛', '💗', '💓'];
    const COLLAGE_THEME_COLORS = {
        rose: ['#fda4af', '#f43f5e', '#ec4899', '#f472b6'],
        amethyst: ['#d8b4fe', '#a855f7', '#c084fc', '#e9d5ff'],
        emerald: ['#6ee7b7', '#10b981', '#34d399', '#a7f3d0'],
        sapphire: ['#93c5fd', '#3b82f6', '#60a5fa', '#bfdbfe']
    };

    function startParticles() {
        stopParticles(); // Reset
        particleInterval = setInterval(spawnParticle, 400);
    }

    function stopParticles() {
        if (particleInterval) {
            clearInterval(particleInterval);
            particleInterval = null;
        }
        if (collageParticlesContainer) {
            collageParticlesContainer.innerHTML = '';
        }
    }

    function spawnParticle(xPercent = null, yPercent = null, customSize = null, customVel = null) {
        if (!collageParticlesContainer) return;

        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        
        // Randomize character
        particle.textContent = HEART_CHARACTERS[Math.floor(Math.random() * HEART_CHARACTERS.length)];
        
        // Positioning
        const x = xPercent !== null ? xPercent : Math.random() * 100;
        particle.style.left = `${x}%`;
        
        if (yPercent !== null) {
            particle.style.bottom = `${yPercent}%`;
        }

        // Color theme matching
        const colors = COLLAGE_THEME_COLORS[currentCollageTheme] || COLLAGE_THEME_COLORS.rose;
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Sizing
        const size = customSize !== null ? customSize : (12 + Math.random() * 24);
        particle.style.fontSize = `${size}px`;
        
        // Random slight skew / rotate
        particle.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        
        // Dynamic opacity
        particle.style.opacity = (0.2 + Math.random() * 0.5).toString();

        // Speed/Duration of floatUp
        const duration = customVel !== null ? customVel : (6 + Math.random() * 6);
        particle.style.animationDuration = `${duration}s`;

        collageParticlesContainer.appendChild(particle);

        // Remove element after animation completes to keep DOM extremely light
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }

    // Heart splash burst
    function spawnHeartBurst(element, count = 8) {
        if (!collageParticlesContainer || !element) return;
        
        const rect = element.getBoundingClientRect();
        const containerRect = collageParticlesContainer.getBoundingClientRect();
        
        // Calculate relative coordinates in percentage
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        
        const xPercent = ((elCenterX - containerRect.left) / containerRect.width) * 100;
        const yPercent = 100 - (((elCenterY - containerRect.top) / containerRect.height) * 100);

        for (let i = 0; i < count; i++) {
            const size = 10 + Math.random() * 15;
            const duration = 2 + Math.random() * 3; // Float up fast
            // Introduce a little spread on X axis
            const spreadX = xPercent + (Math.random() * 16 - 8);
            
            spawnParticle(spreadX, yPercent, size, duration);
        }
    }

    // Save/Print collage canvas handler
    if (btnExportCollage) {
        btnExportCollage.addEventListener('click', () => {
            window.print();
        });
    }

    // Center badge fusion splash
    function triggerCenterBadgeSplash() {
        const centerElement = document.querySelector('.central-glow-heart');
        if (!centerElement || !collageParticlesContainer) return;
        
        const rect = centerElement.getBoundingClientRect();
        const containerRect = collageParticlesContainer.getBoundingClientRect();
        const xPercent = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const yPercent = 100 - (((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100);
        
        // Pulse central badge scale slightly
        centerElement.classList.add('pulse-active');
        centerElement.style.transform = 'scale(1.25) rotate(8deg)';
        setTimeout(() => {
            centerElement.style.transform = '';
            centerElement.classList.remove('pulse-active');
        }, 180);

        // Spawn a splash of tiny sparkles from center
        for (let i = 0; i < 5; i++) {
            const size = 8 + Math.random() * 8;
            const duration = 1 + Math.random() * 1.5;
            const spreadX = xPercent + (Math.random() * 10 - 5);
            spawnParticle(spreadX, yPercent, size, duration);
        }
    }

    // Launch hearts flying from avatars and merging in center badge
    const MERGE_HEART_CHARACTERS = ['💖', '💕', '❤️', '💝', '💗', '💓'];
    function launchMergingHeart(fromElement) {
        if (!collageParticlesContainer || !fromElement) return;
        
        const fromRect = fromElement.getBoundingClientRect();
        const centerElement = document.querySelector('.central-glow-heart');
        if (!centerElement) return;
        const centerRect = centerElement.getBoundingClientRect();
        const containerRect = collageParticlesContainer.getBoundingClientRect();

        // Spawn coordinate relative to container
        const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
        
        // Target coordinate relative to container
        const targetX = centerRect.left + centerRect.width / 2 - containerRect.left;
        const targetY = centerRect.top + centerRect.height / 2 - containerRect.top;

        // Create particle element
        const heart = document.createElement('div');
        heart.className = 'merging-heart-particle';
        heart.textContent = MERGE_HEART_CHARACTERS[Math.floor(Math.random() * MERGE_HEART_CHARACTERS.length)];
        
        // Theme color matching
        const colors = COLLAGE_THEME_COLORS[currentCollageTheme] || COLLAGE_THEME_COLORS.rose;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = 16 + Math.random() * 10;
        heart.style.fontSize = `${size}px`;

        // Center starting position exactly by subtracting size/2
        heart.style.left = `${startX - size / 2}px`;
        heart.style.top = `${startY - size / 2}px`;
        
        collageParticlesContainer.appendChild(heart);

        // Set trajectory offset variables for keyframe
        heart.style.setProperty('--target-x', `${targetX - startX}px`);
        heart.style.setProperty('--target-y', `${targetY - startY}px`);
        
        // Calculate dynamic parabolic curves (curving upwards by 45px to 90px)
        const curveX = (Math.random() * 40 - 20);
        const curveY = - (45 + Math.random() * 45);
        heart.style.setProperty('--curve-x', `${curveX}px`);
        heart.style.setProperty('--curve-y', `${curveY}px`);
        
        // Animate
        heart.style.animation = 'mergeToCenter 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards';

        // Destroy and splash on completion
        setTimeout(() => {
            if (heart && heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
            triggerCenterBadgeSplash();
        }, 750);
     }

    // Safety first
    updateBars();
});
