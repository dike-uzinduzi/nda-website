/* main.js - shared behaviour for every page */
(function () {
    var NDA = window.NDA || {};

    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    window.ndaEsc = esc;

    window.ndaFormatDate = function (iso, long) {
        var d = new Date(iso);
        if (isNaN(d)) return "";
        return d.toLocaleDateString("en-US", long
            ? { month: "long", day: "2-digit", year: "numeric" }
            : { month: "short", day: "2-digit", year: "numeric" });
    };

    /* Home page WhatsApp chat modal */
    window.sendWhatsApp = function () {
        var box = document.getElementById("waMessage");
        var msg = box ? box.value.trim() : "";
        if (!msg) msg = "Hi NDA, I would like to inquire about booking an appointment.";
        window.open("https://wa.me/" + NDA.whatsapp + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    };

    document.addEventListener("DOMContentLoaded", function () {
        /* Footer year */
        var y = document.getElementById("year");
        if (y) y.textContent = new Date().getFullYear();

        /* Trusted partners ticker (home page) */
        var track = document.getElementById("logoTrack");
        if (track) {
            var list = NDA.partners || [];
            var section = document.getElementById("trusted");
            if (!list.length) {
                if (section) section.style.display = "none";
            } else {
                var html = list.map(function (p) {
                    return '<div class="logo-item"><img src="assets/logos/' + esc(p.logo) +
                        '" alt="' + esc(p.name) + '"></div>';
                }).join("");
                /* duplicated so the -50% scroll animation loops seamlessly */
                track.innerHTML = html + html;
            }
        }
    });
})();
