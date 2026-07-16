/* ============ BLOG: fetch from dev.to public API ============ */
const DEVTO_API = 'https://dev.to/api/articles';
const TAGS = ['webdev', 'security', 'javascript', 'python', 'career', 'ai'];

let currentTag = 'webdev';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)} yr ago`;
}

function articleCard(article) {
  const cover = article.cover_image
    ? `<img class="cover" src="${article.cover_image}" alt="" loading="lazy">`
    : `<div class="cover-fallback">$ no_cover_image.jpg</div>`;

  const tags = (article.tag_list || []).slice(0, 3)
    .map(t => `<span>#${t}</span>`).join('');

  const author = article.user || {};
  const avatar = author.profile_image_90 || author.profile_image || '';

  return `
    <a class="blog-card reveal" href="${article.url}" target="_blank" rel="noopener">
      ${cover}
      <div class="blog-body">
        <div class="blog-tags">${tags}</div>
        <h3>${escapeHtml(article.title)}</h3>
        <p class="excerpt">${escapeHtml(article.description || '')}</p>
        <div class="blog-meta">
          <div class="author">
            ${avatar ? `<img src="${avatar}" alt="">` : ''}
            <span>${escapeHtml(author.name || 'Unknown')}</span>
          </div>
          <span>${timeAgo(article.published_at)}</span>
        </div>
      </div>
    </a>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

async function loadArticles(tag) {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="blog-state">
      Fetching latest #${tag} articles from dev.to
      <span class="dots"><span></span><span></span><span></span></span>
    </div>`;

  try {
    const res = await fetch(`${DEVTO_API}?tag=${encodeURIComponent(tag)}&per_page=9`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    if (!data.length) {
      grid.innerHTML = `<div class="blog-state">No articles found for #${tag}. Try another tag.</div>`;
      return;
    }

    grid.innerHTML = data.map(articleCard).join('');
    // (re)observe reveal animations for the freshly injected cards
    grid.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
      // trigger immediately since they're already in view after a tag switch
      requestAnimationFrame(() => el.classList.add('in-view'));
    });
  } catch (err) {
    grid.innerHTML = `
      <div class="blog-state">
        Couldn't reach dev.to right now — this can happen if the API is
        temporarily unavailable or blocked by your network.
        <br><br>
        <button class="retry-btn" onclick="loadArticles('${tag}')">Retry →</button>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  loadArticles(currentTag);

  document.querySelectorAll('.filter-btn[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-tag]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTag = btn.dataset.tag;
      loadArticles(currentTag);
    });
  });
});