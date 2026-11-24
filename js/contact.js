/* contact.js - quote builder (replaces the PHP form handler; sends via mailto: or WhatsApp) */
(function () {
    var NDA = window.NDA || {};
    var services = NDA.services || [];
    var esc = window.ndaEsc;

    function money(n) {
        return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    document.addEventListener("DOMContentLoaded", function () {
        var grid = document.getElementById("serviceGrid");
        var tbody = document.getElementById("serviceRows");
        var list = document.getElementById("selected-nodes-list");
        var priceDisplay = document.getElementById("summary-price-display");
        var alertBox = document.getElementById("formAlert");
        var form = document.getElementById("quote-generation-form");

        /* ---- Render catalog cards ---- */
        if (!services.length) {
            grid.innerHTML = '<div class="col-12 text-center py-5 bg-white rounded border"><i class="fas fa-briefcase fa-3x text-muted mb-3"></i>' +
                '<p class="text-muted mb-0">Our service catalog is being refreshed. Please contact us directly for a tailored quotation.</p></div>';
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted p-4">No services are available to choose right now.</td></tr>';
            return;
        }

        grid.innerHTML = services.map(function (s) {
            var price = s.price > 0 ? money(s.price) : '<span class="text-muted fs-6 fw-semibold">Variable / Quote Req.</span>';
            return '<div class="col-12 col-md-6 col-lg-4"><div class="card service-card h-100 p-4 d-flex flex-column justify-content-between bg-white border">' +
                '<div><div class="d-flex align-items-center mb-3"><i class="fas fa-cubes fa-2x service-icon me-3"></i>' +
                '<h5 class="fw-bold mb-0 text-dark">' + esc(s.name) + '</h5></div>' +
                '<p class="text-muted small mb-4">' + esc(s.description) + '</p></div>' +
                '<div class="d-flex justify-content-between align-items-center mt-2 pt-3 border-top">' +
                '<span class="small fw-bold text-secondary">Base Rate:</span><span class="price-tag">' + price + '</span></div></div></div>';
        }).join("");

        /* ---- Render selection table ---- */
        tbody.innerHTML = services.map(function (s) {
            var price = s.price > 0 ? money(s.price) : '<span class="text-muted small fw-normal">Variable</span>';
            return '<tr class="clickable-row"><td class="text-center">' +
                '<input class="form-check-input service-checkbox" type="checkbox" id="check_' + s.id + '" value="' + s.id + '"></td>' +
                '<td><label class="fw-semibold text-dark mb-0 d-block" for="check_' + s.id + '" style="cursor:pointer;">' + esc(s.name) + '</label></td>' +
                '<td class="text-end font-monospace fw-bold text-success">' + price + '</td></tr>';
        }).join("");

        /* Clicking anywhere on a row toggles it (labels/inputs handle themselves) */
        tbody.addEventListener("click", function (e) {
            if (e.target.closest("input, label")) return;
            var row = e.target.closest("tr");
            var cb = row && row.querySelector(".service-checkbox");
            if (cb) { cb.checked = !cb.checked; calculate(); }
        });
        tbody.addEventListener("change", calculate);

        function selected() {
            var ids = [].slice.call(document.querySelectorAll(".service-checkbox:checked")).map(function (c) { return Number(c.value); });
            return services.filter(function (s) { return ids.indexOf(s.id) !== -1; });
        }

        function totals(chosen) {
            var total = 0, variable = false;
            chosen.forEach(function (s) { if (s.price > 0) total += s.price; else variable = true; });
            var text = money(total) + (variable ? " + Variable Additions" : "");
            return { total: total, variable: variable, text: text };
        }

        function calculate() {
            var chosen = selected();
            if (!chosen.length) {
                list.innerHTML = '<p class="text-center py-2 fst-italic mb-0">No NDA services selected yet.</p>';
                priceDisplay.textContent = "$0.00";
                return;
            }
            list.innerHTML = '<ul class="list-unstyled mb-0">' + chosen.map(function (s) {
                var p = s.price > 0 ? '<span class="fw-bold text-dark">' + money(s.price) + '</span>' : '<span class="text-muted fst-italic">Variable</span>';
                return '<li class="d-flex justify-content-between py-1 border-bottom"><span>&bull; ' + esc(s.name) + '</span>' + p + '</li>';
            }).join("") + '</ul>';
            var t = totals(chosen);
            priceDisplay.textContent = money(t.total) + (t.variable ? " + Var" : "");
        }

        function showAlert(type, title, msg) {
            var icon = type === "success" ? "fa-check-circle text-success" : "fa-exclamation-circle text-danger";
            alertBox.innerHTML = '<div class="alert alert-' + (type === "success" ? "success" : "danger") +
                ' p-4 border-0 shadow-sm rounded-3 mb-4 text-start" role="alert"><div class="d-flex">' +
                '<i class="fas ' + icon + ' fa-2x me-3"></i><div><h5 class="alert-heading fw-bold">' + esc(title) +
                '</h5><p class="mb-0">' + esc(msg) + '</p></div></div></div>';
            alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        /* ---- Submit ---- */
        window.submitThroughChannel = function (channel) {
            alertBox.innerHTML = "";
            if (!form.reportValidity()) return;

            var chosen = selected();
            if (!chosen.length) {
                showAlert("error", "Review Required Parameters", "Please select at least one service offering to build your package.");
                return;
            }

            var f = new FormData(form);
            var name = f.get("client_name"), email = f.get("client_email"), phone = f.get("client_phone"), notes = (f.get("notes") || "").trim();
            var lines = chosen.map(function (s) {
                return "- " + s.name + (s.price > 0 ? " (" + money(s.price) + ")" : " (Variable/Quote Req.)");
            });
            var t = totals(chosen);

            if (channel === "whatsapp") {
                var text = "*NEW CUSTOM QUOTE REQUEST*\n\n*Client Details:*\n- Name: " + name + "\n- Email: " + email + "\n- Phone: " + phone +
                    "\n\n*Selected Services:*\n" + lines.join("\n") + "\n\n*Est. Base Cost Total:* " + t.text +
                    (notes ? "\n\n*Special Notes:*\n" + notes : "");
                window.open("https://wa.me/" + NDA.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
            } else {
                var body = "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\n\nServices Selected:\n" + lines.join("\n") +
                    "\n\nEst. Base Cost: " + t.text + "\n\nNotes:\n" + notes;
                window.location.href = "mailto:" + NDA.email + "?subject=" + encodeURIComponent("New Custom Quote Request - " + name) +
                    "&body=" + encodeURIComponent(body);
                showAlert("success", "Your email is ready to send", "Your email app should now open with the quotation request filled in. Press send to complete it and our team will respond within 24 business hours.");
            }
        };
    });
})();
