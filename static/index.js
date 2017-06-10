$("document").ready(function() {
    var audio = document.querySelector("#htmlAudioPlayer");
    var progressBar = document.querySelector('.progressBar');
    var songs = document.querySelector(".songs");
    var songsArray = [];
    var currentSongIndex= 0;
    var started = false;

    $.ajax({
        url: "/songs",
        dataType: "json",
        success: function(data) {
            listFile(data);
        }
    });

    function listFile(data) {
        data.songs.forEach(function(song, index) {
            songsArray.push(song.name);
            var i = index + 1;
            $(".songs").append("<div key='"+ index +"' class='song'>" + i + '. ' + song.name + "</div>");
        });
    }

    function togglePlay() {
        if (!started) {
            started = true;
            updatePlayer();
            $("#playPause span").attr("class", "fa fa-pause");
            audio.play();
        } else if(audio.paused) {
            audio.play();
            $("#playPause span").attr("class", "fa fa-pause");
        } else {
            audio.pause();
            $("#playPause span").attr("class", "fa fa-play");
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
        if (currentSongIndex == 0) {
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

        var percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + "%";
    }


    function updatePlayer() {
        var nth = currentSongIndex + 1;

        $("#htmlAudioPlayer").attr("src", "/songs/" + songsArray[currentSongIndex]);
        $(".song").removeClass("selected");
        $(".songName").text(songsArray[currentSongIndex]);
        $(".songs div:nth-child(" + nth + ")").addClass("selected");
    }

    function nextSong() {
        progressBar.style.width = 0;
        increaseIndex();
        updatePlayer();
    }

    function previousSong() {
        decreaseIndex();
        updatePlayer();
    }

    function skipForward() {
        audio.currentTime += 10;
    }

    function skipBackward() {
        audio.currentTime -= 5;
    }

    function handleKeypress(e) {
        switch (e.which) {
            case 32:
                // key space
                e.preventDefault()
                togglePlay();
                return false;
            case 37:
                // key left
                e.preventDefault()
                skipBackward();
                break;
            case 38:
                // key up
                e.preventDefault()
                previousSong();
                break;
            case 39:
                // key right
                e.preventDefault()
                skipForward();
                break;
            case 40:
                // key down
                e.preventDefault()
                nextSong();
                break;
        }
    }

    $('#playPause').click(function(){
        togglePlay();
    })
    $("#skipForward").click(skipForward)
    $("#skipBackward").click(skipBackward)
    $("#next").click(nextSong);
    $("#previous").click(previousSong);

    $(document).on("click", "div.song", function() {
        var index = $(this).attr("key");
        currentSongIndex = index;
        
        updatePlayer();
        togglePlay();
    });

    audio.addEventListener("timeupdate", handleProgress);
    window.addEventListener("keydown", handleKeypress);
});

