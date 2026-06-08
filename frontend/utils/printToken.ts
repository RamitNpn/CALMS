export function printToken() {
  document.body.classList.add("token-print-mode");

  const cleanup = () => {
    document.body.classList.remove("token-print-mode");
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);
  window.print();
}
