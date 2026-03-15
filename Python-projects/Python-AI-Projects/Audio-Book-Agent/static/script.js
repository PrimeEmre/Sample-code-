// ── Variables ─────────────────────────────────────────────────
let audio = null        // holds the audio object
let isPlaying = false   // tracks if audio is playing
let audioUrl = null     // holds the audio file URL

// ── File upload handler ───────────────────────────────────────
function onFileSelected(input) {
    if (input.files.length > 0) {                          // fixed: length not lenght
        const f = input.files[0]                           // fixed: files not file
        document.getElementById('file-name').textContent = f.name
        document.getElementById('file-selected').classList.add('visible')
        const base = f.name.replace(/\.[^.]+$/, '')
        if (!document.getElementById('book-title').value) { // fixed: moved .value outside
            document.getElementById('book-title').value = base
        }
    }
}

// ── Status bar ────────────────────────────────────────────────
function showStatus(msg) {
    document.getElementById('status-text').textContent = msg
    document.getElementById('status-bar').classList.add('visible')
}

function hideStatus() {
    document.getElementById('status-bar').classList.remove('visible')
}

// ── Error bar ─────────────────────────────────────────────────
function showError(msg) {
    const bar = document.getElementById('error-bar')
    bar.textContent = msg
    bar.classList.add('visible')
}

function hideError() {
    document.getElementById('error-bar').classList.remove('visible')
}

// ── Main function sends file to Flask and gets audio back ─────
async function generateAudiobook() {
    const fileInput = document.getElementById('file-input')
    const title  = document.getElementById('book-title').value || 'My Audiobook'
    const author = document.getElementById('book-author').value || 'Unknown'
    const voice  = document.getElementById('voice-select').value
    const speed  = document.getElementById('speed').value

    // stop if no file uploaded
    if (!fileInput.files.length) {
        showError('Please upload a PDF or TXT file first.')
        return
    }

    hideError()
    showStatus('Reading and cleaning your file with AI...')
    document.getElementById('generate-btn').disabled = true

    // pack all data into a form to send to Flask
    const formData = new FormData()
    formData.append('file', fileInput.files[0])
    formData.append('title', title)
    formData.append('author', author)
    formData.append('voice', voice)
    formData.append('speed', speed)

    try {
        showStatus('Converting text to speech with Google...')

        // send to Flask backend
        const response = await fetch('/generate_audiobook', {
            method: 'POST',
            body: formData
        })

        // throw error if server returned a problem
        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || 'Something went wrong')
        }

        // convert response to playable audio
        const blob = await response.blob()
        audioUrl   = URL.createObjectURL(blob)
        audio      = new Audio(audioUrl)
        audio.playbackRate = parseFloat(speed)

        // update progress bar as audio plays
        audio.addEventListener('timeupdate', updateProgress)

        // show total duration when audio is loaded
        audio.addEventListener('loadedmetadata', () => {
            document.getElementById('total-time').textContent = formatTime(audio.duration)
        })

        // reset play button when audio finishes
        audio.addEventListener('ended', () => {
            isPlaying = false
            document.getElementById('play-btn').textContent = '▶'
        })

        // update the player UI with book info
        document.getElementById('player-title').textContent = title
        document.getElementById('player-author').textContent = 'by ' + author
        document.getElementById('player-section').classList.add('visible')

        // set download button to save the MP3
        document.getElementById('download-btn').onclick = () => {
            const a  = document.createElement('a')
            a.href   = audioUrl
            a.download = title.replace(/\s+/g, '_') + '.mp3'
            a.click()
        }

        hideStatus()

        // auto play when ready
        audio.play()
        isPlaying = true
        document.getElementById('play-btn').textContent = '⏸'

    } catch (err) {
        hideStatus()
        showError('Error: ' + err.message)
    }

    document.getElementById('generate-btn').disabled = false
}

// ── Play and pause toggle ─────────────────────────────────────
function togglePlay() {
    if (!audio) return
    if (isPlaying) {
        audio.pause()
        document.getElementById('play-btn').textContent = '▶'
    } else {
        audio.play()
        document.getElementById('play-btn').textContent = '⏸'
    }
    isPlaying = !isPlaying
}

// ── Skip backwards 15 seconds ─────────────────────────────────
function skipBack() {
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15)
}

// ── Skip forwards 30 seconds ──────────────────────────────────
function skipForward() {
    if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 30)
}

// ── Update the progress bar as audio plays ───────────────────
function updateProgress() {
    if (!audio || !audio.duration) return
    const pct = (audio.currentTime / audio.duration) * 100
    document.getElementById('progress-fill').style.width = pct + '%'
    document.getElementById('current-time').textContent = formatTime(audio.currentTime)
}

// ── Jump to position when user clicks the progress bar ───────
function seekAudio(e, el) {
    if (!audio) return
    const rect = el.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
}

// ── Convert seconds into minutes and seconds format ──────────
function formatTime(s) {
    if (isNaN(s)) return '0:00'
    const m   = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return m + ':' + (sec < 10 ? '0' : '') + sec
}
