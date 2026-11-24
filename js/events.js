/* events.js - latest_events.html (driven by NDA.events) and latest_gallery.html (driven by NDA.uploads) */
(function () {
    var NDA = window.NDA || {};
    var esc = window.ndaEsc;

    /* ---------- Past events ---------- */
    var grid = document.getElementById("eventsGrid");
    if (grid) {
        var today = new Date();
        var events = (NDA.events || []).filter(function (e) { return new Date(e.date) < today; })
            .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        if (!events.length) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><div class="p-5 bg-white rounded shadow-sm mx-auto" style="max-width:600px;">' +
                '<i class="fas fa-folder-open fa-3x text-muted mb-3"></i><h5>No Past Event Records Found</h5>' +
                '<p class="text-muted">Our event history log is currently being updated by the media team. Check back soon to explore our past projects.</p></div></div>';
        } else {
            grid.innerHTML = events.map(function (e) {
                var d = new Date(e.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
                var desc = e.description || "";
                if (desc.length > 110) desc = desc.slice(0, 107) + "...";
                return '<div class="col-md-4"><div class="card event-card"><div class="event-img-container">' +
                    '<img src="' + esc(e.image || "images/services-hero.jpg") + '" alt="' + esc(e.title) + '">' +
                    '<div class="event-date-badge"><i class="fas fa-history me-1"></i>' + esc(d) + '</div></div>' +
                    '<div class="card-body d-flex flex-column p-4"><h5 class="card-title font-weight-bold mb-2">' + esc(e.title) + '</h5>' +
                    (e.location ? '<p class="text-muted small mb-3"><i class="fas fa-map-marker-alt event-icon-meta"></i>' + esc(e.location) + '</p>' : '') +
                    '<p class="card-text text-secondary mb-4">' + esc(desc) + '</p>' +
                    '<div class="mt-auto"><a href="gallery.html" class="btn btn-nda-outline w-100 text-center">View Event Gallery</a></div></div></div></div>';
            }).join("");
        }
    }

    /* ---------- Latest gallery ---------- */
    var gg = document.getElementById("latestGalleryGrid");
    if (gg) {
        var uploads = NDA.uploads || [];
        if (!uploads.length) {
            gg.innerHTML = '<div class="col-12 text-center py-5"><div class="text-muted py-4"><i class="fas fa-images fa-3x mb-3 text-black-50"></i>' +
                '<h5 class="fw-semibold text-dark">Gallery is Under Assembly</h5>' +
                '<p class="text-muted px-3">No active media assets have been published here yet. Check back soon for updates.</p></div></div>';
        } else {
            gg.innerHTML = uploads.map(function (u) {
                var cap = u.caption || "";
                return '<div class="col-sm-6 col-lg-4"><div class="gallery-item" data-bs-toggle="modal" data-bs-target="#lightboxModal"' +
                    ' data-src="' + esc(u.src) + '" data-caption="' + esc(cap || "Gallery Feature Display") + '">' +
                    '<div class="gallery-img-wrapper"><img src="' + esc(u.src) + '" alt="' + esc(cap || "Portfolio Media View") + '" class="gallery-img" loading="lazy"></div>' +
                    '<div class="gallery-info"><div class="gallery-caption">' + esc(cap || "Untitled Portfolio Entry") + '</div>' +
                    (u.date ? '<div class="gallery-date"><i class="far fa-calendar-alt me-1"></i> ' + esc(window.ndaFormatDate(u.date)) + '</div>' : '') +
                    '</div></div></div>';
            }).join("");
        }

        var modal = document.getElementById("lightboxModal");
        modal.addEventListener("show.bs.modal", function (e) {
            var t = e.relatedTarget;
            document.getElementById("modalLightboxImage").src = t.getAttribute("data-src");
            document.getElementById("modalLightboxCaption").textContent = t.getAttribute("data-caption");
        });
        modal.addEventListener("hide.bs.modal", function () {
            document.getElementById("modalLightboxImage").src = "";
        });
    }
})();
