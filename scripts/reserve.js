const occupied = new Set(['table_3', 'table_7']);
let selectedTable = null;
let selectedDate  = null;
let userBookings  = []; // { id, name, seats, dateLabel }

const today    = new Date();
let   calYear  = today.getFullYear();
let   calMonth = today.getMonth();

const MONTHS = [
  'January', 'February', 'March',     'April',
  'May',     'June',     'July',      'August',
  'September','October', 'November',  'December'
];

function buildCalendar() {
  const grid  = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');

  grid.innerHTML = '';
  label.textContent = MONTHS[calMonth] + ' ' + calYear;

  const firstDay   = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

  
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = prevMonthDays - firstDay + 1 + i;
    grid.appendChild(el);
  }

  
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    el.setAttribute('role', 'gridcell');

    const thisDate = new Date(calYear, calMonth, d);
    const isPast   = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (isPast) {
      el.classList.add('other-month');
    } else {
      const isBooked = [3, 8, 14, 21].includes(d);
      if (isBooked) {
        el.classList.add('booked');
        el.setAttribute('aria-disabled', 'true');
      }

      if (
        d === today.getDate() &&
        calMonth === today.getMonth() &&
        calYear  === today.getFullYear()
      ) {
        el.classList.add('today');
      }

      const dateKey = calYear + '_' + calMonth + '_' + d;
      if (selectedDate === dateKey) el.classList.add('selected');

      if (!isBooked) {
        el.setAttribute('tabindex', '0');

        el.addEventListener('click', () => {
          document.querySelectorAll('.cal-day').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
          selectedDate = dateKey;
          updateSidebar();
        });

        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
      }
    }

    grid.appendChild(el);
  }

  
  const total    = grid.children.length;
  const rows     = total <= 35 ? 35 : 42;
  const trailing = rows - total;
  for (let i = 1; i <= trailing; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = i;
    grid.appendChild(el);
  }
}

document.getElementById('cal-prev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  buildCalendar();
});

document.getElementById('cal-next').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  buildCalendar();
});

buildCalendar();


function isMobileLayout() {
  return window.matchMedia('(max-width: 860px)').matches;
}

document.querySelectorAll('.table').forEach(tableEl => {
  const id  = tableEl.id;
  const btn = tableEl.querySelector('.table_btn');
  if (!btn) return;

  if (occupied.has(id)) {
    tableEl.classList.add('occupied');
    btn.disabled = true;
    btn.setAttribute('aria-label', tableEl.dataset.name + ' — reserved, unavailable');
    return;
  }

  btn.addEventListener('click', () => {
    if (tableEl.classList.contains('occupied')) return;

    if (selectedTable === id) {
      tableEl.classList.remove('selected');
      selectedTable = null;
    } else {
      if (selectedTable) {
        document.getElementById(selectedTable)?.classList.remove('selected');
      }
      tableEl.classList.add('selected');
      selectedTable = id;
    }
    updateSidebar();

    if (selectedTable && isMobileLayout()) {
      document.getElementById('right_bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

function updateSidebar() {
  const card    = document.getElementById('res-card');
  const hint    = document.getElementById('no-selection-hint');
  const btn     = document.getElementById('res-confirm-btn');
  const tName   = document.getElementById('res-table-name');
  const tSeats  = document.getElementById('res-table-seats');
  const tDate   = document.getElementById('res-date-display');

  if (selectedTable) {
    const tableEl = document.getElementById(selectedTable);
    tName.textContent  = tableEl.dataset.name;
    tSeats.textContent = tableEl.dataset.seats + ' seats';

    if (selectedDate) {
      const [y, m, d]    = selectedDate.split('_');
      tDate.textContent  = MONTHS[+m] + ' ' + d + ', ' + y;
      btn.classList.add('visible');
    } else {
      tDate.textContent = 'Select a date';
      btn.classList.remove('visible');
    }

    card.classList.add('visible');
    hint.style.display = 'none';
  } else {
    card.classList.remove('visible');
    btn.classList.remove('visible');
    hint.style.display = '';
  }
}

document.getElementById('res-confirm-btn').addEventListener('click', () => {
  if (!selectedTable || !selectedDate) return;

  const tableEl   = document.getElementById(selectedTable);
  const btn       = tableEl.querySelector('.table_btn');
  const name      = tableEl.dataset.name;
  const seats     = tableEl.dataset.seats;
  const [y, m, d] = selectedDate.split('_');
  const dateStr   = MONTHS[+m] + ' ' + d;
  const dateLabel = MONTHS[+m].slice(0, 3) + ' ' + d;

  showToast(name + ' reserved for ' + dateStr);

  userBookings.push({ id: selectedTable, name, seats, dateLabel });
  renderNavBookings();

  
  occupied.add(selectedTable);
  tableEl.classList.remove('selected');
  tableEl.classList.add('occupied');
  btn.disabled = true;
  btn.setAttribute('aria-label', name + ' — reserved, unavailable');
  const seatsLabel = btn.querySelector('.table_btn_seats');
  if (seatsLabel) seatsLabel.textContent = 'Reserved';

  
  selectedTable = null;
  selectedDate  = null;
  updateSidebar();
  buildCalendar();
});

function renderNavBookings() {
  const list  = document.getElementById('nav_bookings_list');
  const empty = document.getElementById('nav_bookings_empty');
  if (!list) return;

  list.querySelectorAll('.nav_booking_item').forEach(el => el.remove());

  if (userBookings.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  userBookings.forEach(booking => {
    const li = document.createElement('li');
    li.className = 'nav_booking_item';
    li.dataset.tableId = booking.id;

    const info = document.createElement('div');
    info.className = 'nav_booking_info';

    const name = document.createElement('span');
    name.className = 'nav_booking_name';
    name.textContent = booking.name;

    const meta = document.createElement('span');
    meta.className = 'nav_booking_meta';
    meta.textContent = booking.seats + ' seats · ' + booking.dateLabel;

    info.append(name, meta);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'nav_booking_cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel reservation for ' + booking.name);
    cancelBtn.innerHTML = '&times;';
    cancelBtn.addEventListener('click', () => cancelBooking(booking.id));

    li.append(info, cancelBtn);
    list.appendChild(li);
  });
}

function cancelBooking(tableId) {
  const idx = userBookings.findIndex(b => b.id === tableId);
  if (idx === -1) return;
  const [removed] = userBookings.splice(idx, 1);

  const tableEl = document.getElementById(tableId);
  if (tableEl) {
    occupied.delete(tableId);
    tableEl.classList.remove('occupied');
    const btn = tableEl.querySelector('.table_btn');
    if (btn) {
      btn.disabled = false;
      btn.setAttribute('aria-label', 'Select ' + tableEl.dataset.name + ' — ' + tableEl.dataset.seats + ' seats');
      const seatsLabel = btn.querySelector('.table_btn_seats');
      if (seatsLabel) seatsLabel.textContent = tableEl.dataset.seats + ' seats';
    }
  }

  renderNavBookings();
  showToast(removed.name + ' reservation cancelled');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = ' ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

renderNavBookings();