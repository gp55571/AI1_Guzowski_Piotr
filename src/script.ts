const styles = [
  { name: "styl1", href: "/style-1.css" },
  { name: "styl2", href: "/style-2.css" },
  { name: "styl3", href: "/style-3.css"}
];

let activeLink: HTMLLinkElement | null = null;

function attachStyle(href: string): void {
  if (activeLink) activeLink.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);

  activeLink = link;
}

function generateStyleLinks(): void {
  const container = document.getElementById("style-links")!;
  
  styles.forEach(style => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = style.name;
    a.style.marginRight = "10px";

    a.onclick = (e) => {
      e.preventDefault();
      attachStyle(style.href);
    };

    container.appendChild(a);
  });
}

generateStyleLinks();
attachStyle(styles[0].href);
