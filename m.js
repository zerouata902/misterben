const images = [
    "K1.jpg",
    "K2.jpg",
    "K3.jpg",
    "K4.jpg",
    "K5.jpg",
    "K6.jpg",
    "K7.jpg",
    // زيد هنا باقي الصور إذا بغيتي
  ];
  
  let current = 0;
  const img = document.getElementById("menu-img");
  
  document.getElementById("next").addEventListener("click", () => {
    current = (current + 1) % images.length;
    img.src = images[current];
  });
  
  document.getElementById("prev").addEventListener("click", () => {
    current = (current - 1 + images.length) % images.length;
    img.src = images[current];
  });