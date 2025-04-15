document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.example.com/data';
    fetchData(apiUrl).then(data => {
        const content = document.getElementById('content');
        content.innerHTML = JSON.stringify(data, null, 2);
    });
});
