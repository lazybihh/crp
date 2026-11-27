// Verified campus photographs used when the media API has no gallery data.
export const DEFAULT_PHOTO_CATEGORIES = [
  "Campus",
  "Workshop",
  "Events",
  "Labs",
  "Library",
  "Hostels",
  "Sports",
  "Placements",
];

export const DEFAULT_GALLERY_PHOTOS = [
  { src: "/images/facilities/girls-common-room-2.jpg", title: "Student gathering", category: "Events" },
  { src: "/images/orientation-2025.jpg", title: "Student orientation", category: "Events" },
  { src: "/images/rangoli.jpg", title: "Rangoli activity", category: "Events" },
  { src: "/images/facilities/hostels-3.jpg", title: "Hostel building", category: "Hostels" },
  { src: "/images/facilities/hostels-2.jpg", title: "Hostel grounds", category: "Hostels" },
  { src: "/images/facilities/facility-library.jpg", title: "Students in the library", category: "Library" },
  { src: "/images/facilities/facility-sports.jpg", title: "Basketball on campus", category: "Sports" },
  { src: "/images/facilities/placement-cell-1.jpg", title: "Micron campus placement drive", category: "Placements" },
  { src: "/images/facilities/industrial-visits-1.jpg", title: "Industrial visit to Amul", category: "Events" },
  { src: "/images/facilities/conference-hall-1.jpg", title: "Student seminar", category: "Campus" },
];

export const DEFAULT_GALLERY_CATEGORIES = [...DEFAULT_PHOTO_CATEGORIES, "Other"];
