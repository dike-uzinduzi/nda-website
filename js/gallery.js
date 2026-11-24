/* gallery.js - gallery.html (static images p1.jpg ... p90.jpg, infinite scroll + lightbox) */
document.addEventListener("DOMContentLoaded", function () {
    var galleryGrid = document.getElementById("galleryGrid");
    var loadingSpinner = document.getElementById("loadingSpinner");
    var images = [];

    for (var i = 1; i <= 90; i++) {
        images.push({ src: "images/p" + i + ".jpg", caption: "" });
    }

    var currentIndex = 0;
    var loadedCount = 0;
    var batchSize = 24;
    var isBatchLoading = false;

    function loadBatch() {
        if (!galleryGrid || isBatchLoading || loadedCount >= images.length) return;
        isBatchLoading = true;
        if (loadingSpinner) loadingSpinner.style.display = "block";

        setTimeout(function () {
            var end = Math.min(loadedCount + batchSize, images.length);
            for (var i = loadedCount; i < end; i++) {
                var col = document.createElement("div");
                col.className = "col-6 col-md-3 mb-4";
                col.innerHTML =
                    '<div class="gallery-thumb" style="cursor:pointer; overflow:hidden; border-radius:8px; height:220px; background:#eaeaea; box-shadow:0 4px 10px rgba(0,0,0,0.05);">' +
                    '<img src="' + images[i].src + '" class="gallery-img" alt="Gallery Image ' + (i + 1) + '" loading="lazy" data-index="' + i + '"' +
                    ' style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s;"' +
                    ' onerror="this.parentElement.parentElement.style.display=\'none\';"></div>';
                galleryGrid.appendChild(col);
            }
            loadedCount = end;
            attachImageEvents();
            if (loadingSpinner) loadingSpinner.style.display = "none";
            isBatchLoading = false;

            /* If missing images left the page too short to scroll, keep loading */
            setTimeout(maybeLoadMore, 400);
        }, 300);
    }

    function maybeLoadMore() {
        if (loadedCount < images.length && !isBatchLoading &&
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 250) {
            loadBatch();
        }
    }

    function attachImageEvents() {
        document.querySelectorAll(".gallery-img").forEach(function (img) {
            img.onclick = function () {
                currentIndex = parseInt(this.dataset.index, 10);
                updateModalContent();
                var el = document.getElementById("galleryModal");
                if (el) bootstrap.Modal.getOrCreateInstance(el).show();
            };
        });
    }

    function updateModalContent() {
        var item = images[currentIndex];
        document.getElementById("modalImage").src = item.src;
        document.getElementById("modalCaption").textContent = item.caption || "";
        document.getElementById("fbShare").href =
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(window.location.origin + "/" + item.src);
    }

    loadBatch();
    window.addEventListener("scroll", maybeLoadMore);

    document.querySelector(".modal-prev").addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateModalContent();
    });
    document.querySelector(".modal-next").addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        updateModalContent();
    });
});
