"use strict";

const colorBar = document.querySelector(".color-bar");
const colorBarCursor = document.querySelector(".color-bar__cursor");
const brand = document.querySelector(".navbar__brand");
const brandCursor = document.querySelector(".brand-cursor");

if (brand && brandCursor) {
  brand.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") brandCursor.classList.add("is-visible");
  });

  brand.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    brandCursor.style.left = `${event.clientX}px`;
    brandCursor.style.top = `${event.clientY}px`;
  });

  brand.addEventListener("pointerleave", () => {
    brandCursor.classList.remove("is-visible");
  });
}

if (colorBar && colorBarCursor) {
  colorBar.classList.add("has-custom-cursor");

  colorBar.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      colorBarCursor.classList.remove("is-visible");
      return;
    }

    const segment = event.target.closest(".color-bar__segment");
    if (!segment) {
      colorBarCursor.classList.remove("is-visible");
      return;
    }

    if (!segment.classList.contains("is-active")) {
      const segments = [...colorBar.querySelectorAll(".color-bar__segment")];
      const activeIndex = segments.indexOf(segment);
      const segmentBounds = segment.getBoundingClientRect();
      const segmentCenter = segmentBounds.left + segmentBounds.width / 2;
      const expandScale =
        (2 * Math.max(segmentCenter, window.innerWidth - segmentCenter)) /
        segmentBounds.width;

      colorBar.querySelector(".is-active")?.classList.remove("is-active");
      segments.forEach((item, index) => {
        if (item !== segment) {
          item.style.setProperty("--slide-direction", index < activeIndex ? "-1" : "1");
        }
      });
      segment.style.setProperty("--expand-scale", String(expandScale));
      segment.classList.add("is-active");
      colorBar.classList.add("is-expanding");
    }

    colorBarCursor.textContent = segment.dataset.label;
    colorBarCursor.style.left = `${event.clientX}px`;
    colorBarCursor.style.top = `${event.clientY}px`;
    colorBarCursor.classList.add("is-visible");
  });

  colorBar.addEventListener("pointerleave", () => {
    colorBarCursor.classList.remove("is-visible");
    colorBar.classList.remove("is-expanding");
    colorBar.querySelectorAll(".color-bar__segment").forEach((segment) => {
      segment.classList.remove("is-active");
      segment.style.removeProperty("--slide-direction");
      segment.style.removeProperty("--expand-scale");
    });
  });
}
