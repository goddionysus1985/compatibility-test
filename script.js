document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const manNameInput = document.getElementById('man-name');
    const manAgeInput = document.getElementById('man-age');
    const womanNameInput = document.getElementById('woman-name');
    const womanAgeInput = document.getElementById('woman-age');
    const compatibilityInput = document.getElementById('compatibility-pct');
    
    // Displays & Bars
    const pctDisplay = document.getElementById('pct-display');
    const labelMan = document.getElementById('label-man');
    const labelWoman = document.getElementById('label-woman');
    const barManComp = document.querySelector('#bar-man .compatibility');
    const barWomanComp = document.querySelector('#bar-woman .compatibility');

    // Indicators
    const indMan = document.getElementById('ind-man');
    const indWoman = document.getElementById('ind-woman');

    // Theme Switcher
    const themeBtns = document.querySelectorAll('.theme-btn');
    let currentTheme = localStorage.getItem('theme') || 'midnight';

    function setTheme(theme) {
        document.body.className = `theme-${theme}`;
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        localStorage.setItem('theme', theme);
        updateBars(); // Refresh colors
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    // Initialize Theme
    setTheme(currentTheme);

    function updateBars() {
        const percentage = compatibilityInput.value;
        const manName = manNameInput.value || 'Man';
        const manAge = manAgeInput.value || '0';
        const womanName = womanNameInput.value || 'Woman';
        const womanAge = womanAgeInput.value || '0';

        // Calculate dynamic color (Red to Green/Accent)
        // Use a mix of Red (0) and the Theme's Accent color
        const themeAccent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        const themeHue = themeAccent.startsWith('hsl') ? parseInt(themeAccent.match(/\d+/)[0]) : 120; // Default to 120 (Green)
        
        // Custom logic for Slate theme (Indigo)
        let hueStart = 0; // Red
        let hueEnd = 120; // Green default
        
        if (document.body.classList.contains('theme-slate')) { hueEnd = 240; } // Indigo
        if (document.body.classList.contains('theme-vibrant')) { hueEnd = 340; } // Rose

        const hue = Math.floor((percentage / 100) * (hueEnd - hueStart) + hueStart);
        const color = `hsl(${hue}, 80%, 45%)`;
        const colorGlow = `hsl(${hue}, 80%, 45%, 0.4)`;

        // Update Text
        pctDisplay.textContent = `${percentage}%`;
        pctDisplay.style.color = color;
        labelMan.textContent = `${manName}, ${manAge}`;
        labelWoman.textContent = `${womanName}, ${womanAge}`;
        indMan.textContent = `${percentage}%`;
        indWoman.textContent = `${percentage}%`;

        // Update Bar Heights & Colors
        barManComp.style.height = `${percentage}%`;
        barManComp.style.background = color;
        barWomanComp.style.height = `${percentage}%`;
        barWomanComp.style.background = color;

        // Update Indicator Positions & Colors
        indMan.style.bottom = `${percentage}%`;
        indMan.style.background = color;
        indWoman.style.bottom = `${percentage}%`;
        indWoman.style.background = color;
        
        // Add glow effect based on dynamic color
        if (percentage > 50) {
            pctDisplay.style.textShadow = `0 0 20px ${colorGlow}`;
        } else {
            pctDisplay.style.textShadow = `none`;
        }
    }

    // Event Listeners
    [manNameInput, manAgeInput, womanNameInput, womanAgeInput, compatibilityInput].forEach(input => {
        input.addEventListener('input', updateBars);
    });

    // Initial Update
    updateBars();
});
