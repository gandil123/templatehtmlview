// ============================================================
//  قاعدة البيانات المحلية (LocalStorage)
// ============================================================
const DB = {
    getUsers() {
        return JSON.parse(localStorage.getItem('bank_users')) || [];
    },
    setUsers(users) {
        localStorage.setItem('bank_users', JSON.stringify(users));
    },
    getAccounts() {
        return JSON.parse(localStorage.getItem('bank_accounts')) || [];
    },
    setAccounts(accounts) {
        localStorage.setItem('bank_accounts', JSON.stringify(accounts));
    },
    getTransactions() {
        return JSON.parse(localStorage.getItem('bank_transactions')) || [];
    },
    setTransactions(transactions) {
        localStorage.setItem('bank_transactions', JSON.stringify(transactions));
    },
    getBannedUsers() {
        return JSON.parse(localStorage.getItem('banned_users')) || [];
    },
    setBannedUsers(banned) {
        localStorage.setItem('banned_users', JSON.stringify(banned));
    },
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('current_user'));
    },
    setCurrentUser(user) {
        sessionStorage.setItem('current_user', JSON.stringify(user));
    },
    clearCurrentUser() {
        sessionStorage.removeItem('current_user');
    }
};

// ============================================================
//  بيانات الأدمن المبدئية
// ============================================================
function initAdminUser() {
    const users = DB.getUsers();
    const adminExists = users.find(u => u.username === 'admin');
    if (!adminExists) {
        users.push({
            id: 0,
            fullName: 'مدير النظام',
            username: 'admin',
            password: hashPassword('admin123'),
            isAdmin: true
        });
        DB.setUsers(users);
    }
}

// ============================================================
//  دوال مساعدة
// ============================================================
function generateAccountNumber() {
    return 'SA-' + Date.now().toString().slice(-4) + '-' + 
           Math.floor(100000 + Math.random() * 900000) + '-' +
           Math.floor(1000 + Math.random() * 9000);
}

function hashPassword(pwd) {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
        const char = pwd.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'h_' + Math.abs(hash);
}

function formatCurrency(amount) {
    return amount.toFixed(2) + ' SDG';
}

function isUserBanned(username) {
    const banned = DB.getBannedUsers();
    return banned.includes(username);
}

// ============================================================
//  إدارة الصفحات
// ============================================================
function showLogin() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
}

function showRegister() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('registerPage').classList.add('active');
}

function showDashboard() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('dashboardPage').classList.add('active');
    updateDashboard();
}

// ============================================================
//  التسجيل
// ============================================================
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;

    if (!fullName || !username || !password) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    if (password !== confirm) {
        showNotification('كلمة المرور غير متطابقة', 'error');
        return;
    }
    if (username === 'admin') {
        showNotification('هذا الاسم محجوز للإدارة', 'error');
        return;
    }

    const users = DB.getUsers();
    if (users.find(u => u.username === username)) {
        showNotification('اسم المستخدم موجود مسبقاً', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        fullName,
        username,
        password: hashPassword(password)
    };
    users.push(newUser);
    DB.setUsers(users);

    const accounts = DB.getAccounts();
    const newAccount = {
        userId: newUser.id,
        accountNumber: generateAccountNumber(),
        balance: 1000.00
    };
    accounts.push(newAccount);
    DB.setAccounts(accounts);

    showNotification('تم إنشاء الحساب بنجاح!');
    document.getElementById('registerForm').reset();
    showLogin();
});

// ============================================================
//  تسجيل الدخول
// ============================================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showNotification('أدخل اسم المستخدم وكلمة المرور', 'error');
        return;
    }

    // التحقق من الحظر
    if (isUserBanned(username)) {
        showInsufficientNotification(0, 0, '😤', 'تم حظر حسابك من قبل الإدارة');
        return;
    }

    const users = DB.getUsers();
    const user = users.find(u => u.username === username && u.password === hashPassword(password));

    if (!user) {
        showNotification('بيانات دخول غير صحيحة', 'error');
        return;
    }

    DB.setCurrentUser(user);
    document.getElementById('loginForm').reset();
    showDashboard();
});

// ============================================================
//  تحديث لوحة التحكم
// ============================================================
function updateDashboard() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);

    if (account) {
        document.getElementById('balanceDisplay').textContent = formatCurrency(account.balance);
        document.getElementById('accountNumberDisplay').textContent = account.accountNumber;
    }

    // إظهار زر الأدمن إذا كان المستخدم أدمن
    if (user.isAdmin) {
        document.getElementById('adminPanelBtn').style.display = 'block';
    } else {
        document.getElementById('adminPanelBtn').style.display = 'none';
    }
}

// ============================================================
//  نسخ رقم الحساب
// ============================================================
function copyAccountNumber() {
    const number = document.getElementById('accountNumberDisplay').textContent;
    navigator.clipboard.writeText(number).then(() => {
        showNotification('تم نسخ رقم الحساب');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = number;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('تم نسخ رقم الحساب');
    });
}

// ============================================================
//  فتح وإغلاق المودالات
// ============================================================
function openTransfer() {
    document.getElementById('transferModal').classList.add('open');
    document.getElementById('transferForm').reset();
}

function openHistory() {
    const modal = document.getElementById('historyModal');
    modal.classList.add('open');
    renderHistory();
}

function openAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('open');
    renderAdminPanel();
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// إغلاق المودال عند النقر خارج المحتوى
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
});

// ============================================================
//  عرض سجل المعاملات
// ============================================================
function renderHistory() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const transactions = DB.getTransactions();
    const userTxs = transactions.filter(t => t.userId === user.id).reverse();

    const container = document.getElementById('historyList');

    if (userTxs.length === 0) {
        container.innerHTML = '<div class="history-empty">📭 لا توجد معاملات حتى الآن</div>';
        return;
    }

    container.innerHTML = userTxs.map(t => {
        let dirClass = 'out';
        let dirText = '⬆️ تحويل';
        let color = '#e74c3c';
        
        if (t.fromAccount === 'SYSTEM') {
            dirClass = 'in';
            dirText = '⬇️ إيداع';
            color = '#2ecc71';
        } else if (t.fromAccount === 'ADMIN') {
            dirClass = 'admin';
            dirText = '👑 إدارة';
            color = '#f39c12';
        }
        
        const amountSign = (t.fromAccount === 'SYSTEM' || t.fromAccount === 'ADMIN') ? '+' : '-';
        return `
            <div class="history-item">
                <div>
                    <div class="direction ${dirClass}">${dirText}</div>
                    <div class="date">${t.timestamp}</div>
                    ${t.note ? `<div style="font-size:12px;opacity:0.6;">📝 ${t.note}</div>` : ''}
                </div>
                <div>
                    <div class="amount" style="color:${color};">${amountSign} ${t.amount.toFixed(2)} SDG</div>
                    <div style="font-size:11px;opacity:0.5;">من: ${t.fromAccount} → إلى: ${t.toAccount}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
//  لوحة تحكم الأدمن
// ============================================================
function renderAdminPanel() {
    const users = DB.getUsers();
    const accounts = DB.getAccounts();
    const banned = DB.getBannedUsers();

    let html = `
        <div class="admin-actions">
            <button class="btn btn-success" onclick="refreshAdminPanel()">🔄 تحديث</button>
        </div>
        <table class="user-table">
            <thead>
                <tr>
                    <th>المستخدم</th>
                    <th>رقم الحساب</th>
                    <th>الرصيد</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(user => {
        if (user.isAdmin) return;

        const account = accounts.find(a => a.userId === user.id);
        const isBanned = banned.includes(user.username);
        const status = isBanned ? 'محظور' : 'نشط';
        const statusClass = isBanned ? 'banned' : 'active';

        html += `
            <tr>
                <td>${user.fullName}<br><small style="opacity:0.5;">@${user.username}</small></td>
                <td style="font-size:12px;">${account ? account.accountNumber : 'لا يوجد'}</td>
                <td>${account ? formatCurrency(account.balance) : '0.00 SDG'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <div class="action-btns">
                        ${isBanned ? 
                            `<button class="btn-unban" onclick="adminUnbanUser('${user.username}')">🔓 إلغاء حظر</button>` :
                            `<button class="btn-ban" onclick="adminBanUser('${user.username}')">🔒 حظر</button>`
                        }
                        <button class="btn-delete" onclick="adminDeleteUser(${user.id})">🗑️ حذف</button>
                        <button class="btn-add" onclick="adminAddBalance(${user.id})">💰 إضافة رصيد</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    document.getElementById('adminContent').innerHTML = html;
}

function refreshAdminPanel() {
    renderAdminPanel();
    showNotification('تم تحديث لوحة التحكم');
}

// ============================================================
//  وظائف الأدمن
// ============================================================
function adminBanUser(username) {
    const banned = DB.getBannedUsers();
    if (!banned.includes(username)) {
        banned.push(username);
        DB.setBannedUsers(banned);
        showNotification(`🔒 تم حظر المستخدم @${username}`);
        renderAdminPanel();
    }
}

function adminUnbanUser(username) {
    let banned = DB.getBannedUsers();
    banned = banned.filter(u => u !== username);
    DB.setBannedUsers(banned);
    showNotification(`🔓 تم إلغاء حظر المستخدم @${username}`);
    renderAdminPanel();
}

function adminDeleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم وجميع بياناته؟')) return;

    let users = DB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    users = users.filter(u => u.id !== userId);
    DB.setUsers(users);

    let accounts = DB.getAccounts();
    accounts = accounts.filter(a => a.userId !== userId);
    DB.setAccounts(accounts);

    let transactions = DB.getTransactions();
    transactions = transactions.filter(t => t.userId !== userId);
    DB.setTransactions(transactions);

    let banned = DB.getBannedUsers();
    banned = banned.filter(u => u !== user.username);
    DB.setBannedUsers(banned);

    showNotification(`🗑️ تم حذف المستخدم @${user.username}`);
    renderAdminPanel();
}

function adminAddBalance(userId) {
    const amount = prompt('أدخل المبلغ الذي تريد إضافته للمستخدم (SDG):');
    if (amount === null) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        showNotification('يجب إدخال مبلغ صحيح موجب', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === userId);
    if (!account) {
        showNotification('الحساب غير موجود', 'error');
        return;
    }

    account.balance += numAmount;
    DB.setAccounts(accounts);

    const transactions = DB.getTransactions();
    transactions.push({
        id: Date.now(),
        fromAccount: 'ADMIN',
        toAccount: account.accountNumber,
        amount: numAmount,
        note: 'إضافة رصيد من قبل الإدارة',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: userId
    });
    DB.setTransactions(transactions);

    showNotification(`💰 تم إضافة ${formatCurrency(numAmount)} للمستخدم`);
    renderAdminPanel();
    updateDashboard();
}

// ============================================================
//  إشعار "منبق" لعدم كفاية الرصيد
// ============================================================
function showInsufficientNotification(balance, required, emoji = '😤', customTitle = null) {
    const notif = document.getElementById('insufficientNotification');
    document.getElementById('insufficientBalance').textContent = formatCurrency(balance);
    document.getElementById('insufficientRequired').textContent = formatCurrency(required);
    document.getElementById('insufficientShortfall').textContent = formatCurrency(required - balance);
    
    if (customTitle) {
        document.querySelector('.insufficient-notification .title').textContent = customTitle;
        document.querySelector('.insufficient-notification .subtitle').textContent = '';
        document.querySelector('.insufficient-notification .emoji').textContent = emoji || '😤';
    } else {
        document.querySelector('.insufficient-notification .title').textContent = 'منبق!';
        document.querySelector('.insufficient-notification .subtitle').textContent = 'عفواً، رصيدك غير كافٍ لإتمام هذه العملية';
        document.querySelector('.insufficient-notification .emoji').textContent = emoji || '😤';
    }
    
    notif.classList.add('show');
}

function closeInsufficientNotification() {
    document.getElementById('insufficientNotification').classList.remove('show');
}

// ============================================================
//  التحويل
// ============================================================
document.getElementById('transferForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const toAccount = document.getElementById('transferToAccount').value.trim();
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const note = document.getElementById('transferNote').value.trim();

    if (!toAccount || !amount || amount <= 0) {
        showNotification('أدخل بيانات صحيحة', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const fromAccount = accounts.find(a => a.userId === user.id);
    if (!fromAccount) {
        showNotification('حسابك غير موجود', 'error');
        return;
    }

    // التحقق من كفاية الرصيد
    if (fromAccount.balance < amount) {
        showInsufficientNotification(fromAccount.balance, amount);
        return;
    }

    const toAccountData = accounts.find(a => a.accountNumber === toAccount);
    if (!toAccountData) {
        showNotification('رقم الحساب المستلم غير صحيح', 'error');
        return;
    }

    if (toAccountData.accountNumber === fromAccount.accountNumber) {
        showNotification('لا يمكن التحويل لنفس الحساب', 'error');
        return;
    }

    // تنفيذ التحويل
    fromAccount.balance -= amount;
    toAccountData.balance += amount;
    DB.setAccounts(accounts);

    // تسجيل المعاملة
    const transactions = DB.getTransactions();
    const tx = {
        id: Date.now(),
        fromAccount: fromAccount.accountNumber,
        toAccount: toAccountData.accountNumber,
        amount: amount,
        note: note || '-',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id
    };
    transactions.push(tx);
    DB.setTransactions(transactions);

    // إظهار الإشعار
    showTransferNotification(tx, fromAccount.accountNumber, toAccountData.accountNumber);

    closeModal('transferModal');
    updateDashboard();
});

// ============================================================
//  إشعار التحويل مع زر التنزيل
// ============================================================
let lastTransaction = null;

function showTransferNotification(tx, fromAcc, toAcc) {
    lastTransaction = tx;
    const notif = document.getElementById('transferNotification');
    document.getElementById('notifMessage').textContent = '✅ تم التحويل بنجاح';
    document.getElementById('notifSub').textContent = `المبلغ: ${tx.amount.toFixed(2)} SDG إلى حساب: ${toAcc}`;
    notif.classList.add('show');

    setTimeout(() => {
        closeNotification();
    }, 10000);
}

function closeNotification() {
    document.getElementById('transferNotification').classList.remove('show');
}

// ============================================================
//  تنزيل الإيصال كصورة
// ============================================================
function downloadReceipt() {
    if (!lastTransaction) {
        showNotification('لا توجد معاملة لتنزيل إيصالها', 'error');
        return;
    }

    const tx = lastTransaction;
    const user = DB.getCurrentUser();
    const accounts = DB.getAccounts();
    const fromAccount = accounts.find(a => a.userId === user.id);
    const balanceAfter = fromAccount ? fromAccount.balance : 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 400;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 28px "Segoe UI", Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ قنديل الزمان', width / 2, 60);

    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(width - 30, 80);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 20px "Segoe UI", Tahoma, sans-serif';
    ctx.fillText('إيصال تحويل بنكي', width / 2, 120);

    ctx.textAlign = 'right';
    ctx.font = '16px "Segoe UI", Tahoma, sans-serif';
    ctx.fillStyle = '#333';

    const details = [
        { label: 'التاريخ:', value: tx.timestamp },
        { label: 'من حساب:', value: tx.fromAccount },
        { label: 'إلى حساب:', value: tx.toAccount },
        { label: 'المبلغ:', value: tx.amount.toFixed(2) + ' SDG' },
        { label: 'الملاحظات:', value: tx.note || '-' },
        { label: 'الرصيد المتبقي:', value: balanceAfter.toFixed(2) + ' SDG' }
    ];

    let y = 170;
    details.forEach(d => {
        ctx.fillStyle = '#555';
        ctx.font = 'bold 14px "Segoe UI", Tahoma, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(d.label, width - 40, y);
        ctx.fillStyle = '#1a1a2e';
        ctx.font = '14px "Segoe UI", Tahoma, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(d.value, 40, y);
        y += 35;
    });

    ctx.beginPath();
    ctx.moveTo(30, y + 20);
    ctx.lineTo(width - 30, y + 20);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#777';
    ctx.font = '12px "Segoe UI", Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('تم التحويل عبر قنديل الزمان - جميع الحقوق محفوظة', width / 2, y + 60);

    ctx.fillStyle = '#f0c040';
    ctx.fillRect(30, height - 50, width - 60, 30);
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 14px "Segoe UI", Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ معتمد', width / 2, height - 30);

    const link = document.createElement('a');
    link.download = `إيصال_تحويل_${tx.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showNotification('تم تنزيل الإيصال كصورة');
}

// ============================================================
//  إشعارات عامة
// ============================================================
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
        color: white; padding: 15px 30px; border-radius: 30px;
        font-weight: 600; z-index: 3000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: slideUp 0.4s ease;
        direction: rtl;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ============================================================
//  تسجيل الخروج
// ============================================================
function logout() {
    DB.clearCurrentUser();
    showLogin();
}

// ============================================================
//  تهيئة التطبيق
// ============================================================
initAdminUser();

const currentUser = DB.getCurrentUser();
if (currentUser) {
    if (isUserBanned(currentUser.username)) {
        showInsufficientNotification(0, 0, '😤', 'تم حظر حسابك من قبل الإدارة');
        DB.clearCurrentUser();
        showLogin();
    } else {
        showDashboard();
    }
} else {
    showLogin();
}

// ============================================================
//  بيانات تجريبية (اختياري)
// ============================================================
function seedDemoData() {
    const users = DB.getUsers();
    if (users.length === 1) {
        const u1 = { id: 1001, fullName: 'أحمد محمد', username: 'ahmed', password: hashPassword('123456') };
        const u2 = { id: 1002, fullName: 'سارة علي', username: 'sara', password: hashPassword('123456') };
        users.push(u1, u2);
        DB.setUsers(users);

        const accounts = DB.getAccounts();
        accounts.push({ userId: u1.id, accountNumber: 'SA-1234-567890-123', balance: 5000 });
        accounts.push({ userId: u2.id, accountNumber: 'SA-9876-543210-987', balance: 3000 });
        DB.setAccounts(accounts);

        const txs = DB.getTransactions();
        txs.push({
            id: Date.now(),
            fromAccount: 'SYSTEM',
            toAccount: 'SA-1234-567890-123',
            amount: 1000,
            note: 'مكافأة ترحيبية',
            timestamp: new Date().toLocaleString('ar-SA'),
            userId: u1.id
        });
        DB.setTransactions(txs);
    }
}
// لإضافة بيانات تجريبية، قم بإلغاء تعليق السطر التالي:
// seedDemoData();
