import { HOME_SECTION_ID } from "../constants/anchors";

export function scrollToPageTop() {
  const homeSection = document.getElementById(HOME_SECTION_ID);

  if (homeSection) {
    homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
