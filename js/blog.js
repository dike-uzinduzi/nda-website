/* blog.js - blog.html (list) and blog_view.html (single article), driven by NDA.posts in data.js */
(function () {
    var NDA = window.NDA || {};
    var esc = window.ndaEsc;
    var posts = (NDA.posts || []).slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

    function plain(html) {
        var d = document.createElement("div");
        d.innerHTML = html || "";
        return d.textContent || "";
    }

    /* ---------- Blog list ---------- */
    var list = document.getElementById("blogGrid");
    if (list) {
        if (!posts.length) {
            list.innerHTML = '<div class="col-12 text-center py-5"><div class="p-5 bg-white rounded shadow-sm mx-auto" style="max-width:600px;">' +
                '<i class="fas fa-feather-alt fa-3x text-muted mb-3"></i><h5>No Articles Available</h5>' +
                '<p class="text-muted">We are busy drafting exciting updates and resource articles. Stay tuned for our upcoming field guides!</p></div></div>';
        } else {
            list.innerHTML = posts.map(function (p) {
                var url = "blog_view.html?slug=" + encodeURIComponent(p.slug);
                var img = p.image || "images/services-hero.jpg";
                var text = plain(p.summary || p.content);
                if (text.length > 130) text = text.slice(0, 127) + "...";
                return '<div class="col-md-4"><article class="card blog-card">' +
                    '<div class="blog-img-container"><a href="' + url + '"><img src="' + esc(img) + '" alt="' + esc(p.title) + '"></a></div>' +
                    '<div class="card-body d-flex flex-column p-4"><div class="d-flex gap-3 text-muted small mb-2">' +
                    '<span><i class="fas fa-calendar-alt blog-icon-meta"></i>' + esc(window.ndaFormatDate(p.date)) + '</span>' +
                    (p.author ? '<span><i class="fas fa-user blog-icon-meta"></i>' + esc(p.author) + '</span>' : '') + '</div>' +
                    '<h5 class="card-title font-weight-bold mb-3"><a href="' + url + '" class="text-dark text-decoration-none">' + esc(p.title) + '</a></h5>' +
                    '<p class="card-text text-secondary mb-4">' + esc(text) + '</p>' +
                    '<div class="mt-auto pt-2"><a href="' + url + '" class="btn btn-nda-link">Read Full Article <i class="fas fa-arrow-right ms-1"></i></a></div>' +
                    '</div></article></div>';
            }).join("");
        }
    }

    /* ---------- Single article ---------- */
    var box = document.getElementById("article");
    if (box) {
        var slug = new URLSearchParams(window.location.search).get("slug");
        var post = posts.filter(function (p) { return p.slug === slug; })[0];
        var heroTitle = document.getElementById("heroTitle");

        if (!post) {
            document.title = "Article Not Found - New Dimensions Adventures";
            box.innerHTML = '<div class="text-center py-5 bg-white rounded shadow-sm p-5"><i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>' +
                '<h3>Article Not Found</h3><p class="text-muted">The requested article could not be retrieved. It may have been moved or removed.</p>' +
                '<a href="blog.html" class="btn btn-back-to-blog mt-3"><i class="fas fa-arrow-left me-2"></i> View Available Blogs</a></div>';
        } else {
            document.title = post.title + " - New Dimensions Adventures";
            if (heroTitle) heroTitle.textContent = post.title;
            if (post.image) document.getElementById("hero").style.backgroundImage = "url('" + post.image.replace(/'/g, "%27") + "')";
            var shareUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(post.title + " - " + window.location.href);

            box.innerHTML = '<article class="article-container">' +
                (post.image ? '<img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" class="article-hero-img shadow-sm">' : '') +
                '<div class="d-flex flex-wrap gap-4 text-muted small mb-4 pb-3 border-bottom">' +
                '<span><i class="fas fa-calendar-alt blog-icon-meta"></i>Published: <strong>' + esc(window.ndaFormatDate(post.date, true)) + '</strong></span>' +
                (post.author ? '<span><i class="fas fa-user blog-icon-meta"></i>By: <strong>' + esc(post.author) + '</strong></span>' : '') + '</div>' +
                '<div class="article-body-text mb-5">' + post.content + '</div>' +
                '<div class="pt-4 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">' +
                '<a href="blog.html" class="btn btn-back-to-blog"><i class="fas fa-arrow-left me-2"></i> Back to Articles</a>' +
                '<a href="' + shareUrl + '" target="_blank" rel="noopener" class="btn btn-share-wa"><i class="fab fa-whatsapp me-2"></i> Share Article</a></div></article>';

            /* Image lightbox */
            var modalEl = document.getElementById("imageLightboxModal");
            var modalImg = document.getElementById("lightboxImage");
            box.querySelectorAll(".article-hero-img, .article-body-text img").forEach(function (img) {
                img.addEventListener("click", function () {
                    modalImg.src = this.getAttribute("src");
                    bootstrap.Modal.getOrCreateInstance(modalEl).show();
                });
            });
        }
    }
})();
