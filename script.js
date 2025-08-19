function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    // Ensure two-digit format using padStart
    // return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    // console.log(songs);
    return songs;
}

let currentSong = new Audio();
const playMusic =(track, pause=false)=>{
    // let audio = new Audio("/songs/" + track);
    // audio.play();
    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();
        play.src = "svg/pause-button.svg";
    }

    document.querySelector(".song-info").innerHTML = decodeURI(track);
    document.querySelector(".song-time").innerHTML = "00:00/00:00";
}

async function main() {
    let songs = await getsongs();
    // console.log(songs);
    playMusic(songs[0], true);

    // let audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration);
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });

    let songUL = document.querySelector(".small-slide").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><div class="leftt">
                            <img src="svg/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harsh Rajora</div>
                            </div>
                        </div>
                        <div class="rightt">
                            <span>Play Now</span>
                            <img src="svg/music-play.svg" alt="play">
                        </div></li>`;
    }

    Array.from(document.querySelector(".small-slide").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
        // console.log(e);
    });

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "svg/pause-button.svg";
        }
        else{
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${formatTime(Math.floor(currentSong.currentTime))}/${formatTime(Math.floor(currentSong.duration))}`;
        document.querySelector(".circlo").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circlo").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    });
}

main();