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

    function updateBars() {
        const percentage = compatibilityInput.value;
        const manName = manNameInput.value || 'Man';
        const manAge = manAgeInput.value || '0';
        const womanName = womanNameInput.value || 'Woman';
        const womanAge = womanAgeInput.value || '0';

        // Calculate Color (Red 0 to Green 120)
        const hue = Math.floor((percentage / 100) * 120);
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
