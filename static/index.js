$('document').ready(function() {
    var audio = document.querySelector('#htmlAudioPlayer');
    var progressBar = document.querySelector('.progressBar');
    var search = document.querySelector('.search');
    var songsArray = [];
    var searchResultsArray = [];
    var currentSongIndex = 0;
    var started = false;
    var initialHeight = window.innerHeight;

    $.ajax({
        url: '/songs',
        dataType: 'json',
        success: function(data) {
            listFile(data);
        }
    });

    function listFile(data) {
        data.songs.forEach(function(song, index) {
            songsArray.push(song.name);
            var i = index + 1;
            $('.songs').append(
                `<div key="${index}" class="song">${i}. ${song.name}"</div>`
            );
        });
    }

    function togglePlay() {
        if (!started) {
            started = true;
            updatePlayer();
            $('#playPause span').attr('class', 'fa fa-pause');
            audio.play();
        } else if (audio.paused) {
            audio.play();
            $('#playPause span').attr('class', 'fa fa-pause');
        } else {
            audio.pause();
            $('#playPause span').attr('class', 'fa fa-play');
        }
    }

    function increaseIndex() {
        if (currentSongIndex < songsArray.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }
    }

    function decreaseIndex() {
        if (currentSongIndex === 0) {
            currentSongIndex = songsArray.length - 1;
        } else {
            currentSongIndex--;
        }
    }

    function handleProgress() {
        if (audio.currentTime === audio.duration) {
            nextSong();
            return;
        }

        var percent = audio.currentTime / audio.duration * 100;
        progressBar.style.width = percent + '%';
    }

    // update song name and play the song
    function updatePlayer() {
        var nth = currentSongIndex + 1;

        $('.song').removeClass('selected');
        $('.songName').text(songsArray[currentSongIndex]);
        $('.songs div:nth-child(' + nth + ')').addClass('selected');
        $('#htmlAudioPlayer').attr(
            'src',
            '/songs/' + songsArray[currentSongIndex]
        );
    }

    function nextSong() {
        progressBar.style.width = 0;
        increaseIndex();
        updatePlayer();
        togglePlay();
    }

    function previousSong() {
        progressBar.style.width = 0;
        decreaseIndex();
        updatePlayer();
        togglePlay();
    }

    function skipForward() {
        audio.currentTime += 10;
    }

    function skipBackward() {
        audio.currentTime -= 5;
    }

    function handleKeypress(e) {
        // keys will only be used as control keys
        // when the search box is not in focus
        if (!$('.search').is(':focus')) {
            switch (e.which) {
                case 32:
                    // key space
                    e.preventDefault();
                    togglePlay();
                    break;
                case 37:
                    // key left
                    e.preventDefault();
                    skipBackward();
                    break;
                case 38:
                    // key up
                    e.preventDefault();
                    previousSong();
                    break;
                case 39:
                    // key right
                    e.preventDefault();
                    skipForward();
                    break;
                case 40:
                    // key down
                    e.preventDefault();
                    nextSong();
                    break;
            }
        }
    }

    function handleSearch() {
        searchString = search.value.trim().toLowerCase();
        searchResultsArray = [];
        $('.searchResults').empty();
        if (searchString !== '' && searchString.length > 2) {
            for (var songIndex in songsArray) {
                var song = songsArray[songIndex];
                if (song.toLowerCase().includes(searchString)) {
                    searchResultsArray.push({
                        name: song,
                        index: songIndex
                    });
                }
            }
        }

        searchResultsArray = searchResultsArray.slice(0, 5);
        searchResultsArray.forEach(function(song) {
            let result = `<div key=${song.index} class="searchResult">${song.name}</div>`;
            $('.searchResults').append(result);
        });
    }

    function handleSongClick() {
        var index = $(this).attr('key');
        currentSongIndex = index;

        updatePlayer();
        togglePlay();

        // clear search results
        if (searchResultsArray.length !== 0) {
            search.value = '';
            $('.searchResults').empty();
        }
    }

    function handleResize() {
        var currentHeight = window.innerHeight;
        var diff = initialHeight - currentHeight;
        var absDiff = Math.abs(diff);
        if (absDiff > 100) {
            $('.player').toggle();
            initialHeight = currentHeight;
        }
    }


    $('#playPause').click(togglePlay);
    $('#skipForward').click(skipForward);
    $('#skipBackward').click(skipBackward);
    $('#next').click(nextSong);
    $('#previous').click(previousSong);
    $(document).on('click', 'div.song', handleSongClick);
    $(document).on('click', 'div.searchResult', handleSongClick);

    audio.addEventListener('timeupdate', handleProgress);
    search.addEventListener('keyup', handleSearch.bind(this));
    window.addEventListener('keydown', handleKeypress);

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.addEventListener('resize', handleResize);
    }
});
