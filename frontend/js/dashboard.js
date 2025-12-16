const token = localStorage.getItem('kda_token');
if (!token) { window.location = 'index.html'; }

const userName = localStorage.getItem('kda_name');
if (userName) document.getElementById('welcome').innerText = 'Welcome, ' + userName;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('kda_token');
  localStorage.removeItem('kda_name');
  window.location = 'index.html';
});

async function loadStudents() {
  const res = await getJSON(apiRoot + '/students', token);
  const list = document.getElementById('studentsList');
  list.innerHTML = '';

  if (res.students) {
    document.getElementById('studentsCount').innerText = res.students.length;

    if (res.students.length === 0) {
      list.innerHTML = '<p class="text-center" style="color:var(--text-light); padding:20px;">No students enrolled yet.</p>';
      return;
    }

    res.students.forEach(s => {
      const li = document.createElement('li');
      li.className = 'student-item';
      li.innerHTML = `
        <div class="student-info">
          <strong>${s.fullName}</strong>
          <span>${s.classLevel || 'N/A'} • ${s.regNo || 'No Reg'}</span>
        </div>
        <div class="student-actions">
          <button class="action-btn delete-btn" onclick="delStudent('${s._id}')">Delete</button>
        </div>`;
      list.appendChild(li);
    });
  } else if (res.error) {
    showToast(res.error, 'error');
  }
}

window.delStudent = async function (id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  const res = await deleteJSON(apiRoot + '/students/' + id, token);
  if (res.message) {
    showToast(res.message);
    loadStudents();
    loadAttendanceCount();
  } else {
    showToast(res.error || 'Failed to delete', 'error');
  }
};

document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('sfullName').value.trim();
  const classLevel = document.getElementById('sclassLevel').value.trim();
  const parentPhone = document.getElementById('sparentPhone').value.trim();
  const regNo = document.getElementById('sregNo').value.trim();

  if (!fullName) { showToast('Full name required', 'error'); return; }

  const submitBtn = e.target.querySelector('button');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  const res = await postJSON(apiRoot + '/students', { fullName, classLevel, parentPhone, regNo }, token);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Add Student';

  if (res.student) {
    showToast('Student added successfully');
    document.getElementById('studentForm').reset();
    loadStudents();
    loadAttendanceCount();
  } else {
    showToast(res.error || 'Error adding student', 'error');
  }
});

async function loadAttendanceCount() {
  const today = new Date().toISOString().slice(0, 10);
  const res = await getJSON(apiRoot + '/attendance?date=' + today, token);
  if (res.records) {
    document.getElementById('attendanceCount').innerText = res.records.length;
  }
}

(async function init() {
  await loadStudents();
  await loadAttendanceCount();
})();
