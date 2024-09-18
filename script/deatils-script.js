document.addEventListener("DOMContentLoaded", function () {
    const showImage = document.getElementById('showImage');
    const showTitle = document.getElementById('showTitle');
    const showGenre = document.getElementById('showGenre');
    const showDescription = document.getElementById('showDescription');
    const showCast = document.getElementById('showCast');

    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const showId = getQueryParameter('id');

    if (showId) {
        $.ajax({
            url: `https://api.tvmaze.com/shows/${showId}`,
            method: 'GET',
            success: function (data) {
                showTitle.textContent = data.name;
                showGenre.textContent = data.genres.length ? data.genres.join(', ') : 'No genre';
                showDescription.innerHTML = data.summary ? data.summary.replace(/<[^>]*>/g, '') : 'No description available';
                showCast.textContent = 'Cast information not available';
                showImage.src = data.image ? data.image.original : '../icons/default.jpg';
            },
            error: function (xhr, status, error) {
                console.error('Error fetching show details:', error);
                showTitle.textContent = 'Show not found';
                showGenre.textContent = '';
                showDescription.textContent = 'No description available';
                showCast.textContent = '';
                showImage.src = '../icons/default.jpg';
            }
        });
    } else {
        showTitle.textContent = 'Show not found';
        showGenre.textContent = '';
        showDescription.textContent = 'No description available';
        showCast.textContent = '';
        showImage.src = '../icons/default.jpg';
    }
});
