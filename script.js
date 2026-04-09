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
        const womanName = womanNameInput.value || 'Woman';
        const womanAge = womanAgeInput.value || '0';

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
    [manNameInput, manAgeInput, womanNameInput, womanAgeInput, compatibilityInput].forEach(input => {
        if (input) input.addEventListener('input', updateBars);
    });

    // Safety first
    updateBars();
});
