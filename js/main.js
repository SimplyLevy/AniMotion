document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', function() {
        window.location.reload();
    });

    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            alert('Searching for: ' + this.value);
        }
    });
});
