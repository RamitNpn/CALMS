export function generateTokenNumber(latestToken?: string) {
  const today = new Date();

  const yyyy = today.getFullYear();

  const mm = String(today.getMonth() + 1).padStart(2, "0");

  const dd = String(today.getDate()).padStart(2, "0");

  const date = `${yyyy}${mm}${dd}`;

  let serial = 1;

  if (latestToken) {
    const last = Number(latestToken.split("-").pop()) || 0;

    serial = last + 1;
  }

  return `DRV-${date}-TKN-${String(serial).padStart(3, "0")}`;
}
bjhhbssvhsbhs sg s gs dgbdg vsgd

