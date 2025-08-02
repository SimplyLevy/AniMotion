async function checkAuth() {
    const response = await fetch('/api/user');
    const user = await response.json();

    if (user.id) {
        showUserProfile(user);
    } else {
        document.getElementById('loginBtn').classList.remove('hidden');
    }
}

function showUserProfile(user) {
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const username = document.getElementById('username');

    userAvatar.src = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    username.textContent = user.username;
    userProfile.classList.remove('hidden');
    document.getElementById('loginBtn').classList.add('hidden');
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/logout', { method: 'GET' });
    window.location.reload();
});

checkAuth();
