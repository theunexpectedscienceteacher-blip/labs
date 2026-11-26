# The Unexpected Science Teacher - Lab Library

Live at **https://labs.theunexpectedscienceteacher.com**

- `index.html` - the Lab Library home page (one card per lab)
- `teachers/` - how teachers use the labs
- `privacy/` - privacy & student data page for schools and IT
- `shared/` - styles and tools every lab uses (`lab-tools.js` adds the Lab Library link and the "Clear my work" button)
- one folder per lab, each with its own `index.html`

## Add a new lab
1. Create a folder (for example `tides/`) with the lab's `index.html`.
2. In the lab's `<head>`, copy the two `<meta>` lines (Content-Security-Policy and referrer) from any other lab.
3. Before `</body>`, add `<script src="../shared/lab-tools.js" defer></script>`.
4. Copy one `<a class="lab">` card in the top-level `index.html` and change the folder, title, tag and description.

Rules that keep the site school-safe: no logins, no forms that send data, nothing loaded from other websites, and no answer keys on the site.

(c) 2026 The Unexpected Science Teacher. All rights reserved.
