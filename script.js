const products = [
  {id:"golden-hour", name:"Golden Hour", category:"Landscape", price:35, image:"photos/landscape1.jpg"},
  {id:"misty-mountains", name:"Misty Mountains", category:"Landscape", price:35, image:"photos/landscape2.jpg"},
  {id:"coastal-light", name:"Coastal Light", category:"Landscape", price:35, image:"photos/landscape3.jpg"},
  {id:"wild-at-heart", name:"Wild at Heart", category:"Wildlife", price:40, image:"photos/wildlife1.jpg"},
  {id:"quiet-watcher", name:"Quiet Watcher", category:"Wildlife", price:40, image:"photos/wildlife2.jpg"},
  {id:"into-the-wild", name:"Into the Wild", category:"Wildlife", price:40, image:"photos/wildlife3.jpg"}
];

const gallery = [
  {title:"Golden Hour", type:"landscape", image:"photos/landscape1.jpg"},
  {title:"Misty Mountains", type:"landscape", image:"photos/landscape2.jpg"},
  {title:"Coastal Light", type:"landscape", image:"photos/landscape3.jpg"},
  {title:"Wild at Heart", type:"wildlife", image:"photos/wildlife1.jpg"},
  {title:"Quiet Watcher", type:"wildlife", image:"photos/wildlife2.jpg"},
  {title:"Into the Wild", type:"wildlife", image:"photos/wildlife3.jpg"}
];

let basket = JSON.parse(localStorage.getItem("dlpBasket") || "[]");
let wishlist = JSON.parse(localStorage.getItem("dlpWishlist") || "[]");

const $ = s => document.querySelector(s);
const galleryGrid = $("#galleryGrid");
const productGrid = $("#productGrid");

function renderGallery(filter="all") {
  galleryGrid.innerHTML = gallery.filter(x => filter==="all" || x.type===filter).map(x => `
    <article class="gallery-card" data-image="${x.image}" data-title="${x.title}">
      <img src="${x.image}" alt="${x.title}" loading="lazy">
      <div class="caption"><strong>${x.title}</strong><small>${x.type}</small></div>
    </article>
  `).join("");
}
function isWish(id) { return wishlist.includes(id); }

function renderProducts() {
  productGrid.innerHTML = products.map(p => `
    <article class="product">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="price">£${p.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="small-btn ${isWish(p.id) ? "primary":""}" onclick="toggleWishlist('${p.id}')">${isWish(p.id) ? "♥ Saved":"♡ Wishlist"}</button>
          <button class="small-btn primary" onclick="addToBasket('${p.id}')">Add to basket</button>
        </div>
      </div>
    </article>
  `).join("");
}
function save() {
  localStorage.setItem("dlpBasket", JSON.stringify(basket));
  localStorage.setItem("dlpWishlist", JSON.stringify(wishlist));
  updateCounts();
}
function updateCounts() {
  $("#basketCount").textContent = basket.length;
  $("#wishlistCount").textContent = wishlist.length;
}
window.addToBasket = id => {
  const p = products.find(x=>x.id===id);
  basket.push(p);
  save();
  openDrawer("basket");
};
window.toggleWishlist = id => {
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  save(); renderProducts();
};
function openDrawer(type) {
  $("#drawerEyebrow").textContent = type==="basket" ? "YOUR BAG" : "SAVED WORK";
  $("#drawerTitle").textContent = type==="basket" ? "Basket" : "Wishlist";
  const items = type==="basket" ? basket : wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const content = $("#drawerContent");
  if (!items.length) {
    content.innerHTML = `<div class="empty">${type==="basket" ? "Your basket is empty." : "Your wishlist is empty."}</div>`;
  } else {
    content.innerHTML = items.map((p,i)=>`
      <div class="drawer-item">
        <img src="${p.image}" alt="">
        <div><h4>${p.name}</h4><p>£${p.price.toFixed(2)}</p></div>
        <button class="remove" onclick="${type==="basket" ? `removeBasket(${i})` : `removeWishlist('${p.id}')`}">Remove</button>
      </div>`).join("");
    if(type==="basket") {
      const total = basket.reduce((sum,p)=>sum+p.price,0);
      content.innerHTML += `<div class="drawer-total"><strong>Total</strong><strong>£${total.toFixed(2)}</strong></div>
      <button class="gold-btn" style="width:100%" onclick="demoCheckout()">Enquire about prints</button>
      <p class="form-note">Demo only — no payment is taken.</p>`;
    }
  }
  $("#drawer").classList.add("open"); $("#drawerBackdrop").classList.add("open");
}
window.removeBasket = i => { basket.splice(i,1); save(); openDrawer("basket"); };
window.removeWishlist = id => { wishlist=wishlist.filter(x=>x!==id); save(); renderProducts(); openDrawer("wishlist"); };
window.demoCheckout = () => {
  $("#drawerContent").innerHTML = `<p class="empty">Thanks! This demo shop does not process payments. Use the Contact section to enquire about a print.</p>`;
};
function closeDrawer() { $("#drawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open"); }

document.addEventListener("click", e => {
  const card = e.target.closest(".gallery-card");
  if(card) {
    $("#lightboxImage").src=card.dataset.image;
    $("#lightboxImage").alt=card.dataset.title;
    $("#lightboxCaption").textContent=card.dataset.title;
    $("#lightbox").classList.add("open");
  }
});
document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", ()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); renderGallery(btn.dataset.filter);
}));
$("#basketBtn").onclick=()=>openDrawer("basket");
$("#wishlistBtn").onclick=()=>openDrawer("wishlist");
$("#drawerClose").onclick=closeDrawer;
$("#drawerBackdrop").onclick=closeDrawer;
$("#lightboxClose").onclick=()=>$("#lightbox").classList.remove("open");
$("#menuBtn").onclick=()=>document.querySelector("nav").classList.toggle("open");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>document.querySelector("nav").classList.remove("open"));
$("#contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name=encodeURIComponent($("#contactName").value);
  const email=encodeURIComponent($("#contactEmail").value);
  const message=encodeURIComponent($("#contactMessage").value);
  window.location.href=`mailto:YOUR-EMAIL@example.com?subject=Dulcis%20Lux%20Photos%20enquiry%20from%20${name}&body=Name:%20${name}%0AEmail:%20${email}%0A%0A${message}`;
});
$("#siteLogo").addEventListener("error", function(){
  this.style.display="none"; document.querySelector(".brand-fallback").style.display="block";
});
$("#year").textContent=new Date().getFullYear();
renderGallery(); renderProducts(); updateCounts();

// Premium edition enhancements
window.addEventListener("load",()=>setTimeout(()=>document.getElementById("premiumLoader")?.classList.add("done"),650));

document.querySelectorAll("[data-open-product]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();
    const id=btn.dataset.openProduct;
    const p=typeof products!=="undefined"?products.find(x=>x.id===id):null;
    if(p && typeof openProduct==="function") openProduct(id);
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    document.getElementById("premiumLoader")?.classList.add("done");
    document.getElementById("lightbox")?.classList.remove("open");
    document.getElementById("productModal")?.classList.remove("open");
    document.getElementById("searchModal")?.classList.remove("open");
  }
});

const glow=document.querySelector(".cursor-glow");
if(glow){
  window.addEventListener("mousemove",e=>{
    glow.style.transform=`translate(${e.clientX-110}px,${e.clientY-110}px)`;
  },{passive:true});
}

window.addEventListener("scroll",()=>{
  const hero=document.querySelector(".premium-hero .hero-image");
  if(hero && window.scrollY<window.innerHeight) hero.style.transform=`scale(1.03) translateY(${window.scrollY*.06}px)`;
},{passive:true}); 
