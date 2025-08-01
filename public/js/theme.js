document.addEventListener('DOMContentLoaded', () => {
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    lightThemeBtn.addEventListener('click', () => setTheme('light'));
    darkThemeBtn.addEventListener('click', () => setTheme('dark'));
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    
    lightThemeBtn.classList.toggle('active', theme === 'light');
    darkThemeBtn.classList.toggle('active', theme === 'dark');
}
