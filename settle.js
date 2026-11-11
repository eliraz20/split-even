function settle(entries) {
  if (entries.length < 2 || entries.length > 50) throw Error('Add between 2 and 50 people.');
  const names = new Set();
  const paid = entries.map(({ name, amount }) => {
    const label = name.trim();
    if (!label || names.has(label.toLowerCase())) throw Error('Give each person a different name.');
    names.add(label.toLowerCase());
    const match = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(amount.trim());
    if (!match) throw Error('Enter each payment as a nonnegative amount with up to two decimal places.');
    return { name: label, cents: Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0')) };
  });
  const total = paid.reduce((sum, person) => sum + person.cents, 0);
  const base = Math.floor(total / paid.length);
  const shares = paid.map((p, i) => base + (i < total % paid.length ? 1 : 0));
  const debtors = [], creditors = [];
  paid.forEach((p, i) => {
    const difference = p.cents - shares[i];
    if (difference !== 0) (difference < 0 ? debtors : creditors).push({ name: p.name, left: Math.abs(difference) });
  });
  const transfers = [];
  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const owing = debtors[d], owed = creditors[c];
    const cents = Math.min(owing.left, owed.left);
    transfers.push({ from: owing.name, to: owed.name, cents });
    owing.left -= cents;
    owed.left -= cents;
    if (owing.left === 0) d++;
    if (owed.left === 0) c++;
  }
  return { total, shares, transfers };
}
if (typeof module !== 'undefined') module.exports = { settle };
