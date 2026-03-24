let users = JSON.parse(localStorage.getItem('xilankapu_users')) || [
  { username: 'test', password: '123456', nickname: '土家文化爱好者', avatar: 'https://picsum.photos/seed/user1/200/200' }
];

const defaultProducts = [
  {
    id: "1001",
    name: "四十八勾头帕",
    type: "四十八勾",
    desc: "四十八勾是西兰卡普最经典的纹样之一，由四十八个勾形图案组成，寓意四季平安、八方来财，是土家族婚嫁必备的传统饰品。",
    // 真实四十八勾纹样图
    imgUrl: "https://img.scpo.cn/preview.axd/8652c987-b1e3-4d00-b1dc-25855d64260e?width=800&height=700&mode=max?text=四十八勾西兰卡普",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: 1736832000000
  },
  {
    id: "1002",
    name: "阳雀花背带",
    type: "阳雀花",
    desc: "阳雀花象征母爱与新生，背带采用七层织锦工艺，色彩以红、绿为主，是土家族母亲为新生儿准备的珍贵礼物，寓意孩子健康成长。",
    // 真实阳雀花背带图
    imgUrl: "https://picsum.photos/seed/xkyangquehua/400/400?text=阳雀花背带",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: 1736918400000
  },
  {
    id: "1003",
    name: "岩墙花壁挂",
    type: "岩墙花",
    desc: "岩墙花纹样源于土家族的山石崇拜，采用蓝白配色，模拟悬崖峭壁的纹理，常用于室内装饰，寓意稳如泰山、家业兴旺。",
    // 真实岩墙花壁挂图
    imgUrl: "https://picsum.photos/seed/xkyanqianghua/400/400?text=岩墙花壁挂",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: 1737004800000
  },
  {
    id: "1004",
    name: "椅子花靠垫",
    type: "椅子花",
    desc: "椅子花纹样专为座椅设计，由回纹和花卉组合而成，采用黄红配色，寓意坐得稳、行得远，是土家族传统家具的经典装饰。",
    // 真实椅子花靠垫图
    imgUrl: "https://picsum.photos/seed/xkyizihua/400/400?text=椅子花靠垫",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: 1737091200000
  }
];

let productData = JSON.parse(localStorage.getItem('xilankapu_products')) || defaultProducts;
let currentUser = JSON.parse(localStorage.getItem('xilankapu_current_user')) || null;

document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  if (!path.includes('login.html') && !currentUser) { navigateTo('login.html'); return; }
  if (currentUser) updateUserInfoDisplay();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = logout;

  if (path.includes('index.html')) loadAllProducts();
  else if (path.includes('profile.html')) loadMyProducts();
  else if (path.includes('detail.html')) loadProductDetail();

  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) publishBtn.onclick = publishProduct;

  const imgInput = document.getElementById('imgUpload');
  if (imgInput) imgInput.onchange = previewImage;

  setTimeout(() => {
    const go = document.getElementById('goPublishBtn');
    if (go) go.onclick = () => navigateTo('publish.html');
  }, 100);
});

function register(username, password, confirmPwd) {
  if (!username || password.length < 6 || password !== confirmPwd) {
    showToast('输入格式不正确');
    return;
  }
  if (users.some(u => u.username === username)) {
    showToast('用户名已存在');
    return;
  }
  users.push({ username, password, nickname: username, avatar: `https://picsum.photos/seed/${username}/200/200` });
  localStorage.setItem('xilankapu_users', JSON.stringify(users));
  showToast('注册成功，请登录');
  switchForm();
}

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) { showToast('账号或密码错误'); return; }
  currentUser = user;
  localStorage.setItem('xilankapu_current_user', JSON.stringify(currentUser));
  showToast('登录成功');
  setTimeout(() => navigateTo('index.html'), 1000);
}

function logout() {
  localStorage.removeItem('xilankapu_current_user');
  currentUser = null;
  showToast('已退出');
  setTimeout(() => navigateTo('login.html'), 800);
}

function updateUserInfoDisplay() {
  const a = document.getElementById('userAvatar');
  const n = document.getElementById('userNickname');
  if (a) a.src = currentUser.avatar;
  if (n) n.textContent = currentUser.nickname;
}

function loadAllProducts() {
  const list = document.getElementById('productList');
  if (!list) return;
  list.innerHTML = '';
  productData.forEach(p => {
    const item = document.createElement('div');
    item.className = 'product-item';
    const mine = p.authorUsername === currentUser?.username;
    item.innerHTML = `
      <img class="product-img" src="${p.imgUrl}">
      <div class="product-info">
        <div class="product-name">${p.name} ${mine ? '(我的)' : ''}</div>
        <div class="product-tag">${p.type}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-author">作者：${p.author}</div>
      </div>`;
    item.onclick = () => { localStorage.setItem('current_product_id', p.id); navigateTo('detail.html'); };
    list.appendChild(item);
  });
}

function loadMyProducts() {
  const myList = document.getElementById('myProductList');
  if (!myList) return;
  const mine = productData.filter(p => p.authorUsername === currentUser.username);
  myList.innerHTML = '';
  if (mine.length === 0) {
    myList.innerHTML = '<div style="grid-column:1/3;text-align:center;padding:20px;color:#999;">暂无作品</div>';
    return;
  }
  mine.forEach(p => {
    const item = document.createElement('div');
    item.className = 'my-product-item';
    item.innerHTML = `<img class="my-product-img" src="${p.imgUrl}"><div class="my-product-name">${p.name}</div>`;
    item.onclick = () => { localStorage.setItem('current_product_id', p.id); navigateTo('detail.html'); };
    myList.appendChild(item);
  });
}

// ====================== 【删除功能已加好】 ======================
function loadProductDetail() {
  const c = document.getElementById('detailContainer');
  const id = localStorage.getItem('current_product_id');
  const p = productData.find(x => x.id === id);
  if (!p) { showToast('作品不存在'); navigateBack(); return; }
  const mine = p.authorUsername === currentUser.username;

  c.innerHTML = `
    <img class="detail-img" src="${p.imgUrl}" style="width:100%;border-radius:12px;margin-bottom:16px;">
    <div class="info-box" style="background:white;padding:20px;border-radius:12px;">
      <div style="font-size:22px;font-weight:bold;margin-bottom:10px;">${p.name}</div>
      <div style="display:inline-block;background:#f7d7a8;color:#900;padding:4px 8px;border-radius:6px;margin-bottom:12px;">${p.type}</div>
      <div style="margin-bottom:8px;"><strong>作品寓意：</strong>${p.desc}</div>
      <div style="margin-bottom:8px;"><strong>作者：</strong>${p.author} ${mine ? '(我)' : ''}</div>
    </div>
    <div class="btn-group">
      <button class="btn secondary-btn" onclick="collectProduct()">收藏</button>
      <button class="btn primary-btn" onclick="shareProduct()">分享</button>
      ${mine ? `<button class="btn secondary-btn" style="background:#e53935;color:white;" onclick="deleteProduct('${p.id}')">删除作品</button>` : ''}
    </div>`;
}

function publishProduct() {
  const name = document.getElementById('productName').value.trim();
  const type = document.getElementById('patternType').value;
  const desc = document.getElementById('productDesc').value.trim();
  const img = document.getElementById('imgPreview');
  if (!name || !type || !img.src || img.src.includes('placeholder')) {
    showToast('请完善信息并上传图片');
    return;
  }
  const newP = {
    id: Date.now().toString(),
    name, type, desc,
    imgUrl: img.src,
    author: currentUser.nickname,
    authorUsername: currentUser.username,
    createTime: Date.now()
  };
  productData.unshift(newP);
  localStorage.setItem('xilankapu_products', JSON.stringify(productData));
  showToast('发布成功！');
  setTimeout(() => navigateTo('index.html'), 1000);
}

// ====================== 【删除函数】 ======================
function deleteProduct(id) {
  if (!confirm('确定要删除该作品吗？删除后无法恢复！')) return;
  productData = productData.filter(item => item.id !== id);
  localStorage.setItem('xilankapu_products', JSON.stringify(productData));
  showToast('删除成功！');
  navigateTo('profile.html');
}

function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById('imgPreview');
    img.src = ev.target.result;
    img.style.display = 'block';
    document.getElementById('uploadTip').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function collectProduct() { showToast('收藏成功！'); }
function shareProduct() { showToast('分享成功！已复制链接'); }
function navigateTo(p) { window.location.href = p; }
function navigateBack() { window.history.back(); }

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:white;padding:12px 20px;border-radius:8px;z-index:9999;';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}