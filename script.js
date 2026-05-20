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
        const percentage = compatibilityInput.value || 0;
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

        // Update Text
        if (pctDisplay) {
            pctDisplay.textContent = `${percentage}%`;
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
            indMan.textContent = `${percentage}%`;
            indMan.style.bottom = `${percentage}%`;
            indMan.style.background = color;
        }
        if (indWoman) {
            indWoman.textContent = `${percentage}%`;
            indWoman.style.bottom = `${percentage}%`;
            indWoman.style.background = color;
        }
    }

    // Event Listeners
    [manNameInput, manAgeInput, manPhotoInput, womanNameInput, womanAgeInput, womanPhotoInput, compatibilityInput].forEach(input => {
        if (input) input.addEventListener('input', updateBars);
    });

    // Safety first
    updateBars();
});
