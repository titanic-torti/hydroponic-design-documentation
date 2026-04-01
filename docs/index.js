let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function initPopBubble(bubble) {
  bubble.addEventListener("mouseleave", () => {
    if (bubble.classList.contains("no-pop")) {
      bubble.classList.remove("no-pop");
      return;
    }
    bubble.style.pointerEvents = "none";
    bubble.addEventListener(
      "transitionend",
      () => {
        bubble.style.pointerEvents = "";
        const r = bubble.getBoundingClientRect();
        const cx = r.left + r.width / 2,
          cy = r.top + r.height / 2,
          radius = r.width / 2;
        const dx = mouseX - cx,
          dy = mouseY - cy;
        if (dx * dx + dy * dy <= radius * radius) {
          bubble.classList.add("no-pop");
        }
      },
      { once: true },
    );
  });
}

document
  .querySelectorAll(
    "#definition .definition-circle-1, #definition .definition-circle-2, #definition .definition-circle-3, #definition .top-right-circle",
  )
  .forEach(initPopBubble);

document.querySelectorAll(".sw").forEach((sw) => {
  sw.addEventListener("click", () => {
    navigator.clipboard.writeText(sw.dataset.hex).then(() => {
      sw.classList.add("copied");
      setTimeout(() => sw.classList.remove("copied"), 1500);
    });
  });
});
