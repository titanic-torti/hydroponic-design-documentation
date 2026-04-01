let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function initPopBubbleGroup(triggers, companions) {
  const allElements = [...triggers, ...companions];
  let noPop = false;
  let popping = false;

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      if (noPop) return;
      popping = false;
      allElements.forEach((e) => e.classList.add("group-pop"));
    });

    trigger.addEventListener("mouseleave", (e) => {
      if (allElements.some((el) => el === e.relatedTarget)) return;
      if (popping) return;

      if (noPop) {
        noPop = false;
        allElements.forEach((el) => el.classList.remove("group-pop"));
        return;
      }

      popping = true;
      allElements.forEach((el) => {
        el.classList.remove("group-pop");
        el.style.pointerEvents = "none";
      });
      trigger.addEventListener(
        "transitionend",
        () => {
          popping = false;
          triggers.forEach((t) => (t.style.pointerEvents = ""));
          const inGroup = triggers.some((t) => {
            const r = t.getBoundingClientRect();
            const cx = r.left + r.width / 2,
              cy = r.top + r.height / 2,
              radius = r.width / 2;
            const dx = mouseX - cx,
              dy = mouseY - cy;
            return dx * dx + dy * dy <= radius * radius;
          });
          if (inGroup) noPop = true;
        },
        { once: true },
      );
    });
  });
}

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
    "#definition .definition-circle-1, #definition .definition-circle-2, #definition .definition-circle-3, #definition .top-right-circle, #definition .top-left-circle, #definition .top-left-circle-support",
  )
  .forEach(initPopBubble);

initPopBubbleGroup(
  [
    document.querySelector("#definition .rightmost-circle"),
    document.querySelector("#quotes .circle-overflow-outline-1"),
  ],
  [
    document.querySelector("#definition .rightmost-circle-inner"),
    document.querySelector("#quotes .circle-overflow-outline-2"),
  ],
);

document.querySelectorAll(".sw").forEach((sw) => {
  sw.addEventListener("click", () => {
    navigator.clipboard.writeText(sw.dataset.hex).then(() => {
      sw.classList.add("copied");
      setTimeout(() => sw.classList.remove("copied"), 1500);
    });
  });
});
