var currentPlayingAudioPlayer = null;
var isAudioPlaying = false;

function playVideoFromAvailableMediaList(eventInfo) {
    var listView = document.querySelector("#videoListView").winControl;

    if (listView.selection.getIndices().length == 0) {
        return;
    }

    try {

        var playerContainer = document.getElementById('playerContainer');

        hideAllMediaPlayers(playerContainer);

        // getIndices()
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh872197.aspx
        var selectedVideoParentFolderID = SkyDriveVideos.itemList.getItem(listView.selection.getIndices()[0]).data.parent_id;
        var selectedVideoStaticUrl = SkyDriveVideos.itemList.getItem(listView.selection.getIndices()[0]).data.link;

        var videoPlayer = document.getElementById(selectedVideoStaticUrl);
        if (videoPlayer != null) {
            mediaPlayerPlay(videoPlayer, false);
        }

        var audioPlayer = document.getElementById(selectedVideoStaticUrl);
        if (audioPlayer != null) {
            mediaPlayerPlay(audioPlayer, true);
        }

        if (videoPlayer == null && audioPlayer == null) {
            getMediaSourceUrlByVideoStaticUrl(selectedVideoParentFolderID, selectedVideoStaticUrl);
        }

    } catch (error) {
        showMessage("Error getting audio / video to play", error.message);
    }
}

function hideAllMediaPlayers(playerContainer) {
    for (var i = 0; i < playerContainer.childElementCount; i++) {

        if (playerContainer.children[i].style.display != 'none') {
            playerContainer.children[i].style.display = 'none';
            playerContainer.children[i].pause();
        }
    }
}

function mediaPlayerPlay(mediaPlayer, isBackgroundAudioAllowed) {
    mediaPlayer.loop = getPlayerLoopValue();
    mediaPlayer.style.display = '';
    mediaPlayer.play();

    if (isBackgroundAudioAllowed) {
        var mediaControls = Windows.Media.MediaControl;

        mediaControls.addEventListener("playpausetogglepressed", playPauseBackgroundAudio, false);
        mediaControls.addEventListener("playpressed", playBackgroundAudio, false);
        mediaControls.addEventListener("pausepressed", pauseBackgroundAudio, false);
        mediaControls.addEventListener("stoppressed", stopBackgroundAudio, false);

        currentPlayingAudioPlayer = mediaPlayer;
        isAudioPlaying = true;
    }
}

function getPlayerLoopValue() {
    if (document.getElementById('msgVideoLoop').innerText.length > 0) {
        return "loop";
    }

    return "";
}

function playNewMedia(videoStaticUrl, videoUrl, videoName) {

    var playerContainer = document.getElementById('playerContainer');

    if (stringEndWith(videoName, ".mp4")) {

        var videoPlayer = document.getElementById(videoStaticUrl);
        if (videoPlayer == null) {

            videoPlayer = document.createElement('video');
            videoPlayer.id = videoStaticUrl;
            videoPlayer.controls = "controls";

            var videoSource = document.createElement('source');

            videoSource.src = videoUrl;
            videoSource.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

            videoPlayer.appendChild(videoSource);

            playerContainer.appendChild(videoPlayer);
        }

        mediaPlayerPlay(videoPlayer, false);

        currentPlayingAudioPlayer = null;
        isAudioPlaying = false;

    } else if (stringEndWith(videoName, ".mp3")) {

        var audioPlayer = document.getElementById(videoStaticUrl);
        if (audioPlayer == null) {
            audioPlayer = document.createElement('audio');
            audioPlayer.id = videoStaticUrl;
            audioPlayer.msAudioCategory = "BackgroundCapableMedia";
            audioPlayer.controls = "controls";

            audioPlayer.addEventListener('playing', function () { isAudioPlaying = true; });
            audioPlayer.addEventListener('pause', function () { isAudioPlaying = false; });
            audioPlayer.addEventListener('ended', function () { isAudioPlaying = false; });

            var audioSource = document.createElement('source');

            audioSource.src = videoUrl;
            audioSource.type = 'audio/mpeg';

            audioPlayer.appendChild(audioSource);

            playerContainer.appendChild(audioPlayer);
        }
        
        mediaPlayerPlay(audioPlayer, true);
    }
}

function playBackgroundAudio() {
    if (currentPlayingAudioPlayer != null) {
        currentPlayingAudioPlayer.play();
    }
}

function pauseBackgroundAudio() {
    if (currentPlayingAudioPlayer != null) {
        currentPlayingAudioPlayer.pause();
    }
}

function playPauseBackgroundAudio() {
    if (currentPlayingAudioPlayer != null) {
        if (isAudioPlaying) {
            currentPlayingAudioPlayer.pause();
        } else {
            currentPlayingAudioPlayer.play();
        }
    }
}

function stopBackgroundAudio() {
    if (currentPlayingAudioPlayer != null) {
        currentPlayingAudioPlayer.pause();
    }
}