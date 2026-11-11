const form = document.querySelector('#bill');
const people = document.querySelector('#people');
const total = document.querySelector('#total');
const list = document.querySelector('#transfers');
const error = document.querySelector('#error');
const add = document.querySelector('#add');
const dollars = cents => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function clearResult() {
  error.textContent = '';
  total.textContent = 'Calculate to update the settlement.';
  list.replaceChildren();
}

function addPerson(name = '', amount = '0') {
  const row = document.querySelector('#row').content.firstElementChild.cloneNode(true);
  row.querySelector('.name').value = name;
  row.querySelector('.amount').value = amount;
  row.querySelector('.remove').onclick = () => {
    row.remove();
    add.disabled = false;
    clearResult();
  };
  people.append(row);
  add.disabled = people.children.length >= 50;
  return row;
}

function calculate() {
  clearResult();
  try {
    const entries = Array.from(people.children, row => ({
      name: row.querySelector('.name').value, amount: row.querySelector('.amount').value
    }));
    const split = settle(entries);
    total.textContent = dollars(split.total) + ' shared by ' + entries.length + ' people';
    const lines = split.transfers.map(t => t.from + ' pays ' + t.to + ' ' + dollars(t.cents));
    if (!lines.length) lines.push('Everyone is settled.');
    for (const line of lines) {
      const li = document.createElement('li');
      li.textContent = line;
      list.append(li);
    }
  } catch (err) { error.textContent = err.message; }
}

form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
form.addEventListener('input', clearResult);
add.onclick = () => { addPerson().querySelector('.name').focus(); clearResult(); };
addPerson('Noa', '48.00');
addPerson('Sam', '12.00');
addPerson('Alex', '0');
calculate();
