const token = localStorage.getItem('kda_token');
if (!token) { window.location = 'index.html'; }

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('kda_token');
  localStorage.removeItem('kda_name');
  window.location = 'index.html';
});

// Set default date to today
document.getElementById('adate').valueAsDate = new Date();

// MOCK DATA STORAGE Helpers
function getStudents() {
  return JSON.parse(localStorage.getItem('kda_students') || '[]');
}
function getRecords() {
  return JSON.parse(localStorage.getItem('kda_attendance') || '[]');
}
function saveRecords(records) {
  localStorage.setItem('kda_attendance', JSON.stringify(records));
}

async function loadStudents() {
  const students = getStudents();
  const aSel = document.getElementById('aStudent');
  aSel.innerHTML = '<option value="">Select student</option>';

  if (students.length > 0) {
    students.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s._id;
      opt.text = `${s.fullName} (${s.regNo || 'No Reg'})`;
      aSel.appendChild(opt);
    });
  } else {
    // Just a log, or empty
    console.log('No students found for attendance');
  }
}

document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('aStudent').value;
  const date = document.getElementById('adate').value;
  const status = document.getElementById('astatus').value;

  if (!studentId || !date) { showToast('Select student and date', 'error'); return; }

  const submitBtn = e.target.querySelector('button');
  submitBtn.disabled = true;

  // MOCK SAVE
  const records = getRecords();
  const students = getStudents();
  const studentObj = students.find(s => s._id === studentId); // store name snapshot if wanted, or just ID

  const newRecord = {
    _id: 'att-' + Date.now(),
    studentId: studentObj, // Store full object to mimic populated backend response
    date,
    status
  };

  records.push(newRecord);
  saveRecords(records);

  submitBtn.disabled = false;
  showToast('Attendance recorded');
  loadRecords();
});

async function loadRecords() {
  const records = getRecords();
  const ul = document.getElementById('records');
  ul.innerHTML = '';

  if (records.length === 0) {
    ul.innerHTML = '<p class="text-center" style="color:var(--text-light)">No records found.</p>';
    return;
  }

  // Sort by date desc
  records.sort((a, b) => new Date(b.date) - new Date(a.date));

  records.forEach(r => {
    const li = document.createElement('li');
    li.className = 'student-item';
    const dateStr = new Date(r.date).toLocaleDateString();

    let statusColor = 'var(--text)';
    if (r.status === 'absent') statusColor = 'var(--error)';
    if (r.status === 'present') statusColor = 'var(--success)';
    if (r.status === 'late') statusColor = '#f59e0b'; // orange

    li.innerHTML = `
      <div class="student-info">
          <strong>${r.studentId ? r.studentId.fullName : 'Unknown Student'}</strong>
          <span>${dateStr}</span>
      </div>
      <div style="font-weight:600; color:${statusColor}; text-transform: capitalize;">
          ${r.status}
      </div>
    `;
    ul.appendChild(li);
  });
}

(async function init() {
  await loadStudents(); // Fix: populate dropdown
  await loadRecords();
})();
