const upcomingList = document.getElementById("upcoming-list");
const pastList = document.getElementById("past-list");
const pastSection = document.getElementById("past");
const searchInput = document.getElementById("search");
const showPast = document.getElementById("show-past");

// Parse "YYYY-MM-DD" as a local date so it doesn't shift across time zones.
function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatRange(start, end) {
  const opts = { month: "short", day: "numeric", year: "numeric" };
  if (start.getTime() === end.getTime()) return start.toLocaleDateString(undefined, opts);
  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, opts)}`;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, attrs);
  node.append(...children);
  return node;
}

function renderEvent(ev, isPast) {
  const start = parseDate(ev.start);
  const end = parseDate(ev.end || ev.start);
  const place = [ev.venue, ev.city, ev.region, ev.country].filter(Boolean).join(", ");

  const item = el("li", { className: `event${isPast ? " past" : ""}${ev.image ? " has-image" : ""}` },
    el("div", { className: "date-badge" },
      el("span", { className: "month", textContent: start.toLocaleDateString(undefined, { month: "short" }) }),
      el("span", { className: "day", textContent: String(start.getDate()) })
    ),
    el("div", { className: "details" },
      el("h3", {}, ev.url ? el("a", { href: ev.url, target: "_blank", rel: "noopener", textContent: ev.name }) : ev.name),
      el("p", { className: "meta", textContent: `${formatRange(start, end)} · ${place}` }),
      el("ul", { className: "tags" }, ...(ev.tags || []).map(t => el("li", { textContent: t })))
    )
  );

  if (ev.image) {
    item.append(el("img", {
      className: "event-image",
      src: ev.image,
      alt: ev.imageAlt || ev.name,
      loading: "lazy",
      // Drop the image slot if the file is missing rather than showing a broken icon.
      onerror() { this.remove(); item.classList.remove("has-image"); }
    }));
  }

  return item;
}

function matches(ev, q) {
  if (!q) return true;
  const haystack = [ev.name, ev.venue, ev.city, ev.region, ev.country, ...(ev.tags || [])].join(" ").toLowerCase();
  return haystack.includes(q);
}

function fill(list, events, isPast) {
  list.replaceChildren(
    ...(events.length
      ? events.map(ev => renderEvent(ev, isPast))
      : [el("li", { className: "empty", textContent: "No shows found." })])
  );
}

function render(events) {
  const q = searchInput.value.trim().toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = events.filter(ev => matches(ev, q));
  const upcoming = filtered
    .filter(ev => parseDate(ev.end || ev.start) >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
  const past = filtered
    .filter(ev => parseDate(ev.end || ev.start) < today)
    .sort((a, b) => b.start.localeCompare(a.start));

  fill(upcomingList, upcoming, false);
  fill(pastList, past, true);
  pastSection.hidden = !showPast.checked;
}

const res = await fetch("data/events.json");
const events = await res.json();

searchInput.addEventListener("input", () => render(events));
showPast.addEventListener("change", () => render(events));
render(events);
