var tone = 'professional', length = 'medium', currentText = '', history = []

// ── CHIPS ──
document.querySelectorAll('.chip[data-g]').forEach(function (c) {
    c.addEventListener('click', function () {
        var g = c.dataset.g;
        document.querySelectorAll('.chip[data-g="' + g + '"]').forEach(function (x) { x.classList.remove('active'); })
        c.classList.add('active')
        if (g === 'tone') tone = c.dataset.v
        if (g === 'length') length = c.dataset.v
    })
})

// ── CHAR COUNTER ──
document.getElementById('blog-topic').addEventListener('input', function () {
    document.getElementById('tcnt').textContent = this.value.length + ' / 500'
})

// ── TOAST ──
function toast(msg, type) {
    var t = document.createElement('div')
    t.className = 'toast ' + (type || 'info')
    t.textContent = msg;
    document.getElementById('toasts').appendChild(t)
    setTimeout(function () { t.remove(); }, 3500)
}

// ── LOADING ──
function showLoading(title, stepArr) {
    document.getElementById('empty').style.display = 'none'
    document.getElementById('result').style.display = 'none'
    var ldr = document.getElementById('loader')
    ldr.style.display = 'flex';
    document.getElementById('ltitle').textContent = title;
    var sc = document.getElementById('steps')
    sc.innerHTML = stepArr.map(function (s, i) {
        return '<div class="step" id="st' + i + '"><span class="step-icon">○</span>' + s + '</div>'
    }).join('')
    var cur = 0;
    var iv = setInterval(function () {
        if (cur > 0) {
            var prev = document.getElementById('st' + (cur - 1));
            if (prev) { prev.classList.remove('on'); prev.classList.add('done'); prev.querySelector('.step-icon').textContent = '✓' }
        }
        var el = document.getElementById('st' + cur);
        if (el) { el.classList.add('on'); el.querySelector('.step-icon').textContent = '›'; cur++; }
        else { clearInterval(iv); }
    }, 2400)
    return iv
}

function hideLoading(iv) {
    clearInterval(iv);
    document.getElementById('loader').style.display = 'none'
}

// ── RESULT ──
function showResult(topic, content) {
    currentText = content;
    document.getElementById('empty').style.display = 'none'
    document.getElementById('loader').style.display = 'none'
    document.getElementById('result-meta').innerHTML = '<strong>' + topic + '</strong> &mdash; ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    document.getElementById('result-body').innerHTML = renderMD(content)
    document.getElementById('result').style.display = 'block'
}

function clearOut() {
    currentText = '';
    document.getElementById('result').style.display = 'none'
    document.getElementById('empty').style.display = ''
}

// ── COPY ──
function copyOut() {
    navigator.clipboard.writeText(currentText).then(function () { toast('Copied to clipboard', 'ok') })
}

// ── HISTORY ──
function addHistory(topic, content) {
    history.unshift({ topic: topic, content: content, date: new Date().toLocaleDateString() })
    if (history.length > 8) history.pop()
    var card = document.getElementById('history-card')
    var list = document.getElementById('histlist')
    card.style.display = '';
    list.innerHTML = history.map(function (h, i) {
        return '<div class="hist-item" onclick="loadHist(' + i + ')">'
            + '<div class="hist-title">' + h.topic + '</div>'
            + '<div class="hist-date">' + h.date + '</div>'
            + '</div>';
    }).join('')
}

function loadHist(i) {
    var h = history[i]
    showResult(h.topic, h.content)
}

// ── MARKDOWN ──
function renderMD(text) {
    return text
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hublp>])/gm, '<p>')
        .replace(/<p><\/p>/g, '')
}

// ── GENERATE ──
async function generateBlog() {
    var topic = document.getElementById('blog-topic').value.trim();
    if (!topic) { toast('Please enter a topic or repository description', 'err'); return }

    var btn = document.getElementById('btn-generate');
    btn.disabled = true

    var iv = showLoading('Kicking off CrewAI agents…', [
        'Sending task to CrewAI',
        'Technical Analyst reviewing code',
        'DevLog Writer drafting post',
        'Finalizing and saving'
    ])

    try {
        var res = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic, tone: tone, length: length })
        })
        var data = await res.json()
        hideLoading(iv)

        if (data.error) { toast('Error: ' + data.error, 'err'); document.getElementById('empty').style.display = ''; return; }

        showResult(topic, data.blog_post)
        addHistory(topic, data.blog_post)
        toast('Post generated successfully!', 'ok')

    } catch (e) {
        hideLoading(iv);
        toast('Network error: ' + e.message, 'err')
        document.getElementById('empty').style.display = ''
    } finally {
        btn.disabled = false
    }
}