
// DOM utility functions:

const el = (sel, par) => (par||document).querySelector(sel);


// Popup:

let elPopup; // To remember the currently active popup

const handlePopup = (evt) => {
  // Get clicked target
  const elTarget = evt.target;

  // Clicked a popup, do nothing (Comment this line if not needed)
  if (elTarget.closest(".popup")) return;

  // Close currently open popup (if any):
  if (elPopup) elPopup.classList.remove("is-active");

  // Get initiator button
  const elBtn = elTarget.closest("[data-popup]");

  // Not a valid button
  if (!elBtn) return;

  // Get the popup
  elPopup = el(elBtn.dataset.popup);  

  // No matching popup in this page, do nothing
  if (!elPopup) return; 
  
  // Get its parent (BODY) so that we can calculate the min max
  // available space
  const elParent = elPopup.parentElement;
  
  // Position:
  const absX = evt.clientX + window.scrollX;
  const absY = evt.clientY + window.scrollY;
  
  const bcrParent = elParent.getBoundingClientRect();
  const bcrPopup = elPopup.getBoundingClientRect();
  
  const maxX = bcrParent.width - bcrPopup.width;
  const maxY = bcrParent.height - bcrPopup.height;
  
  const x = Math.max(0, Math.min(absX, maxX));
  const y = Math.max(0, Math.min(absY, maxY));
  
  // Show popup
  Object.assign(elPopup.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
  elPopup.classList.add("is-active");

};

el("body").addEventListener("click", handlePopup);