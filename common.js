/* Gallery helpers. Requires data.js (BIRDS). */

// Stable colour per family, used for placeholder images.
function familyHue(family) {
  let h = 0;
  for (const c of family) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

// Placeholder image as an inline SVG data URI: no files, no network.
function placeholder(bird) {
  const hue = familyHue(bird.family);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},45%,38%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},50%,22%)"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M130 190c0-40 30-70 70-70 25 0 40 10 55 25l35-10-25 30c0 45-35 75-80 75-35 0-55-20-55-50z"/>
      <circle cx="238" cy="140" r="3" fill="rgba(255,255,255,.8)"/>
      <path d="M170 255l-8 18M205 258l-4 18"/>
    </g></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Reference photos: stand-ins until you have your own. Fetched from iNaturalist
// (free, no key, CORS-enabled), cached in localStorage, and always shown with credit.
const REF_CACHE_KEY = "birdRefPhotos.v2";
const refCache = JSON.parse(localStorage.getItem(REF_CACHE_KEY) || "{}");

async function fetchReferencePhoto(bird) {
  if (refCache[bird.sci]) return refCache[bird.sci];
  const url = "https://api.inaturalist.org/v1/taxa?rank=species&per_page=1&q=" + encodeURIComponent(bird.sci);
  try {
    const res = await fetch(url);
    const taxon = (await res.json()).results?.[0];
    const photo = taxon?.default_photo;
    if (!photo) return null;
    refCache[bird.sci] = { url: photo.medium_url, credit: photo.attribution, taxonId: taxon.id };
    localStorage.setItem(REF_CACHE_KEY, JSON.stringify(refCache));
    return refCache[bird.sci];
  } catch { return null; }
}

// Several reference photos for one bird (used by the detail carousel). Two API calls
// the first time (find the taxon, then its photos), then cached. Photos marked
// "all rights reserved" are skipped; only openly licensed ones are shown.
const GALLERY_CACHE_KEY = "birdRefGallery.v1";
const galleryCache = JSON.parse(localStorage.getItem(GALLERY_CACHE_KEY) || "{}");

async function fetchReferenceGallery(bird, max = 8) {
  if (galleryCache[bird.sci]) return galleryCache[bird.sci];
  const first = await fetchReferencePhoto(bird);
  if (!first) return [];
  try {
    const res = await fetch("https://api.inaturalist.org/v1/taxa/" + first.taxonId);
    const photos = (await res.json()).results?.[0]?.taxon_photos || [];
    const list = photos.map(t => t.photo)
      .filter(p => p.license_code && p.large_url)
      .slice(0, max)
      .map(p => ({ url: p.large_url, credit: p.attribution.replace(/\s+/g, " ").trim() }));
    if (!list.length) return [first];
    galleryCache[bird.sci] = list;
    localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(galleryCache));
    return list;
  } catch { return [first]; }
}

// What image should a bird show right now? Own photo > reference photo > placeholder.
function imageFor(bird, useReference, ref) {
  if (bird.photo) return { src: bird.photo, label: bird.credit || "", kind: "own" };
  if (useReference && ref) return { src: ref.url, label: "Reference photo, not ours. " + ref.credit, kind: "ref" };
  return { src: placeholder(bird), label: "Photo coming soon", kind: "none" };
}

// Lazily load reference photos when cards scroll into view (gentle on the API).
function lazyReferencePhotos(selector, apply) {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const bird = BIRDS.find(b => b.id === +e.target.dataset.id);
      fetchReferencePhoto(bird).then(ref => ref && apply(e.target, bird, ref));
    }
  }, { rootMargin: "200px" });
  document.querySelectorAll(selector).forEach(el => io.observe(el));
  return io;
}

// Outbound links for a bird. All About Birds blocks iframes, so these are links only.
// eBird and Macaulay links need the eBird species code (b.code). Wikipedia goes straight to
// the article for the scientific name (or a search page if there is no exact match).
// All About Birds is not used: it only covers North American species.
function birdLinks(b) {
  const links = [];
  if (b.code) {
    links.push(["eBird species page", "https://ebird.org/species/" + b.code]);
    links.push(["Photos &amp; sounds (Macaulay)", "https://media.ebird.org/catalog?taxonCode=" + b.code]);
  }
  links.push(["Wikipedia", "https://en.wikipedia.org/wiki/Special:Search?go=Go&search=" + encodeURIComponent(b.sci)]);
  return links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join("");
}
