// FILE: script.js (Menggunakan nama file yang diunggah)

// DATA JASA
const products = [
  {
    id: 1,
    title: "Jasa Foto Produk",
    price: 250000,
    // KOREKSI NAMA FILE
    img: "foto-produk.jpg", 
    desc: "Foto produk dengan lighting studio serta editing premium untuk hasil estetis dan profesional."
  },
  {
    id: 2,
    title: "Foto Fashion / Lookbook",
    price: 350000,
    // KOREKSI NAMA FILE
    img: "foto-fashion.jpg", 
    desc: "Pemotretan model & outfit dengan konsep modern, tone bersih, dan style katalog brand."
  },
  {
    id: 3,
    title: "Videografi Produk",
    price: 500000,
    // KOREKSI NAMA FILE
    img: "video-produk.jpg", 
    desc: "Video cinematic untuk promosi produk, menggunakan gerakan kamera halus, lighting rapi, dan editing profesional."
  },
  {
    id: 4,
    title: "Content Creator",
    price: 450000,
    // KOREKSI NAMA FILE
    img: "content-creator.jpg", 
    desc: "Paket foto + video untuk social media, cocok untuk UMKM dan personal branding."
  }
];

// Fungsi Format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// Elemen DOM
const productGrid = document.querySelector("#productGrid");
const modal = document.querySelector("#productModal");
const closeModalBtn = document.querySelector("#closeModal");
const addToCartBtn = document.querySelector("#addToCartBtn");
const modalQtyInput = document.querySelector("#modalQty");
const waBookingLink = document.querySelector("#waBooking"); 
const cartDrawer = document.querySelector("#cartDrawer");
const openCart = document.querySelector("#openCart");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const checkoutWABtn = document.querySelector(".checkout-btn");

// RENDER PRODUK
const renderProducts = () => {
  productGrid.innerHTML = '';
  products.forEach(p => {
    productGrid.innerHTML += `
      <div class="product-card" onclick="openModal(${p.id})">
        <img src="${p.img}" alt="${p.title}">
        <div class="product-meta">
          <h3 class="product-title">${p.title}</h3>
          <p class="product-price">${formatRupiah(p.price)}</p>
        </div>
      </div>
    `;
  });
};

// MODAL
function openModal(id){
  const p = products.find(x=>x.id===id);
  if (!p) return;
  document.querySelector("#modalImg").src = p.img;
  document.querySelector("#modalTitle").textContent = p.title;
  document.querySelector("#modalPrice").textContent = formatRupiah(p.price);
  document.querySelector("#modalDesc").textContent = p.desc;
  addToCartBtn.setAttribute("data-id", p.id);
  modalQtyInput.value = 1;

  // Atur Link WhatsApp untuk Booking
  const waText = `Halo EATHEREAL Studio, saya tertarik untuk booking jasa "${p.title}" (${formatRupiah(p.price)}) untuk 1 sesi.`;
  waBookingLink.href = `https://wa.me/6281234567890?text=${encodeURIComponent(waText)}`; 

  modal.classList.remove("hidden");
}
closeModalBtn.onclick = ()=> modal.classList.add("hidden");
modal.onclick = e => { if(e.target === modal) modal.classList.add("hidden"); };

// CART SYSTEM
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

openCart.onclick = ()=> cartDrawer.classList.add("show");
closeCart.onclick = ()=> cartDrawer.classList.remove("show");

// ADD TO CART
addToCartBtn.onclick = function(){
  const id = Number(this.getAttribute("data-id"));
  const qty = Number(modalQtyInput.value);
  const product = products.find(p=>p.id===id);

  if (!product || qty < 1) return;

  let item = cart.find(c=>c.id===id);
  if(item){
    item.qty += qty;
  } else {
    cart.push({id:product.id,title:product.title,price:product.price,img:product.img,qty:qty});
  }

  saveCart();
  renderCart();
  modal.classList.add("hidden");
  cartDrawer.classList.add("show");
};

// RENDER CART
function renderCart(){
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; opacity:.7; padding:20px 0;">Keranjang kosong.</p>';
    cartTotal.textContent = formatRupiah(0);
    checkoutWABtn.disabled = true;
    return;
  }

  cart.forEach((item, index)=>{
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <p style="font-weight:600;">${item.title}</p>
          <p style="font-size:14px; opacity:.7;">${item.qty} sesi x ${formatRupiah(item.price)}</p>
          <div style="margin-top:5px;">
            <button onclick="updateQty(${item.id}, -1)">-</button>
            <span style="margin:0 8px;">${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
            <button onclick="removeItem(${item.id})" style="margin-left:10px;color:red;">x</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = formatRupiah(total);
  checkoutWABtn.disabled = false;
}

// UPDATE QTY
function updateQty(id,delta){
  let item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c=>c.id!==id);
  saveCart();
  renderCart();
}

// REMOVE ITEM
function removeItem(id){
  cart = cart.filter(c=>c.id!==id);
  saveCart();
  renderCart();
}

// SAVE CART TO LOCALSTORAGE
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Checkout via WhatsApp
checkoutWABtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  let message = "Halo EATHEREAL Studio, saya ingin melakukan pemesanan jasa berikut:\n\n";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    message += `- ${item.qty} sesi *${item.title}* (${formatRupiah(item.price)} per sesi)\n`;
  });

  message += `\nTotal Estimasi: ${formatRupiah(total)}\n\nMohon konfirmasi pesanan saya. Terima kasih.`;

  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`; 
  window.open(waUrl, '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  document.querySelector("#year").textContent = new Date().getFullYear();
});