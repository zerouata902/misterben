// to get current year
function getYear() {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


// isotope js
$(window).on('load', function () {
  $('.filters_menu li').click(function () {
      $('.filters_menu li').removeClass('active');
      $(this).addClass('active');

      var data = $(this).attr('data-filter');
      $grid.isotope({
          filter: data
      })
  });

  var $grid = $(".grid").isotope({
      itemSelector: ".all",
      percentPosition: false,
      masonry: {
          columnWidth: ".all"
      }
  })
});

// nice select
$(document).ready(function() {
  $('select').niceSelect();
});

/** google_map js **/
function myMap() {
  var mapProp = {
      center: new google.maps.LatLng(40.712775, -74.005973),
      zoom: 18,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: true,
  navText: [],
  autoplay: true,
  autoplayHoverPause: true,
  navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
  ],
  responsive: {
      0: {
          items: 1
      },
      768: {
          items: 2
      },
      1000: {
          items: 2
      }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".menu-category");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    },
    {
      threshold: 03 ,
    }
  );

  sections.forEach(section => {
    section.classList.add("fade-init");
    observer.observe(section);
  });
});

const images = document.querySelectorAll('.fade-in');

const showOnScroll = () => {
images.forEach(img => {
  const rect = img.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }
});
};

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

let cart = [];
let total = 0;
let selectedLatLng = null;
let map, marker, modalInitialized = false;
let deliveryFee = 0;
const restaurantLatLng = [30.34855, -9.50416];
const deliveryRatePerKm = 3;

document.getElementById("whatsapp-link").addEventListener("click", function (e) {
e.preventDefault();
if (cart.length === 0) {
  alert("🛒 السلة فارغة!");
  return;
}
document.getElementById("order-type-modal").style.display = "flex";
});

function filterCategory(category) {
const boxes = document.querySelectorAll(".box");
boxes.forEach(box => {
  if (category === 'all' || box.classList.contains(category)) {
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
});
}

function addToCart(itemName, price) {
const existing = cart.find(i => i.name === itemName);
if (existing) {
  existing.quantity += 1;
  existing.total = existing.quantity * existing.price;
} else {
  cart.push({ name: itemName, price: price, quantity: 1, total: price });
}
total += price;
updateCart();
updateCartPreview();
playSound();
}

function playSound() {
const sound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_a0452873b2.mp3");
sound.play().catch(e => {
  const context = new AudioContext();
  context.resume().then(() => sound.play());
});
}

function updateCart() {
document.getElementById("total").textContent = `Total: ${total} DH`;
const message = cart.map(i => `${i.name} ×${i.quantity} : ${i.total} DH`).join('\n') + `\nTotal: ${total} DH`;
const encodedMessage = encodeURIComponent(message);
const phone = "212656265615";
document.getElementById("whatsapp-link").href = `https://wa.me/${phone}?text=${encodedMessage}`;
}

function updateCartPreview() {
const list = document.getElementById("preview-items");
const delivery = document.getElementById("preview-delivery");
const totalText = document.getElementById("preview-total");

list.innerHTML = "";
let tempTotal = 0;
cart.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.name} ×${item.quantity} - ${item.total} DH`;
  list.appendChild(li);
  tempTotal += item.total;
});

delivery.textContent = `🚚 التوصيل: ${deliveryFee} DH`;
totalText.textContent = `💰 المجموع: ${tempTotal + deliveryFee} DH`;
}

function handleOrderType() {
const orderType = document.querySelector('input[name="orderType"]:checked');
if (!orderType) {
  alert("⛔ من فضلك اختار طريقة الاستلام.");
  return;
}

document.getElementById("order-type-modal").style.display = "none";

if (orderType.value === "delivery") {
  openMapModal();
} else {
  sendDirectOrder();
}
}

function sendDirectOrder() {
const orderMsg = cart.map(item => `${item.name} ×${item.quantity} : ${item.total} DH`).join('\n');
const fullMessage = `🍽️ *Mister Ben* - الزبون  في المطعم

📦 *الطلب:*
${orderMsg}

💰 *المجموع:* ${total} DH`;

const phone = "+212707773567";
const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
window.open(whatsappURL, "_blank");
}

function openMapModal() {
document.getElementById("delivery-modal").style.display = "block";
if (!modalInitialized) {
  modalInitialized = true;

  map = L.map('map').setView(restaurantLatLng, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  L.marker(restaurantLatLng)
    .addTo(map)
    .bindPopup('📍 موقع المطعم (Mister ben)')
    .openPopup();

  L.circle(restaurantLatLng, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2,
    radius: 8000
  }).addTo(map);

  map.on('click', function (e) {
    const distanceFromRestaurant = map.distance(restaurantLatLng, e.latlng);
    if (distanceFromRestaurant <= 8000) {
      if (marker) map.removeLayer(marker);
      selectedLatLng = e.latlng;

      marker = L.marker(selectedLatLng, {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
          shadowSize: [41, 41]
        })
      }).addTo(map);

      calculateDistanceAndFee();
    } else {
      alert("❌ خارج منطقة التوصيل (10 كلم).");
    }
  });
}
}

function calculateDistanceAndFee() {
if (!selectedLatLng) return;
const distance = map.distance(restaurantLatLng, selectedLatLng) / 1000;
const roundedDist = Math.round(distance * 10) / 10;
deliveryFee = Math.ceil(roundedDist * deliveryRatePerKm);

document.getElementById("distanceText").textContent = `المسافة: ${roundedDist} كم`;
document.getElementById("deliveryFeeText").textContent = `ثمن التوصيل: ${deliveryFee} DH`;
document.getElementById("finalTotalText").textContent = `المجموع النهائي: ${total + deliveryFee} DH`;
updateCartPreview();
}

function confirmOrder() {
if (!selectedLatLng) {
  alert("⛔ المرجو تحديد موقعك على الخريطة.");
  return;
}

const orderMsg = cart.map(item => `${item.name} ×${item.quantity} : ${item.total} DH`).join('\n');
const fullMessage = `🍽️ *Mister Ben* - طلب توصيل

📦 *الطلب:*
${orderMsg}

📍 *الموقع:* https://www.google.com/maps?q=${selectedLatLng.lat},${selectedLatLng.lng}
🚚 *توصيل:* ${deliveryFee} DH
💰 *المجموع:* ${total + deliveryFee} DH`;

const phone = "+212707773567";
const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
window.open(whatsappURL, "_blank");

closeModal();
}

function closeModal() {
document.getElementById("delivery-modal").style.display = "none";
}

function searchFood() {
const input = document.getElementById("searchInput").value.toLowerCase();
const boxes = document.querySelectorAll(".box");

boxes.forEach(box => {
  const name = box.querySelector("h3").textContent.toLowerCase();
  if (name.includes(input)) {
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
});
}

document.addEventListener("DOMContentLoaded", function () {
const modal = document.getElementById("order-type-modal");
const img = document.querySelector(".animated-order");

const observer = new MutationObserver(() => {
  if (modal.style.display === "block") {
    img.classList.remove("animated-order");
    void img.offsetWidth;
    img.classList.add("animated-order");
  }
});

observer.observe(modal, { attributes: true, attributeFilter: ["style"] });
});