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
    getMessages() {
        return JSON.parse(localStorage.getItem('bank_messages')) || [];
    },
    setMessages(messages) {
        localStorage.setItem('bank_messages', JSON.stringify(messages));
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

function getCardColor(type) {
    switch(type) {
        case 'كلاسيك': return 'classic';
        case 'ذهبية': return 'gold';
        default: return 'normal';
    }
}

function getCardEmoji(type) {
    switch(type) {
        case 'كلاسيك': return '💳';
        case 'ذهبية': return '✨';
        default: return '💳';
    }
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
    renderCards();
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
    const cardType = document.getElementById('regCardType').value;

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
        balance: 1000.00,
        accountType: accountType,
        currency: currency,
        isActive: true
    };
    accounts.push(newAccount);
    DB.setAccounts(accounts);

    // إنشاء بطاقة فيزا حسب النوع المختار
    const cards = DB.getCards();
    const cardNumber = generateCardNumber();
    cards.push({
        id: Date.now(),
        userId: newUser.id,
        cardNumber: cardNumber,
        cardType: cardType,
        cardStyle: getCardColor(cardType),
        expiry: generateExpiry(),
        cvv: generateCVV(),
        status: 'نشط',
        isDefault: true,
        balance: 1000.00
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
//  عرض البطاقات القابلة للتمرير
// ============================================================
function renderCards() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const cards = DB.getCards();
    const userCards = cards.filter(c => c.userId === user.id);

    const container = document.getElementById('cardsScroll');

    if (userCards.length === 0) {
        container.innerHTML = `<div style="color:rgba(255,255,255,0.3); padding:10px; text-align:center; width:100%;">لا توجد بطاقات</div>`;
        return;
    }

    container.innerHTML = userCards.map(c => {
        const cardStyle = c.cardStyle || getCardColor(c.cardType);
        const emoji = getCardEmoji(c.cardType);
        const cardTypeLabel = c.cardType || 'كلاسيك';
        
        return `
            <div class="virtual-card ${cardStyle}" 
                 data-card-id="${c.id}"
                 onclick="handleCardClick(${c.id}, event)"
                 style="cursor:pointer;">
                <div class="card-top">
                    <span class="card-brand">✦ بنك الياد</span>
                    <div class="card-chip"></div>
                </div>
                <div class="card-number">${c.cardNumber}</div>
                <div class="card-bottom">
                    <div>
                        <div class="card-name">${user.fullName}</div>
                    </div>
                    <div>
                        <div class="card-expiry">صالح حتى ${c.expiry}</div>
                    </div>
                </div>
                <div class="card-type-badge">${emoji} ${cardTypeLabel}</div>
                <div class="card-amount-fly" id="amount-fly-${c.id}">+0.00</div>
            </div>
        `;
    }).join('');
}

// ============================================================
//  معالجة النقر على البطاقة
// ============================================================
let lastCardClickTime = 0;

function handleCardClick(cardId, event) {
    const now = Date.now();
    if (now - lastCardClickTime < 800) return; // منع النقر المتكرر
    lastCardClickTime = now;

    const cardEl = event.currentTarget;
    const user = DB.getCurrentUser();
    if (!user) return;

    const accounts = DB.getAccounts();
    const account = accounts.find(a => a.userId === user.id);
    if (!account) return;

    // تأثير الضغط - تصغر ثم ترتد
    cardEl.classList.remove('pressed');
    void cardEl.offsetWidth; // إعادة تعيين الأنيميشن
    cardEl.classList.add('pressed');

    // عرض المبلغ على البطاقة
    const amountFly = document.getElementById(`amount-fly-${cardId}`);
    if (amountFly) {
        const balance = account.balance || 0;
        amountFly.textContent = `+${balance.toFixed(2)}`;
        cardEl.classList.add('flying');
        setTimeout(() => {
            cardEl.classList.remove('flying');
        }, 1200);
    }

    // تأثير النقود المتطايرة
    triggerFlyingMoney(event || { clientX: window.innerWidth/2, clientY: window.innerHeight/2 });

    // إظهار الرصيد كإشعار
    setTimeout(() => {
        showNotification(`💰 رصيدك: ${account.balance.toFixed(2)} ${account.currency || 'SDG'}`);
    }, 400);
}

// ============================================================
//  تأثير النقود المتطايرة
// ============================================================
function triggerFlyingMoney(event) {
    const emojis = ['💵', '💰', '💸', '🪙', '💎', '💲', '🤑'];
    const count = 20;

    const x = event.clientX || window.innerWidth / 2;
    const y = event.clientY || window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'flying-money';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        el.style.left = (x + (Math.random() - 0.5) * 200) + 'px';
        el.style.top = (y + (Math.random() - 0.5) * 200) + 'px';
        
        const tx = (Math.random() - 0.5) * 400;
        const ty = -Math.random() * 350 - 100;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        
        el.style.fontSize = (18 + Math.random() * 22) + 'px';
        
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

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
    }

    renderRecentHistory();
    updateNotifications();
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

    // تحديث رصيد البطاقة الافتراضية
    const cards = DB.getCards();
    const defaultCard = cards.find(c => c.userId === user.id && c.isDefault);
    if (defaultCard) {
        defaultCard.balance = fromAccount.balance;
        DB.setCards(cards);
    }

    showNotification(`✅ تم تحويل ${amount.toFixed(2)} ${fromAccount.currency || 'SDG'} بنجاح`);
    closeModal('transferModal');
    updateDashboard();
    renderCards();
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

    // تحديث رصيد البطاقة
    const cards = DB.getCards();
    const defaultCard = cards.find(c => c.userId === user.id && c.isDefault);
    if (defaultCard) {
        defaultCard.balance = account.balance;
        DB.setCards(cards);
    }

    showNotification(`✅ تم دفع فاتورة ${service} بقيمة ${amount.toFixed(2)} ${account.currency || 'SDG'}`);
    closeModal('billsModal');
    updateDashboard();
    renderCards();
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
                    <div class="type">${c.cardType || 'كلاسيك'} • ${c.expiry}</div>
                    <div style="font-size:11px; opacity:0.4;">الرصيد: ${(c.balance || 0).toFixed(2)}</div>
                </div>
                <div>
                    <span class="card-status ${c.status === 'نشط' ? 'active' : 'blocked'}">${c.status}</span>
                    <div class="card-actions">
                        ${c.status === 'نشط' ? 
                            `<button onclick="blockCard(${c.id})" title="حظر">🔒</button>` :
                            `<button onclick="unblockCard(${c.id})" title="إلغاء حظر">🔓</button>`
                        }
                        ${c.isDefault ? '⭐' : `<button onclick="setDefaultCard(${c.id})" title="تعيين كبطاقة افتراضية">⭐</button>`}
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

    const cardType = prompt('اختر نوع البطاقة (كلاسيك، عادية، ذهبية):');
    if (!cardType) return;
    
    const validTypes = ['كلاسيك', 'عادية', 'ذهبية'];
    if (!validTypes.includes(cardType)) {
        showNotification('نوع البطاقة غير صحيح', 'error');
        return;
    }

    const cards = DB.getCards();
    const cardNumber = generateCardNumber();
    cards.push({
        id: Date.now(),
        userId: user.id,
        cardNumber: cardNumber,
        cardType: cardType,
        cardStyle: getCardColor(cardType),
        expiry: generateExpiry(),
        cvv: generateCVV(),
        status: 'نشط',
        isDefault: false,
        balance: 0
    });
    DB.setCards(cards);

    showNotification('✅ تم إضافة البطاقة بنجاح');
    openCards();
    renderCards();
}

function blockCard(cardId) {
    const cards = DB.getCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.status = 'محظور';
        DB.setCards(cards);
        showNotification('🔒 تم حظر البطاقة');
        openCards();
        renderCards();
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
        renderCards();
    }
}

function setDefaultCard(cardId) {
    const user = DB.getCurrentUser();
    if (!user) return;

    const cards = DB.getCards();
    cards.forEach(c => { if (c.userId === user.id) c.isDefault = false; });
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.isDefault = true;
        DB.setCards(cards);
        showNotification('⭐ تم تعيين البطاقة كبطاقة افتراضية');
        openCards();
        renderCards();
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
    renderCards();
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

    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const message = document.getElementById('supportMessage').value.trim();
    if (!message) return;

    const container = document.getElementById('chatMessages');
    container.innerHTML += `
        <div class="chat-message user">${message}</div>
    `;

    document.getElementById('supportMessage').value = '';

    // إرسال رسالة للأدمن
    const messages = DB.getMessages();
    messages.push({
        id: Date.now(),
        fromUserId: user.id,
        fromUsername: user.username,
        fromFullName: user.fullName,
        message: message,
        timestamp: new Date().toLocaleString('ar-SA'),
        read: false,
        isSupport: false
    });
    DB.setMessages(messages);

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

        // حفظ رد الدعم
        const supportMessages = DB.getMessages();
        supportMessages.push({
            id: Date.now() + 1,
            fromUserId: 0,
            fromUsername: 'admin',
            fromFullName: 'الدعم الفني',
            message: reply,
            timestamp: new Date().toLocaleString('ar-SA'),
            read: true,
            isSupport: true,
            toUserId: user.id
        });
        DB.setMessages(supportMessages);
    }, 1000);

    container.scrollTop = container.scrollHeight;
});

// ============================================================
//  نظام الرسائل (الشات)
// ============================================================
let chatCurrentUser = null;

function openChat() {
    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const messages = DB.getMessages();
    const container = document.getElementById('chatUsersList');
    const conversation = document.getElementById('chatConversation');

    // إخفاء المحادثة وإظهار قائمة المستخدمين
    conversation.style.display = 'none';
    container.style.display = 'block';

    if (user.isAdmin) {
        // الأدمن يرى جميع المستخدمين الذين أرسلوا رسائل
        const usersWithMessages = new Set();
        messages.forEach(m => {
            if (!m.isSupport) usersWithMessages.add(m.fromUserId);
        });

        if (usersWithMessages.size === 0) {
            container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد رسائل</div>';
        } else {
            const users = DB.getUsers();
            let html = '';
            usersWithMessages.forEach(userId => {
                const msgUser = users.find(u => u.id === userId);
                if (msgUser) {
                    const lastMsg = messages.filter(m => m.fromUserId === userId).pop();
                    html += `
                        <div class="chat-user-item" onclick="openChatWithUser(${userId})">
                            <div>
                                <div class="user-name">${msgUser.fullName}</div>
                                <div class="user-last-msg">${lastMsg ? lastMsg.message.substring(0, 30) + '...' : ''}</div>
                            </div>
                            <div class="user-badge">${lastMsg && !lastMsg.read ? 'جديد' : ''}</div>
                        </div>
                    `;
                }
            });
            container.innerHTML = html;
        }
    } else {
        // المستخدم العادي يرى محادثته مع الدعم
        const supportMessages = messages.filter(m => 
            (m.fromUserId === user.id && m.isSupport) || 
            (m.toUserId === user.id && m.isSupport)
        );

        if (supportMessages.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">لا توجد رسائل مع الدعم</div>';
        } else {
            chatCurrentUser = 0; // الدعم الفني
            container.style.display = 'none';
            conversation.style.display = 'block';
            renderChatMessages(user.id, 0);
        }
    }

    openModal('chatModal');
}

function openChatWithUser(userId) {
    chatCurrentUser = userId;
    const container = document.getElementById('chatUsersList');
    const conversation = document.getElementById('chatConversation');
    
    container.style.display = 'none';
    conversation.style.display = 'block';
    
    const user = DB.getCurrentUser();
    renderChatMessages(user.id, userId);
}

function renderChatMessages(currentUserId, otherUserId) {
    const messages = DB.getMessages();
    const container = document.getElementById('chatMessagesList');
    
    const relevantMessages = messages.filter(m => 
        (m.fromUserId === currentUserId && m.toUserId === otherUserId) ||
        (m.fromUserId === otherUserId && m.toUserId === currentUserId) ||
        (m.fromUserId === currentUserId && m.isSupport && m.toUserId === otherUserId) ||
        (m.fromUserId === otherUserId && m.isSupport && m.toUserId === currentUserId)
    );

    if (relevantMessages.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.3); padding:20px;">ابدأ المحادثة</div>';
        return;
    }

    container.innerHTML = relevantMessages.map(m => {
        const isSent = m.fromUserId === currentUserId;
        return `
            <div class="chat-msg ${isSent ? 'sent' : 'received'}">
                ${m.message}
                <span class="msg-time">${m.timestamp}</span>
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;

    // تحديث الحالة مقروء
    const updatedMessages = DB.getMessages();
    updatedMessages.forEach(m => {
        if (m.fromUserId === otherUserId && !m.read) {
            m.read = true;
        }
    });
    DB.setMessages(updatedMessages);
}

document.getElementById('chatSendForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = DB.getCurrentUser();
    if (!user) {
        showNotification('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }

    const message = document.getElementById('chatMessageInput').value.trim();
    if (!message) return;

    const messages = DB.getMessages();
    messages.push({
        id: Date.now(),
        fromUserId: user.id,
        fromUsername: user.username,
        fromFullName: user.fullName,
        toUserId: chatCurrentUser || 0,
        message: message,
        timestamp: new Date().toLocaleString('ar-SA'),
        read: false,
        isSupport: user.isAdmin ? true : false
    });
    DB.setMessages(messages);

    document.getElementById('chatMessageInput').value = '';
    renderChatMessages(user.id, chatCurrentUser || 0);

    // تحديث الإشعارات
    updateNotifications();
});

function closeChat() {
    const container = document.getElementById('chatUsersList');
    const conversation = document.getElementById('chatConversation');
    container.style.display = 'block';
    conversation.style.display = 'none';
    chatCurrentUser = null;
}

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

    const messages = DB.getMessages();
    const unread = messages.filter(m => 
        (m.toUserId === user.id || (user.isAdmin && !m.read)) && !m.read
    );
    document.getElementById('notifCount').textContent = unread.length;
}

function toggleNotifications() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const messages = DB.getMessages();
    const userNotifs = messages.filter(m => 
        m.toUserId === user.id || (user.isAdmin && !m.read)
    );

    if (userNotifs.length === 0) {
        showNotification('📬 لا توجد إشعارات');
        return;
    }

    let message = '📬 الإشعارات:\n';
    userNotifs.forEach(n => {
        const fromUser = DB.getUsers().find(u => u.id === n.fromUserId);
        message += `• من ${fromUser ? fromUser.fullName : 'النظام'}: ${n.message}\n  (${n.timestamp})\n`;
        n.read = true;
    });
    DB.setMessages(messages);
    updateNotifications();
    alert(message);
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
    const cards = DB.getCards();
    const messages = DB.getMessages();
    const banned = DB.getBannedUsers();

    const totalUsers = users.filter(u => !u.isAdmin).length;
    const totalAccounts = accounts.length;
    const totalTransactions = transactions.length;
    const totalCards = cards.length;
    const unreadMessages = messages.filter(m => !m.read).length;

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
            <div class="admin-stat">
                <div class="admin-stat-value">${totalCards}</div>
                <div class="admin-stat-label">💳 البطاقات</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat-value">${unreadMessages}</div>
                <div class="admin-stat-label">💬 رسائل غير مقروءة</div>
            </div>
        </div>
        <div class="admin-actions">
            <button class="btn btn-primary" onclick="refreshAdminPanel()">🔄 تحديث</button>
            <button class="btn btn-primary" onclick="openSendNotification()">📢 إرسال إشعار</button>
            <button class="btn btn-success" onclick="exportData()">📤 تصدير</button>
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
                <td>${user.fullName}<br><small style="opacity:0.4;">@${user.username}</small></td>
                <td style="font-size:11px;">${account ? account.accountNumber : 'لا يوجد'}</td>
                <td>${account ? formatCurrency(account.balance, account.currency || 'SDG') : '0.00 SDG'}</td>
                <td style="font-size:11px;">${user.accountType || 'جاري'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <div class="action-btns">
                        ${isBanned ? 
                            `<button class="btn-unban" onclick="adminUnbanUser('${user.username}')">🔓</button>` :
                            `<button class="btn-ban" onclick="adminBanUser('${user.username}')">🔒</button>`
                        }
                        <button class="btn-delete" onclick="adminDeleteUser(${user.id})">🗑️</button>
                        <button class="btn-add" onclick="adminAddBalance(${user.id})">💰</button>
                        <button class="btn-deduct" onclick="adminDeductBalance(${user.id})">➖</button>
                        <button class="btn-edit" onclick="adminEditUser(${user.id})">✏️</button>
                        <button class="btn-info" onclick="adminViewMessages(${user.id})">💬</button>
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

    let messages = DB.getMessages();
    messages = messages.filter(m => m.fromUserId !== userId && m.toUserId !== userId);
    DB.setMessages(messages);

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

    // تحديث رصيد البطاقة
    const cards = DB.getCards();
    const defaultCard = cards.find(c => c.userId === userId && c.isDefault);
    if (defaultCard) {
        defaultCard.balance = account.balance;
        DB.setCards(cards);
    }

    showNotification(`💰 تم إضافة ${formatCurrency(numAmount, account.currency || 'SDG')} للمستخدم`);
    renderAdminPanel();
    updateDashboard();
    renderCards();
}

function adminDeductBalance(userId) {
    cons
