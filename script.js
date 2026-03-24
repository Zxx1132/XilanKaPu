let users = JSON.parse(localStorage.getItem('xilankapu_users')) || [
  { username: 'test', password: '123456', nickname: '土家文化爱好者', avatar: "" }
];

// 🔥 全局共享作品库（所有人共用）
const defaultProducts = [];
let globalProducts = JSON.parse(localStorage.getItem('xilankapu_global_products')) || defaultProducts;
let productData = globalProducts;

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
  users.push({ username, password, nickname: username, avatar: "" });
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
  if (productData.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:50px 0;color:#999;">暂无作品，快来发布第一个吧～</div>';
    return;
  }
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
  if (!name || !type || !img.src || img.src === '') {
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
  // 🔥 保存到全局共享存储
  localStorage.setItem('xilankapu_global_products', JSON.stringify(productData));
  showToast('发布成功！');
  setTimeout(() => navigateTo('index.html'), 1000);
}

function deleteProduct(id) {
  if (!confirm('确定要删除该作品吗？删除后无法恢复！')) return;
  productData = productData.filter(item => item.id !== id);
  // 🔥 同步更新全局共享存储
  localStorage.setItem('xilankapu_global_products', JSON.stringify(productData));
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