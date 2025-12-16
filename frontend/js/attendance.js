const token = localStorage.getItem('kda_token');
if (!token) { window.location = 'index.html'; }

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('kda_token');
  localStorage.removeItem('kda_name');
  window.location = 'index.html';
});

// Set default date to today
document.getElementById('adate').valueAsDate = new Date();

async function loadStudents() {
  const res = await getJSON(apiRoot + '/students', token);
  const aSel = document.getElementById('aStudent');
  aSel.innerHTML = '<option value="">Select student</option>';

  if (res.students) {
    res.students.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s._id;
      opt.text = `${s.fullName} (${s.regNo || 'No Reg'})`;
      aSel.appendChild(opt);
    });
  } else {
    showToast('Failed to load students', 'error');
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

  const res = await postJSON(apiRoot + '/attendance', { studentId, date, status }, token);

  submitBtn.disabled = false;

  if (res.attendance) {
    showToast('Attendance recorded');
    loadRecords();
  } else {
    showToast(res.error || 'Error recording attendance', 'error');
  }
});

async function loadRecords() {
  const res = await getJSON(apiRoot + '/attendance', token);
  const ul = document.getElementById('records');
  ul.innerHTML = '';

  if (res.records) {
    if (res.records.length === 0) {
      ul.innerHTML = '<p class="text-center" style="color:var(--text-light)">No records found.</p>';
      return;
    }

    // Sort by date desc
    res.records.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.records.forEach(r => {
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
}

(async function init() {
  await loadStudents(); // Fix: populate dropdown
  await loadRecords();
})();
