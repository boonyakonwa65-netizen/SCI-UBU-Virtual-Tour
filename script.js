// ========== Cache elements ==========
const openBtn  = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar  = document.getElementById("sidebar");
const container = document.getElementById("tour-container");

// ========== Open sidebar ==========
openBtn.addEventListener("click", () => {
  sidebar.classList.add("show");
  openBtn.classList.add("is-hidden");  // <-- ซ่อนแบบบังคับ
});

// ปิดเมนู -> แสดง hamburger กลับ
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("show");
  openBtn.classList.remove("is-hidden");
});

// กรณีมีการเข้า/ออก Fullscreen
document.addEventListener("fullscreenchange", () => {
  // ออกจาก fullscreen แล้ว และเมนูปิดอยู่ -> แสดง hamburger
  if (!document.fullscreenElement && !sidebar.classList.contains("show")) {
    openBtn.classList.remove("is-hidden");
  }
});

// ========== Load virtual tour into container ==========
function loadTour(folderName) {
  // Fade-out
  container.classList.add("fade-out");

  setTimeout(() => {
    if (folderName === "overview") {
      // ภาพมุมสูงเป็นรูปภาพ (ปรับ path/ไฟล์ตามของจริง)
      container.innerHTML = `
        <iframe src="tours/${folderName}/index.html"
                allowfullscreen
                width="100%"
                height="100%"
                frameborder="0"></iframe>
      `;
      // active เมนูหลัก "ภาพมุมสูง"
      setActiveMainTitleByIndex(0);
      clearAllBullets();
    } else {
      // ห้องอื่นเป็น iframe
      container.innerHTML = `
        <iframe src="tours/${folderName}/index.html"
                allowfullscreen
                width="100%"
                height="100%"
                frameborder="0"></iframe>
      `;
    }

    // Fade-in
    container.classList.remove("fade-out");
  }, 300);
}

// ========== Toggle fullscreen ==========
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
}

// ========== Toggle submenu (close others) ==========
function toggleSubmenu(element) {
  const parent = element.closest(".has-submenu");
  const isOpen = parent.classList.contains("open");

  // ปิดทุกเมนูอื่นก่อน
  document.querySelectorAll(".has-submenu").forEach(item => item.classList.remove("open"));

  // ถ้าคลิกตัวเดิมแล้วปิดอยู่ -> เปิด, ถ้าเปิดอยู่ -> ปิด
  if (!isOpen) parent.classList.add("open");

  // จัด active ของเมนูหลัก
  document.querySelectorAll(".menu-title").forEach(t => t.classList.remove("active"));
  element.classList.add("active");
}

// ===== Helper: set active main title by index (เช่น ภาพมุมสูง index 0) =====
function setActiveMainTitleByIndex(idx) {
  const mainTitles = document.querySelectorAll(".menu > li > .menu-title");
  document.querySelectorAll(".menu-title").forEach(t => t.classList.remove("active"));
  if (mainTitles[idx]) mainTitles[idx].classList.add("active");
}

// ===== Helper: clear bullets active ในทุก submenu =====
function clearAllBullets() {
  document.querySelectorAll(".submenu li").forEach(li => li.classList.remove("active"));
}

// ========== Bullet active (เฉพาะที่คลิก) + active เมนูหลักที่เกี่ยวข้อง ==========
// ใช้ event delegation บนแต่ละ .submenu (รองรับ <div class="submenu-item">)
document.querySelectorAll(".submenu").forEach(ul => {
  ul.addEventListener("click", (e) => {
    const item = e.target.closest(".submenu-item");
    if (!item) return;

    // กัน event ทะลุไปปิด/เปิดเมนู
    e.stopPropagation();

    // ล้าง active ของพี่น้องใน submenu เดียวกัน
    ul.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    item.parentElement.classList.add("active");

    // ทำ active ให้หัวข้อหลักของ submenu นี้
    const parentHasSubmenu = ul.closest(".has-submenu");
    if (parentHasSubmenu) {
      document.querySelectorAll(".menu-title").forEach(t => t.classList.remove("active"));
      const title = parentHasSubmenu.querySelector(".menu-title");
      title && title.classList.add("active");
    }
  });
});

// ========== ซ่อน/แสดง open menu ตามสถานะ fullscreen ==========
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    openBtn.classList.remove("active");        // ✅ กันค้างเป็นรูป X
  }
});

// ========== คลิกเมนูหลัก "ภาพมุมสูง" ให้ active + ปิดเมนูอื่น ==========
const firstMain = document.querySelector(".menu > li:first-child .menu-title");
if (firstMain) {
  firstMain.addEventListener("click", () => {
    // ปิดเมนูย่อยอื่นทั้งหมด
    document.querySelectorAll(".has-submenu").forEach(item => item.classList.remove("open"));
    // active เฉพาะภาพมุมสูง
    setActiveMainTitleByIndex(0);
    clearAllBullets();
  });
}

// ========== โหลด overview เป็นค่าเริ่มต้น เมื่อเปิดเว็บ ==========
window.addEventListener("load", () => {
  loadTour("overview");
});

