/* ==========================================================
   Site data - edit this file instead of a database.
   This replaces the MySQL tables used by the PHP version.
   ========================================================== */
window.NDA = {
    whatsapp: "263785754588",
    email: "info@newdimensionsadventures.com",

    /* Trusted partners slider (home page).
       Upload the logo files into assets/logos/ and list them here.
       Example: { name: "Company Name", logo: "company.png" }
       The section stays hidden while this list is empty. */
    partners: [],

    /* Quote builder services (contact.html).
       price: 0 means "Variable / Quote Req." - set a number to show a base price. */
    services: [
        { id: 1, name: "Team Building Facilitation", price: 0, description: "Expert guidance through engaging activities that strengthen teamwork and communication skills." },
        { id: 2, name: "Team Building Venues", price: 0, description: "Diverse indoor/outdoor venues for immersive experiences, conveniently located for accessibility." },
        { id: 3, name: "Conferencing Packages", price: 0, description: "Tailored packages for seamless event planning, saving you stress and ensuring success." },
        { id: 4, name: "Team Building Activities", price: 0, description: "Purposeful challenges to inspire and motivate teams, enhancing problem-solving and collaboration." },
        { id: 5, name: "Adventure Team Building", price: 0, description: "Thrilling experiences to push boundaries, build resilience, and cultivate adaptability." },
        { id: 6, name: "Corporate Training", price: 0, description: "Comprehensive programs to enhance skills and leadership, improving performance and growth." },
        { id: 7, name: "End of Year Events", price: 0, description: "Memorable celebrations to recognize achievements, boost morale, and motivate continued success." },
        { id: 8, name: "Staff Appreciation Days", price: 0, description: "Fun-filled events to show appreciation, strengthen engagement, and build loyalty." }
    ],

    /* Past events (latest_events.html).
       date format: YYYY-MM-DD. image is optional. */
    events: [
        /* { id: 1, title: "Annual Team Building Retreat", location: "Harare", date: "2026-08-15",
             image: "uploads/events/example.jpg", description: "Short summary of the event." } */
    ],

    /* Blog posts (blog.html and blog_view.html).
       slug must be unique and URL-friendly. content may contain HTML. */
    posts: [
        /* { slug: "top-team-building-spots-harare", title: "Top Team Building Spots in Harare",
             author: "NDA Team", date: "2026-11-01", image: "images/p20.jpg",
             summary: "One-line hook shown on the blog list.",
             content: "<p>Full article HTML here.</p>" } */
    ],

    /* Latest gallery uploads (latest_gallery.html). */
    uploads: [
        { src: "uploads/events/1786449211_0V0A3466.JPG", caption: "" },
        { src: "uploads/events/1786449584_b003721f.jpg", caption: "" },
        { src: "uploads/events/1786449696_3d0faab1.jpg", caption: "" }
    ]
};
