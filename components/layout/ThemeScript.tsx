// Inline script placed in <head> to apply the saved theme before first paint,
// avoiding a flash of the wrong theme.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("sb-radar-theme");if(t==="light"||t==="dark"){document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);}else if(window.matchMedia("(prefers-color-scheme: light)").matches){document.documentElement.classList.add("light");}else{document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`;
