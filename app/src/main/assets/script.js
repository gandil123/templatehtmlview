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
    getCards() {
        return JSON.parse(localStorage.getItem('bank_cards')) || [];
    },
    setCards(cards) {
        localStorage.setItem('bank_cards', JSON.stringify(cards));
    },
    getBills() {
        return JSON.parse(localStorage.getItem('bank_bills')) || [];
    },
    setBills(bills) {
        localStorage.setItem('bank_bills', JSON.stringify(bills));
    },
    getSubsidies() {
        return JSON.parse(localStorage.getItem('bank_subsidies')) || [];
    },
    setSubsidies(subsidies) {
        localStorage.setItem('bank_subsidies', JSON.stringify(subsidies));
    },
    getBranches() {
        return JSON.parse(localStorage.getItem('bank_branches')) || [];
    },
    setBranches(branches) {
        localStorage.setItem('bank_branches', JSON.stringify(branches));
    },
    getOffers() {
        return JSON.parse(localStorage.getItem('bank_offers')) || [];
    },
    setOffers(offers) {
        localStorage.setItem('bank_offers', JSON.stringify(offers));
    },
    getNotifications() {
        return JSON.parse(localStorage.getItem('bank_notifications')) || [];
    },
    setNotifications(notifications) {
        localStorage.setItem('bank_notifications', JSON.stringify(notifications));
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
//  دوال مساعدة
// ============================================================
function generateAccountNumber() {
    return 'SA' + String(Math.floor(100000000000 + Math.random() * 900000000000));
}

function generateCardNumber() {
    let card = '';
    for (let i = 0; i < 16; i++) {
        card += Math.floor(Math.random() * 10);
        if (i === 3 || i === 7 || i === 11) card += ' ';
    }
    return card;
}

function generateExpiry() {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(Math.floor(Math.random() * 5) + 24);
    return month + '/' + year;
}

function generateCVV() {
    return String(Math.floor(100 + Math.random() * 900));
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

function formatCurrency(amount, currency = 'SDG') {
    return amount.toFixed(2) + ' ' + currency;
}

function getExchangeRate(from, to) {
    const rates = {
        'SDG_USD': 0.0017,
        'SDG_EUR': 0.0015,
        'USD_SDG': 588.00,
        'USD_EUR': 0.92,
        'EUR_SDG': 665.00,
        'EUR_USD': 1.09
    };
    const key = from + '_' + to;
    return rates[key] || 1;
}

// ============================================================
//  تهيئة البيانات الأولية
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
            isAdmin: true,
            accountType: 'إدارة'
        });
        DB.setUsers(users);
    }
}

function initBranches() {
    const branches = DB.getBranches();
    if (branches.length === 0) {
        const defaultBranches = [
            { id: 1, name: 'الفرع الرئيسي', address: 'شارع النيل، الخرطوم', hours: '8:00 ص - 5:00 م', phone: '123456789' },
            { id: 2, name: 'فرع أم درمان', address: 'شارع السوق، أم درمان', hours: '8:00 ص - 4:00 م', phone: '987654321' },
            { id: 3, name: 'فرع الخرطوم بحري', address: 'شارع الصناعة، الخرطوم بحري', hours: '9:00 ص - 3:00 م', phone: '456789123' },
            { id: 4, name: 'فرع بورتسودان', address: 'شارع البحر الأحمر، بورتسودان', hours: '8:00 ص - 2:00 م', phone: '789123456' }
        ];
        DB.setBranches(defaultBranches);
    }
}

function initOffers() {
    const offers = DB.getOffers();
    if (offers.length === 0) {
        const defaultOffers = [
            { id: 1, title: '🎉 10% عائد على الودائع', desc: 'احصل على 10% عائد سنوي على ودائعك الجديدة' },
            { id: 2, title: '💳 بطاقة بلاستيكية مجانية', desc: 'احصل على بطاقة جديدة مجاناً عند فتح حساب' },
            { id: 3, title: '🌍 تحويلات دولية بدون رسوم', desc: 'تحويلات دولية بدون رسوم حتى نهاية العام' },
            { id: 4, title: '🏠 قروض سكنية بفائدة 5%', desc: 'قروض سكنية بفائدة 5% فقط لفترة محدودة' }
        ];
        DB.setOffers(defaultOffers);
    }
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

function showMorePage() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('morePage').classList.add('active');
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
    const accountType = document.getElementById('regAccountType').value;
    const currency = document.getElementById('regCurrency').value;

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
        password: hashPassword(password),
        accountType: accountType,
        currency: currency
    };
    users.push(newUser);
    DB.setUsers(users);

    const accounts = DB.getAccounts();
    const newAccount = {
        userId: newUser.id,
        accountNumber: generateAccountNumber(),
        cardNumber: generateCardNumber(),
        cardExpiry: generateExpiry(),
        cvv: generateCVV(),
        balance: 1000.00,
        accountType: accountType,
        currency: currency,
        isActive: true
    };
    accounts.push(newAccount);
    DB.setAccounts(accounts);

    // إنشاء بطاقة افتراضية
    const cards = DB.getCards();
    cards.push({
        id: Date.now(),
        userId: newUser.id,
        cardNumber: generateCardNumber(),
        cardType: 'فيزا كلاسيك',
        expiry: generateExpiry(),
        status: 'نشط',
        isDefault: true
    });
    DB.setCards(cards);

    showNotification('✅ تم إنشاء الحساب بنجاح!');
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

    const banned = DB.getBannedUsers();
    if (banned.includes(username)) {
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

    document.getElementById('userNameDisplay').textContent = user.fullName;
    document.getElementById('userTypeDisplay').textContent = user.accountType || 'جاري';

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);

    if (account) {
        document.getElementById('totalBalanceDisplay').innerHTML = 
            account.balance.toFixed(2) + ' <span class="currency">' + (account.currency || 'SDG') + '</span>';
        
        const cardContainer = document.getElementById('cardContainer');
        if (account.accountType === 'جاري') {
            cardContainer.style.display = 'block';
            document.getElementById('cardNumberDisplay').textContent = account.cardNumber || generateCardNumber();
            document.getElementById('cardHolderName').textContent = user.fullName;
            document.getElementById('cardExpiry').textContent = account.cardExpiry || generateExpiry();
        } else {
            cardContainer.style.display = 'none';
        }
    }

    renderRecentHistory();
    updateStats();
    updateNotifications();
}

// ============================================================
//  تحديث الإحصائيات
// ============================================================
function updateStats() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const transactions = DB.getTransactions();
    const userTxs = transactions.filter(t => t.userId === user.id);

    document.getElementById('txCount').textContent = userTxs.length;

    const deposits = userTxs.filter(t => t.fromAccount === 'SYSTEM' || t.fromAccount === 'ADMIN');
    const maxDeposit = deposits.reduce((max, t) => t.amount > max ? t.amount : max, 0);
    document.getElementById('maxDeposit').textContent = formatCurrency(maxDeposit);

    const withdrawals = userTxs.filter(t => t.fromAccount !== 'SYSTEM' && t.fromAccount !== 'ADMIN' && t.fromAccount !== user.id);
    const maxWithdraw = withdrawals.reduce((max, t) => t.amount > max ? t.amount : max, 0);
    document.getElementById('maxWithdraw').textContent = formatCurrency(maxWithdraw);
}

// ============================================================
//  عرض المعاملات الأخيرة
// ============================================================
function renderRecentHistory() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const transactions = DB.getTransactions();
    const userTxs = transactions.filter(t => t.userId === user.id).slice(-5).reverse();

    const container = document.getElementById('recentHistory');

    if (userTxs.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد معاملات</div>';
        return;
    }

    container.innerHTML = userTxs.map(t => {
        const isPositive = t.fromAccount === 'SYSTEM' || t.fromAccount === 'ADMIN';
        const sign = isPositive ? '+' : '-';
        const cls = isPositive ? 'positive' : 'negative';
        return `
            <div class="history-item">
                <div class="info">
                    <div class="desc">${t.note || (isPositive ? 'إيداع' : 'تحويل')}</div>
                    <div class="date">${t.timestamp}</div>
                    ${t.fromAccount !== 'SYSTEM' && t.fromAccount !== 'ADMIN' ? `<div class="details">من: ${t.fromAccount} → إلى: ${t.toAccount}</div>` : ''}
                </div>
                <div class="amount ${cls}">${sign} ${t.amount.toFixed(2)} ${t.currency || 'SDG'}</div>
            </div>
        `;
    }).join('');
}

// ============================================================
//  عرض كل المعاملات
// ============================================================
function showAllHistory() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const transactions = DB.getTransactions();
    const userTxs = transactions.filter(t => t.userId === user.id).reverse();

    const container = document.getElementById('fullHistory');

    if (userTxs.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد معاملات</div>';
    } else {
        container.innerHTML = userTxs.map(t => {
            const isPositive = t.fromAccount === 'SYSTEM' || t.fromAccount === 'ADMIN';
            const sign = isPositive ? '+' : '-';
            const cls = isPositive ? 'positive' : 'negative';
            return `
                <div class="history-item">
                    <div class="info">
                        <div class="desc">${t.note || (isPositive ? 'إيداع' : 'تحويل')}</div>
                        <div class="date">${t.timestamp}</div>
                        <div class="details">من: ${t.fromAccount} → إلى: ${t.toAccount}</div>
                    </div>
                    <div class="amount ${cls}">${sign} ${t.amount.toFixed(2)} ${t.currency || 'SDG'}</div>
                </div>
            `;
        }).join('');
    }

    openModal('historyModal');
}

// ============================================================
//  فتح وإغلاق المودالات
// ============================================================
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
});

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

    const transactions = DB.getTransactions();
    const tx = {
        id: Date.now(),
        fromAccount: fromAccount.accountNumber,
        toAccount: toAccountData.accountNumber,
        amount: amount,
        note: note || 'تحويل',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id,
        currency: fromAccount.currency || 'SDG'
    };
    transactions.push(tx);
    DB.setTransactions(transactions);

    // إضافة إشعار
    const notifications = DB.getNotifications();
    notifications.push({
        id: Date.now(),
        userId: user.id,
        message: `✅ تم تحويل ${amount.toFixed(2)} ${fromAccount.currency || 'SDG'} إلى حساب ${toAccount}`,
        timestamp: new Date().toLocaleString('ar-SA'),
        read: false
    });
    DB.setNotifications(notifications);

    showNotification(`✅ تم تحويل ${amount.toFixed(2)} ${fromAccount.currency || 'SDG'} بنجاح`);
    closeModal('transferModal');
    updateDashboard();
});

// ============================================================
//  فواتير الخدمات
// ============================================================
function openBills() {
    openModal('billsModal');
}

function payBill(service) {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const amount = parseFloat(prompt(`أدخل مبلغ فاتورة ${service}:`));
    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (!account) {
        showNotification('حسابك غير موجود', 'error');
        return;
    }

    if (account.balance < amount) {
        showInsufficientNotification(account.balance, amount);
        return;
    }

    account.balance -= amount;
    DB.setAccounts(accounts);

    const transactions = DB.getTransactions();
    transactions.push({
        id: Date.now(),
        fromAccount: account.accountNumber,
        toAccount: 'BILL_' + service,
        amount: amount,
        note: `دفع فاتورة ${service}`,
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id,
        currency: account.currency || 'SDG'
    });
    DB.setTransactions(transactions);

    showNotification(`✅ تم دفع فاتورة ${service} بقيمة ${amount.toFixed(2)} ${account.currency || 'SDG'}`);
    closeModal('billsModal');
    updateDashboard();
}

// ============================================================
//  إدارة البطاقات
// ============================================================
function openCards() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const cards = DB.getCards();
    const userCards = cards.filter(c => c.userId === user.id);

    const container = document.getElementById('cardsList');
    
    if (userCards.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد بطاقات</div>';
    } else {
        container.innerHTML = userCards.map(c => `
            <div class="card-item">
                <div class="card-info">
                    <div class="number">${c.cardNumber}</div>
                    <div class="type">${c.cardType} • ${c.expiry}</div>
                </div>
                <div>
                    <span class="card-status ${c.status === 'نشط' ? 'active' : 'blocked'}">${c.status}</span>
                    <div class="card-actions">
                        ${c.status === 'نشط' ? 
                            `<button onclick="blockCard(${c.id})" title="حظر">🔒</button>` :
                            `<button onclick="unblockCard(${c.id})" title="إلغاء حظر">🔓</button>`
                        }
                        ${c.isDefault ? '' : `<button onclick="setDefaultCard(${c.id})" title="تعيين كبطاقة افتراضية">⭐</button>`}
                    </div>
                </div>
            </div>
        `).join('');
    }

    openModal('cardsModal');
}

function addNewCard() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const cardType = prompt('اختر نوع البطاقة (فيزا كلاسيك، فيزا ذهبية، ماستركارد):');
    if (!cardType) return;

    const cards = DB.getCards();
    cards.push({
        id: Date.now(),
        userId: user.id,
        cardNumber: generateCardNumber(),
        cardType: cardType,
        expiry: generateExpiry(),
        status: 'نشط',
        isDefault: false
    });
    DB.setCards(cards);

    showNotification('✅ تم إضافة البطاقة بنجاح');
    openCards();
}

function blockCard(cardId) {
    const cards = DB.getCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.status = 'محظور';
        DB.setCards(cards);
        showNotification('🔒 تم حظر البطاقة');
        openCards();
    }
}

function unblockCard(cardId) {
    const cards = DB.getCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.status = 'نشط';
        DB.setCards(cards);
        showNotification('🔓 تم إلغاء حظر البطاقة');
        openCards();
    }
}

function setDefaultCard(cardId) {
    const cards = DB.getCards();
    cards.forEach(c => c.isDefault = false);
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.isDefault = true;
        DB.setCards(cards);
        showNotification('⭐ تم تعيين البطاقة كبطاقة افتراضية');
        openCards();
    }
}

// ============================================================
//  الحوالات الدولية
// ============================================================
function openInternational() {
    const rates = document.getElementById('exchangeRates');
    rates.innerHTML = `
        <div class="rate-row"><span>🇸🇩 SDG → 🇺🇸 USD</span><span>1 SDG = 0.0017 USD</span></div>
        <div class="rate-row"><span>🇺🇸 USD → 🇸🇩 SDG</span><span>1 USD = 588 SDG</span></div>
        <div class="rate-row"><span>🇸🇩 SDG → 🇪🇺 EUR</span><span>1 SDG = 0.0015 EUR</span></div>
        <div class="rate-row"><span>🇪🇺 EUR → 🇸🇩 SDG</span><span>1 EUR = 665 SDG</span></div>
        <div class="rate-row"><span>🇺🇸 USD → 🇪🇺 EUR</span><span>1 USD = 0.92 EUR</span></div>
        <div class="rate-row"><span>🇪🇺 EUR → 🇺🇸 USD</span><span>1 EUR = 1.09 USD</span></div>
    `;
    openModal('internationalModal');
}

document.getElementById('internationalForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const fromCurrency = document.getElementById('sendCurrency').value;
    const toCurrency = document.getElementById('receiveCurrency').value;
    const amount = parseFloat(document.getElementById('internationalAmount').value);
    const toAccount = document.getElementById('internationalAccount').value.trim();

    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    if (!toAccount) {
        showNotification('أدخل رقم الحساب الدولي', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (!account) {
        showNotification('حسابك غير موجود', 'error');
        return;
    }

    const rate = getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    if (account.balance < amount) {
        showInsufficientNotification(account.balance, amount);
        return;
    }

    account.balance -= amount;
    DB.setAccounts(accounts);

    const transactions = DB.getTransactions();
    transactions.push({
        id: Date.now(),
        fromAccount: account.accountNumber,
        toAccount: 'INTL_' + toAccount,
        amount: amount,
        note: `حوالة دولية: ${amount} ${fromCurrency} → ${convertedAmount.toFixed(2)} ${toCurrency}`,
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id,
        currency: fromCurrency
    });
    DB.setTransactions(transactions);

    showNotification(`✅ تم تنفيذ الحوالة الدولية: ${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
    closeModal('internationalModal');
    updateDashboard();
});

// ============================================================
//  خدمة العملاء
// ============================================================
function openSupport() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = `
        <div class="chat-message support">👋 مرحباً بك في خدمة عملاء بنك الياد! كيف يمكنني مساعدتك؟</div>
    `;
    openModal('supportModal');
}

document.getElementById('supportForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const message = document.getElementById('supportMessage').value.trim();
    if (!message) return;

    const container = document.getElementById('chatMessages');
    container.innerHTML += `
        <div class="chat-message user">${message}</div>
    `;

    document.getElementById('supportMessage').value = '';

    // رد تلقائي
    setTimeout(() => {
        const responses = [
            'شكراً لتواصلك معنا. سيتم الرد عليك قريباً.',
            'تم استلام رسالتك، سنقوم بمعالجتها في أقرب وقت.',
            'نعتذر عن التأخير، فريق الدعم يعمل على حل مشكلتك.',
            'يرجى الانتظار، سيتم تحويلك إلى أحد المختصين.'
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        container.innerHTML += `
            <div class="chat-message support">🤖 ${reply}</div>
        `;
        container.scrollTop = container.scrollHeight;
    }, 1000);

    container.scrollTop = container.scrollHeight;
});

// ============================================================
//  الفروع
// ============================================================
function openBranches() {
    const branches = DB.getBranches();
    const container = document.getElementById('branchesList');
    
    container.innerHTML = branches.map(b => `
        <div class="branch-item">
            <div class="branch-name">${b.name}</div>
            <div class="branch-address">📍 ${b.address}</div>
            <div class="branch-hours">🕐 ${b.hours} | 📞 ${b.phone}</div>
        </div>
    `).join('');

    openModal('branchesModal');
}

// ============================================================
//  الإعانات
// ============================================================
function openSubsidies() {
    const subsidies = DB.getSubsidies();
    const container = document.getElementById('subsidiesList');
    
    if (subsidies.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد إعانات حالياً</div>';
    } else {
        container.innerHTML = subsidies.map(s => `
            <div class="subsidy-item">
                <div class="subsidy-name">${s.name}</div>
                <div class="subsidy-amount">${s.amount} ${s.currency}</div>
                <div class="subsidy-status">الحالة: ${s.status}</div>
            </div>
        `).join('');
    }

    openModal('subsidiesModal');
}

function requestSubsidy() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const name = prompt('أدخل اسم الإعانة المطلوبة:');
    if (!name) return;

    const amount = parseFloat(prompt('أدخل قيمة الإعانة:'));
    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    const subsidies = DB.getSubsidies();
    subsidies.push({
        id: Date.now(),
        userId: user.id,
        name: name,
        amount: amount,
        currency: 'SDG',
        status: 'قيد المراجعة',
        date: new Date().toLocaleString('ar-SA')
    });
    DB.setSubsidies(subsidies);

    showNotification('✅ تم طلب الإعانة بنجاح، سيتم مراجعتها');
    openSubsidies();
}

// ============================================================
//  العروض
// ============================================================
function showOffers() {
    const offers = DB.getOffers();
    const container = document.getElementById('offersList');
    
    container.innerHTML = offers.map(o => `
        <div class="offer-item">
            <div class="offer-title">${o.title}</div>
            <div class="offer-desc">${o.desc}</div>
        </div>
    `).join('');

    openModal('offersModal');
}

// ============================================================
//  خدمات القبول
// ============================================================
function openPayments() {
    const amount = parseFloat(prompt('أدخل المبلغ المطلوب تحصيله:'));
    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    const qrCode = `BANK_AL_YAD_PAYMENT_${Date.now()}_${amount}`;
    showNotification(`✅ تم إنشاء رمز الدفع: ${qrCode}\nالمبلغ: ${amount.toFixed(2)} SDG`);
}

// ============================================================
//  الإيداع والسحب السريع
// ============================================================
function quickDeposit() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const amount = parseFloat(prompt('أدخل مبلغ الإيداع:'));
    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (!account) return;

    account.balance += amount;
    DB.setAccounts(accounts);

    const transactions = DB.getTransactions();
    transactions.push({
        id: Date.now(),
        fromAccount: 'SYSTEM',
        toAccount: account.accountNumber,
        amount: amount,
        note: 'إيداع نقدي',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id,
        currency: account.currency || 'SDG'
    });
    DB.setTransactions(transactions);

    showNotification(`💰 تم إيداع ${amount.toFixed(2)} ${account.currency || 'SDG'} بنجاح`);
    updateDashboard();
}

function quickWithdraw() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const amount = parseFloat(prompt('أدخل مبلغ السحب:'));
    if (!amount || amount <= 0) {
        showNotification('أدخل مبلغ صحيح', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (!account) return;

    if (account.balance < amount) {
        showInsufficientNotification(account.balance, amount);
        return;
    }

    account.balance -= amount;
    DB.setAccounts(accounts);

    const transactions = DB.getTransactions();
    transactions.push({
        id: Date.now(),
        fromAccount: account.accountNumber,
        toAccount: 'ATM_WITHDRAWAL',
        amount: amount,
        note: 'سحب نقدي',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: user.id,
        currency: account.currency || 'SDG'
    });
    DB.setTransactions(transactions);

    showNotification(`🏧 تم سحب ${amount.toFixed(2)} ${account.currency || 'SDG'} بنجاح`);
    updateDashboard();
}

// ============================================================
//  إشعار "منبق"
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
//  إشعارات عامة
// ============================================================
function showNotification(message, type = 'success') {
    const notif = document.getElementById('transferNotification');
    document.getElementById('notifMessage').textContent = type === 'error' ? '❌ خطأ' : '✅ نجاح';
    document.getElementById('notifSub').textContent = message;
    notif.classList.add('show');

    setTimeout(() => {
        closeNotification();
    }, 4000);
}

function closeNotification() {
    document.getElementById('transferNotification').classList.remove('show');
}

// ============================================================
//  تحديث الإشعارات
// ============================================================
function updateNotifications() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const notifications = DB.getNotifications();
    const unread = notifications.filter(n => n.userId === user.id && !n.read);
    document.getElementById('notifCount').textContent = unread.length;
}

function toggleNotifications() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const notifications = DB.getNotifications();
    const userNotifs = notifications.filter(n => n.userId === user.id);

    if (userNotifs.length === 0) {
        showNotification('📬 لا توجد إشعارات');
        return;
    }

    let message = '📬 الإشعارات:\n';
    userNotifs.forEach(n => {
        message += `• ${n.message}\n  (${n.timestamp})\n`;
        n.read = true;
    });
    DB.setNotifications(notifications);
    updateNotifications();
    alert(message);
}

// ============================================================
//  عرض الرصيد
// ============================================================
function showBalance() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (account) {
        showNotification(`💰 رصيدك الحالي: ${account.balance.toFixed(2)} ${account.currency || 'SDG'}`);
    }
}

// ============================================================
//  تأثير النقود المتطايرة
// ============================================================
function triggerFlyingMoney(event) {
    const emojis = ['💵', '💰', '💸', '🪙', '💎', '💲', '🤑'];
    const count = 20;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'flying-money';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height;
        
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        const tx = (Math.random() - 0.5) * 500;
        const ty = -Math.random() * 400 - 100;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        
        el.style.fontSize = (20 + Math.random() * 25) + 'px';
        
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

// ============================================================
//  إدارة الحساب - عرض الرصيد الكامل
// ============================================================
function getTotalBalance() {
    const user = DB.getCurrentUser();
    if (!user) return '0.00 SDG';
    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    return account ? formatCurrency(account.balance, account.currency || 'SDG') : '0.00 SDG';
}

// ============================================================
//  لوحة تحكم الأدمن
// ============================================================
function openAdminPanel() {
    const user = DB.getCurrentUser();
    if (!user || !user.isAdmin) {
        showNotification('❌ غير مصرح لك بالوصول إلى لوحة الإدارة', 'error');
        return;
    }

    renderAdminPanel();
    openModal('adminModal');
}

function renderAdminPanel() {
    const users = DB.getUsers();
    const accounts = DB.getAccounts();
    const transactions = DB.getTransactions();
    const banned = DB.getBannedUsers();

    const totalUsers = users.filter(u => !u.isAdmin).length;
    const totalAccounts = accounts.length;
    const totalTransactions = transactions.length;

    let html = `
        <div class="admin-stats">
            <div class="admin-stat">
                <div class="admin-stat-value">${totalUsers}</div>
                <div class="admin-stat-label">👥 المستخدمين</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat-value">${totalAccounts}</div>
                <div class="admin-stat-label">💳 الحسابات</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat-value">${totalTransactions}</div>
                <div class="admin-stat-label">📊 المعاملات</div>
            </div>
        </div>
        <div class="admin-actions">
            <button class="btn btn-primary" onclick="refreshAdminPanel()">🔄 تحديث</button>
            <button class="btn btn-primary" onclick="exportData()">📤 تصدير البيانات</button>
            <button class="btn btn-danger" onclick="clearAllData()">🗑️ مسح الكل</button>
        </div>
        <table class="user-table">
            <thead>
                <tr>
                    <th>المستخدم</th>
                    <th>رقم الحساب</th>
                    <th>الرصيد</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.filter(u => !u.isAdmin).forEach(user => {
        const account = accounts.find(a => a.userId === user.id);
        const isBanned = banned.includes(user.username);
        const status = isBanned ? 'محظور' : 'نشط';
        const statusClass = isBanned ? 'banned' : 'active';

        html += `
            <tr>
                <td>${user.fullName}<br><small>@${user.username}</small></td>
                <td style="font-size:11px;">${account ? account.accountNumber : 'لا يوجد'}</td>
                <td>${account ? formatCurrency(account.balance, account.currency || 'SDG') : '0.00 SDG'}</td>
                <td style="font-size:12px;">${user.accountType || 'جاري'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <div class="action-btns">
                        ${isBanned ? 
                            `<button class="btn-unban" onclick="adminUnbanUser('${user.username}')">🔓</button>` :
                            `<button class="btn-ban" onclick="adminBanUser('${user.username}')">🔒</button>`
                        }
                        <button class="btn-delete" onclick="adminDeleteUser(${user.id})">🗑️</button>
                        <button class="btn-add" onclick="adminAddBalance(${user.id})">💰</button>
                        <button class="btn-edit" onclick="adminEditUser(${user.id})">✏️</button>
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
    showNotification('🔄 تم تحديث لوحة الإدارة');
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
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المستخدم وجميع بياناته؟')) return;

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

    let cards = DB.getCards();
    cards = cards.filter(c => c.userId !== userId);
    DB.setCards(cards);

    let banned = DB.getBannedUsers();
    banned = banned.filter(u => u !== user.username);
    DB.setBannedUsers(banned);

    showNotification(`🗑️ تم حذف المستخدم @${user.username}`);
    renderAdminPanel();
}

function adminAddBalance(userId) {
    const amount = prompt('💰 أدخل المبلغ الذي تريد إضافته للمستخدم (SDG):');
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
        note: '💰 إضافة رصيد من قبل الإدارة',
        timestamp: new Date().toLocaleString('ar-SA'),
        userId: userId,
        currency: account.currency || 'SDG'
    });
    DB.setTransactions(transactions);

    showNotification(`💰 تم إضافة ${formatCurrency(numAmount, account.currency || 'SDG')} للمستخدم`);
    renderAdminPanel();
    updateDashboard();
}

function adminEditUser(userId) {
    const users = DB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('✏️ أدخل الاسم الجديد:', user.fullName);
    if (newName && newName.trim()) {
        user.fullName = newName.trim();
        DB.setUsers(users);
        showNotification('✅ تم تحديث الاسم');
        renderAdminPanel();
    }
}

function exportData() {
    const data = {
        users: DB.getUsers(),
        accounts: DB.getAccounts(),
        transactions: DB.getTransactions(),
        cards: DB.getCards(),
        branches: DB.getBranches(),
        offers: DB.getOffers()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_al_yad_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('📤 تم تصدير البيانات بنجاح');
}

function clearAllData() {
    if (!confirm('⚠️ تحذير: سيتم حذف جميع البيانات! هل أنت متأكد؟')) return;
    if (!confirm('⛔ تأكيد نهائي: هل تريد حذف كل شيء؟')) return;

    localStorage.clear();
    showNotification('🗑️ تم مسح جميع البيانات');
    setTimeout(() => {
        location.reload();
    }, 1500);
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
initBranches();
initOffers();

const currentUser = DB.getCurrentUser();
if (currentUser) {
    const banned = DB.getBannedUsers();
    if (banned.includes(currentUser.username)) {
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
        const u1 = { id: 1001, fullName: 'أحمد محمد', username: 'ahmed', password: hashPassword('123456'), accountType: 'جاري', currency: 'SDG' };
        const u2 = { id: 1002, fullName: 'سارة علي', username: 'sara', password: hashPassword('123456'), accountType: 'ادخار', currency: 'SDG' };
        const u3 = { id: 1003, fullName: 'محمد خالد', username: 'mohammed', password: hashPassword('123456'), accountType: 'مرتب', currency: 'USD' };
        users.push(u1, u2, u3);
        DB.setUsers(users);

        const accounts = DB.getAccounts();
        accounts.push({ 
            userId: u1.id, 
            accountNumber: 'SA123456789012', 
            cardNumber: '5246 7812 3456 7890',
            cardExpiry: '06/25',
            cvv: '123',
            balance: 5000,
            accountType: 'جاري',
            currency: 'SDG',
            isActive: true
        });
        accounts.push({ 
            userId: u2.id, 
            accountNumber: 'SA987654321098', 
            cardNumber: '9876 5432 1098 7654',
            cardExpiry: '09/26',
            cvv: '456',
            balance: 3000,
            accountType: 'ادخار',
            currency: 'SDG',
            isActive: true
        });
        accounts.push({ 
            userId: u3.id, 
            accountNumber: 'SA555555555555', 
            cardNumber: '1111 2222 3333 4444',
            cardExpiry: '12/27',
            cvv: '789',
            balance: 1500,
            accountType: 'مرتب',
            currency: 'USD',
            isActive: true
        });
        DB.setAccounts(accounts);

        const txs = DB.getTransactions();
        txs.push({
            id: Date.now(),
            fromAccount: 'SYSTEM',
            toAccount: 'SA123456789012',
            amount: 1000,
            note: '🎁 مكافأة ترحيبية',
            timestamp: new Date().toLocaleString('ar-SA'),
            userId: u1.id,
            currency: 'SDG'
        });
        DB.setTransactions(txs);

        const cards = DB.getCards();
        cards.push({ id: Date.now(), userId: u1.id, cardNumber: '5246 7812 3456 7890', cardType: 'فيزا كلاسيك', expiry: '06/25', status: 'نشط', isDefault: true });
        cards.push({ id: Date.now() + 1, userId: u2.id, cardNumber: '9876 5432 1098 7654', cardType: 'فيزا ذهبية', expiry: '09/26', status: 'نشط', isDefault: true });
        cards.push({ id: Date.now() + 2, userId: u3.id, cardNumber: '1111 2222 3333 4444', cardType: 'ماستركارد', expiry: '12/27', status: 'نشط', isDefault: true });
        DB.setCards(cards);
    }
}
// لإضافة بيانات تجريبية، قم بإلغاء تعليق السطر التالي:
// seedDemoData();
