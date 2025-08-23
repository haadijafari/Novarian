export const circularThemeSwitch = (x: number, y: number) => {

  // Calculate the radius to the farthest corner of the viewport.
  // This ensures the circle covers the entire screen.
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: "ease-in-out",
      // Target the new view only
      pseudoElement: "::view-transition-new(root)",
    }
  )
}
