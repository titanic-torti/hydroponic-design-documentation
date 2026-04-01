const defBubble = document.querySelector("#definition .definition-circle-1");
let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

defBubble.addEventListener("mouseleave", () => {
  if (defBubble.classList.contains("no-pop")) {
    defBubble.classList.remove("no-pop");
    return;
  }
  defBubble.style.pointerEvents = "none";
  defBubble.addEventListener(
    "transitionend",
    () => {
      defBubble.style.pointerEvents = "";
      const r = defBubble.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2,
        radius = r.width / 2;
      const dx = mouseX - cx,
        dy = mouseY - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        defBubble.classList.add("no-pop");
      }
    },
    { once: true },
  );
});

document.querySelectorAll(".sw").forEach((sw) => {
  sw.addEventListener("click", () => {
    navigator.clipboard.writeText(sw.dataset.hex).then(() => {
      sw.classList.add("copied");
      setTimeout(() => sw.classList.remove("copied"), 1500);
    });
  });
});
