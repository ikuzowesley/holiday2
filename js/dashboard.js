const token = localStorage.getItem('kda_token');
if (!token) { window.location = 'index.html'; }

const userName = localStorage.getItem('kda_name');
if (userName) document.getElementById('welcome').innerText = 'Welcome, ' + userName;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('kda_token');
  localStorage.removeItem('kda_name');
  window.location = 'index.html';
});

// MOCK DATA STORAGE
function getStudents() {
  return JSON.parse(localStorage.getItem('kda_students') || '[]');
}
function saveStudents(students) {
  localStorage.setItem('kda_students', JSON.stringify(students));
}

async function loadStudents() {
  // MOCK: Get from local storage
  const students = getStudents();

  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  document.getElementById('studentsCount').innerText = students.length;

  if (students.length === 0) {
    list.innerHTML = '<p class="text-center" style="color:var(--text-light); padding:20px;">No students enrolled yet.</p>';
    return;
  }

  students.forEach(s => {
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
}

window.delStudent = async function (id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  // MOCK DELETE
  let students = getStudents();
  students = students.filter(s => s._id !== id);
  saveStudents(students);

  showToast('Student deleted');
  loadStudents();
  loadAttendanceCount();
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

  // MOCK ADD
  setTimeout(() => {
    const students = getStudents();
    const newStudent = {
      _id: 's-' + Date.now(),
      fullName,
      classLevel,
      parentPhone,
      regNo
    };
    students.push(newStudent);
    saveStudents(students);

    showToast('Student added successfully');
    document.getElementById('studentForm').reset();
    loadStudents();
    loadAttendanceCount();

    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Student';
  }, 500);
});

async function loadAttendanceCount() {
  const today = new Date().toISOString().slice(0, 10);
  const records = JSON.parse(localStorage.getItem('kda_attendance') || '[]');
  // Filter for today
  const todayRecords = records.filter(r => r.date === today);

  document.getElementById('attendanceCount').innerText = todayRecords.length;
}

(async function init() {
  // Populate initial mock data if empty
  if (!localStorage.getItem('kda_students')) {
    saveStudents([
      { _id: 's1', fullName: 'Alice Johnson', classLevel: 'Form 1', regNo: 'KDA001' },
      { _id: 's2', fullName: 'Bob Smith', classLevel: 'Form 2', regNo: 'KDA002' }
    ]);
  }

  await loadStudents();
  await loadAttendanceCount();
})();
