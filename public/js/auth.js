const mockUser = {
    id: '12345',
    username: 'AnimeFan123',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png'
};

document.getElementById('loginBtn').addEventListener('click', () => {
    console.log('Redirecting to Discord OAuth...');
    
    document.getElementById('loginBtn').classList.add('hidden');
    
    const userProfile = document.getElementById('userProfile');
    userProfile.classList.remove('hidden');
    
    document.getElementById('userAvatar').src = mockUser.avatar;
    document.getElementById('username').textContent = mockUser.username;
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('userProfile').classList.add('hidden');
    document.getElementById('loginBtn').classList.remove('hidden');
});
