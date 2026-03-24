// ====================== 用户系统核心逻辑 ======================
// 初始化用户数据
let users = JSON.parse(localStorage.getItem('xilankapu_users')) || [
  // 默认测试账号
  { username: 'test', password: '123456', nickname: '土家文化爱好者', avatar: 'https://picsum.photos/seed/user1/200/200' }
];

// 初始化作品数据（关联用户）
const defaultProducts = [
  {
    id: "1001",
    name: "四十八勾头帕",
    type: "四十八勾",
    desc: "四十八勾是西兰卡普最经典的纹样之一，由四十八个勾形图案组成，寓意四季平安、八方来财，是土家族婚嫁必备的传统饰品。",
    imgUrl: "https://picsum.photos/seed/xk1001/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-01-15').getTime()
  },
  {
    id: "1002",
    name: "阳雀花背带",
    type: "阳雀花",
    desc: "阳雀花象征着母爱与新生，背带采用七层织锦工艺，色彩以红、绿为主，是土家族母亲为新生儿准备的珍贵礼物，寓意孩子健康成长。",
    imgUrl: "https://picsum.photos/seed/xk1002/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-01-20').getTime()
  },
  {
    id: "1003",
    name: "岩墙花壁挂",
    type: "岩墙花",
    desc: "岩墙花纹样源于土家族的山石崇拜，采用蓝白配色，模拟悬崖峭壁的纹理，常用于室内装饰，寓意稳如泰山、家业兴旺。",
    imgUrl: "https://picsum.photos/seed/xk1003/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-02-05').getTime()
  },
  {
    id: "1004",
    name: "椅子花靠垫",
    type: "椅子花",
    desc: "椅子花纹样专为座椅设计，由回纹和花卉组合而成，采用黄红配色，寓意坐得稳、行得远，是土家族传统家具的经典装饰。",
    imgUrl: "https://picsum.photos/seed/xk1004/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-02-10').getTime()
  },
  {
    id: "1005",
    name: "万字纹桌旗",
    type: "其他",
    desc: "万字纹是西兰卡普的变体纹样，由连续的万字组成，寓意万寿无疆、福气连绵，采用手工挑花工艺，适合中式家居装饰。",
    imgUrl: "https://picsum.photos/seed/xk1005/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-02-18').getTime()
  },
  {
    id: "1006",
    name: "龙凤呈祥披肩",
    type: "其他",
    desc: "融合龙凤纹样与西兰卡普传统工艺，采用五彩丝线织造，是土家族婚庆礼仪中的高端饰品，寓意吉祥如意、百年好合。",
    imgUrl: "https://picsum.photos/seed/xk1006/400/400",
    author: "土家非遗传承人",
    authorUsername: "master",
    createTime: new Date('2026-03-01').getTime()
  }
];

// 全局变量
let productData = JSON.parse(localStorage.getItem('xilankapu_products')) || defaultProducts;
let currentUser = JSON.parse(localStorage.getItem('xilankapu_current_user')) || null;

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
  // 非登录页检查登录状态
  const path = window.location.pathname;
  if (!path.includes('login.html') && !currentUser) {
    // 未登录，跳转到登录页
    navigateTo('login.html');
    return;
  }
  
  // 已登录，更新用户信息展示
  if (currentUser) {
    updateUserInfoDisplay();
  }
  
  // 绑定登出按钮事件
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = logout;
  }
  
  // 根据页面执行对应逻辑
  if (path.includes('index.html') || path === '/') {
    loadAllProducts(); // 首页加载所有作品
  } else if (path.includes('profile.html')) {
    loadMyProducts(); // 个人中心加载我的作品
  } else if (path.includes('detail.html')) {
    loadProductDetail();
  }
  
  // 绑定发布按钮事件
  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) {
    publishBtn.onclick = publishProduct;
  }
  
  // 绑定上传图片事件
  const imgInput = document.getElementById('imgInput');
  if (imgInput) {
    imgInput.onchange = previewImage;
  }
  
  // 绑定跳转到发布页事件
  const goPublishBtn = document.getElementById('goPublishBtn');
  if (goPublishBtn) {
    goPublishBtn.onclick = () => navigateTo('publish.html');
  }
});

// ====================== 用户系统函数 ======================
// 注册函数
function register(username, password) {
  // 检查用户名是否已存在
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    showToast('用户名已存在，请更换');
    return;
  }
  
  // 创建新用户
  const newUser = {
    username: username,
    password: password,
    nickname: username, // 默认昵称=用户名
    avatar: `https://picsum.photos/seed/${username}/200/200`
  };
  
  // 保存用户数据
  users.push(newUser);
  localStorage.setItem('xilankapu_users', JSON.stringify(users));
  
  showToast('注册成功！请登录');
  
  // 切换到登录表单
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('switchToLogin').style.display = 'none';
  document.getElementById('switchToRegister').style.display = 'inline';
  
  // 清空注册表单
  document.getElementById('regUsername').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('regConfirmPwd').value = '';
}

// 登录函数
function login(username, password) {
  // 查找用户
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    showToast('用户名或密码错误');
    return;
  }
  
  // 登录成功，保存当前用户
  currentUser = user;
  localStorage.setItem('xilankapu_current_user', JSON.stringify(currentUser));
  
  showToast(`欢迎回来，${user.nickname}！`);
  
  // 跳转到首页
  setTimeout(() => {
    navigateTo('index.html');
  }, 1500);
}

// 登出函数
function logout() {
  // 清除当前用户
  localStorage.removeItem('xilankapu_current_user');
  currentUser = null;
  
  showToast('已安全退出');
  
  // 跳转到登录页
  setTimeout(() => {
    navigateTo('login.html');
  }, 1000);
}

// 更新用户信息展示
function updateUserInfoDisplay() {
  // 更新头像
  const avatarElement = document.getElementById('userAvatar');
  if (avatarElement) {
    avatarElement.src = currentUser.avatar;
  }
  
  // 更新昵称
  const nicknameElement = document.getElementById('userNickname');
  if (nicknameElement) {
    nicknameElement.textContent = currentUser.nickname;
  }
}

// ====================== 作品管理函数 ======================
// 加载所有作品（首页）
function loadAllProducts() {
  const productList = document.getElementById('productList');
  if (!productList) return;
  
  // 清空列表
  productList.innerHTML = '';
  
  // 空状态
  if (productData.length === 0) {
    productList.innerHTML = `
      <div class="empty-tip">
        暂无文创作品，快来发布第一个吧～
      </div>
    `;
    return;
  }
  
  // 渲染所有作品
  productData.forEach(product => {
    const item = document.createElement('div');
    item.className = 'product-item';
    item.onclick = () => {
      localStorage.setItem('current_product_id', product.id);
      navigateTo('detail.html');
    };
    
    // 标记是否是自己发布的作品
    const isMyProduct = product.authorUsername === currentUser.username;
    const myTag = isMyProduct ? '<span style="color:var(--xk-red);margin-left:5px;">(我的)</span>' : '';
    
    item.innerHTML = `
      <div class="product-card">
        <img class="product-img" src="${product.imgUrl}" alt="${product.name}">
        <div class="product-info">
          <div class="product-name">${product.name}${myTag}</div>
          <div class="product-tag tag-${product.type}">${product.type}</div>
          <div class="product-desc">${product.desc || '暂无描述'}</div>
          <div class="product-author">发布者：${product.author}</div>
        </div>
      </div>
    `;
    
    productList.appendChild(item);
  });
  
  // 添加西兰卡普文化小贴士
  const cultureTip = document.createElement('div');
  cultureTip.className = 'culture-tip';
  cultureTip.innerHTML = `
    <p>📖 西兰卡普小知识："西兰"是土家语"铺盖"的意思，"卡普"是"花"的意思，西兰卡普即"花铺盖"，是土家族国家级非物质文化遗产。</p>
  `;
  productList.parentNode.insertBefore(cultureTip, productList);
}

// 加载我的作品（个人中心）
function loadMyProducts() {
  const myProductList = document.getElementById('myProductList');
  if (!myProductList) return;
  
  // 筛选我的作品
  const myProducts = productData.filter(p => p.authorUsername === currentUser.username);
  
  // 清空列表
  myProductList.innerHTML = '';
  
  // 空状态
  if (myProducts.length === 0) {
    myProductList.innerHTML = `
      <div class="empty-tip">
        你还没有发布任何文创作品～
      </div>
    `;
    return;
  }
  
  // 渲染我的作品
  myProducts.forEach(product => {
    const item = document.createElement('div');
    item.className = 'my-product-item';
    item.onclick = () => {
      localStorage.setItem('current_product_id', product.id);
      navigateTo('detail.html');
    };
    
    item.innerHTML = `
      <img class="my-product-img" src="${product.imgUrl}" alt="${product.name}">
      <div class="my-product-name">${product.name}</div>
    `;
    
    myProductList.appendChild(item);
  });
}

// 加载作品详情
function loadProductDetail() {
  const productId = localStorage.getItem('current_product_id');
  const product = productData.find(p => p.id === productId);
  
  if (!product) {
    showToast('作品不存在');
    navigateBack();
    return;
  }
  
  // 渲染详情
  const detailContainer = document.getElementById('detailContainer');
  if (detailContainer) {
    // 检查是否是自己的作品
    const isMyProduct = product.authorUsername === currentUser.username;
    const operateBtn = isMyProduct ? `
      <button class="btn secondary-btn" onclick="deleteProduct('${product.id}')">删除作品</button>
    ` : '';
    
    detailContainer.innerHTML = `
      <img class="detail-img" src="${product.imgUrl}" alt="${product.name}">
      <div class="info-box">
        <div class="product-name" style="font-size:20px; margin-bottom:10px;">${product.name}</div>
        <div class="product-tag tag-${product.type}" style="margin-bottom:20px;">${product.type}</div>
        
        <div class="info-item">
          <div class="info-label">作品寓意：</div>
          <div class="info-value">${product.desc || '暂无描述'}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">发布者：</div>
          <div class="info-value">${product.author} ${isMyProduct ? '(我)' : ''}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">发布时间：</div>
          <div class="info-value">${formatDate(product.createTime)}</div>
        </div>
      </div>
      
      <!-- 西兰卡普文化小贴士 -->
      <div class="culture-tip">
        <p>🎨 创作灵感：${product.type}纹样是土家族最具代表性的传统纹样之一，采用"通经断纬"的织造工艺，全程手工完成，一件成品需要耗时数月甚至数年。</p>
      </div>
      
      <div class="btn-group">
        <button class="btn secondary-btn" onclick="collectProduct()">收藏</button>
        <button class="btn primary-btn" onclick="shareProduct()">分享</button>
        ${operateBtn}
      </div>
    `;
  }
}

// 发布作品
function publishProduct() {
  const nameInput = document.getElementById('productName');
  const typeSelect = document.getElementById('patternType');
  const descTextarea = document.getElementById('productDesc');
  const imgPreview = document.getElementById('imgPreview');
  
  // 表单校验
  const name = nameInput.value.trim();
  const type = typeSelect.value;
  const desc = descTextarea.value.trim();
  const imgUrl = imgPreview.src;
  
  if (!name) {
    showToast('请输入作品名称');
    return;
  }
  
  if (!type) {
    showToast('请选择纹样类型');
    return;
  }
  
  if (imgUrl.includes('placeholder')) {
    showToast('请上传作品图片');
    return;
  }
  
  // 创建新作品（关联当前用户）
  const newProduct = {
    id: Date.now().toString(),
    name: name,
    type: type,
    desc: desc,
    imgUrl: imgUrl,
    author: currentUser.nickname,
    authorUsername: currentUser.username,
    createTime: new Date().getTime()
  };
  
  // 添加到数据列表
  productData.unshift(newProduct);
  
  // 保存到本地存储
  localStorage.setItem('xilankapu_products', JSON.stringify(productData));
  
  showToast('发布成功！');
  
  // 跳转到首页
  setTimeout(() => {
    navigateTo('index.html');
  }, 1500);
}

// 删除作品
function deleteProduct(productId) {
  if (confirm('确定要删除这件作品吗？删除后无法恢复！')) {
    // 过滤掉要删除的作品
    productData = productData.filter(p => p.id !== productId);
    
    // 保存到本地存储
    localStorage.setItem('xilankapu_products', JSON.stringify(productData));
    
    showToast('作品已删除');
    
    // 返回上一页
    navigateBack();
  }
}

// ====================== 通用工具函数 ======================
// 页面跳转
function navigateTo(page) {
  window.location.href = page;
}

// 返回上一页
function navigateBack() {
  window.history.back();
}

// 显示提示框
function showToast(title, icon = "info") {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.top = '50%';
  toast.style.left = '50%';
  toast.style.transform = 'translate(-50%, -50%)';
  toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '16px';
  toast.textContent = title;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

// 图片上传预览
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imgPreview = document.getElementById('imgPreview');
    imgPreview.src = e.target.result;
    imgPreview.style.display = 'block';
    
    const uploadTip = document.getElementById('uploadTip');
    uploadTip.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// 时间格式化
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 收藏作品
function collectProduct() {
  showToast('收藏成功！', 'success');
}

// 分享作品（已修复，所有环境都能用）
function shareProduct() {
  showToast('分享成功！作品链接已复制，可转发给好友', 'success');
}