document.addEventListener('DOMContentLoaded', () => {
  // 1. Common Layout: Mobile navigation toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Close mobile menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelectorAll('span').forEach(span => span.style.transform = 'none');
        menuToggle.querySelectorAll('span')[1].style.opacity = '1';
      });
    });
  }

  // 2. Sticky Header and Hero Parallax (only on index.html)
  const heroSection = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    if (heroSection) {
      const scrollValue = window.scrollY;
      heroSection.style.backgroundPosition = `center calc(70% + ${scrollValue * 0.45}px)`;
    }
  });

  // 3. Load Portfolio Data from JSON
  fetch('assets/data/gallery.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных каталога');
      }
      return response.json();
    })
    .then(data => {
      const items = data.items || [];
      
      // Determine which page we are currently on
      const pathname = window.location.pathname;
      
      if (document.getElementById('sliderTrack')) {
        // Page: index.html (Homepage with Slider)
        initHomepageSlider(items);
      } else if (document.getElementById('galleryGrid')) {
        // Page: gallery.html (Catalog page)
        initCatalogPage(items);
      } else if (document.getElementById('productDetailContainer')) {
        // Page: product.html (Details page)
        initProductDetailPage(items);
      }
    })
    .catch(error => {
      console.error('Ошибка инициализации каталога:', error);
      const loadingEl = document.querySelector('.product-loading');
      if (loadingEl) {
        loadingEl.innerHTML = `<div class="error-msg"><i class="fa-solid fa-triangle-exclamation"></i> Не удалось загрузить товары: ${error.message}</div>`;
      }
    });

  // --- 4. Homepage Slider Logic ---
  function initHomepageSlider(items) {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderContainer = document.getElementById('sliderContainer');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!sliderTrack) return;
    
    // Filter featured items (top: true)
    const featuredItems = items.filter(item => item.top === true);
    
    if (featuredItems.length === 0) {
      sliderTrack.innerHTML = '<p class="no-items">Нет избранных работ для отображения.</p>';
      return;
    }
    
    sliderTrack.innerHTML = '';
    featuredItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'slider-item';
      
      let tagText = 'Игрушка';
      if (item.category === 'accessories') tagText = 'Аксессуар';
      if (item.category === 'clothes_shoes') tagText = 'Одежда / Обувь';
      
      const priceText = item.price ? `${Number(item.price).toLocaleString('ru-RU')} ₽` : 'Цена по запросу';
      
      card.innerHTML = `
        <a href="product.html?id=${item.id}" class="card-link-wrapper">
          <div class="gallery-img-container">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
              <span class="view-details-btn">Подробнее <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </div>
          <div class="gallery-info">
            <span class="gallery-tag">${tagText}</span>
            <h3 class="gallery-title">${item.title}</h3>
            <div class="gallery-price">${priceText}</div>
          </div>
        </a>
      `;
      sliderTrack.appendChild(card);
    });
    
    // Slider Arrow Controls
    if (sliderContainer && prevBtn && nextBtn) {
      nextBtn.addEventListener('click', () => {
        const itemWidth = sliderTrack.querySelector('.slider-item').offsetWidth + 30; // Card width + gap
        sliderContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
      });
      
      prevBtn.addEventListener('click', () => {
        const itemWidth = sliderTrack.querySelector('.slider-item').offsetWidth + 30;
        sliderContainer.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      });
    }
  }

  // --- 5. Catalog Page Gallery Logic ---
  function initCatalogPage(items) {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!galleryGrid) return;
    
    let activeFilter = 'all';
    
    function renderCatalogItems(filteredItems) {
      galleryGrid.innerHTML = '';
      
      if (filteredItems.length === 0) {
        galleryGrid.innerHTML = '<p class="no-items">В данной категории пока нет изделий.</p>';
        return;
      }
      
      filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';
        
        let tagText = 'Игрушка';
        if (item.category === 'accessories') tagText = 'Аксессуар';
        if (item.category === 'clothes_shoes') tagText = 'Одежда / Обувь';
        
        const priceText = item.price ? `${Number(item.price).toLocaleString('ru-RU')} ₽` : 'Цена по запросу';
        
        card.innerHTML = `
          <a href="product.html?id=${item.id}" class="card-link-wrapper">
            <div class="gallery-img-container">
              <img src="${item.src}" alt="${item.title}" loading="lazy">
              <div class="gallery-overlay">
                <span class="view-details-btn">Подробнее <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
            <div class="gallery-info">
              <span class="gallery-tag">${tagText}</span>
              <h3 class="gallery-title">${item.title}</h3>
              <div class="gallery-price">${priceText}</div>
            </div>
          </a>
        `;
        galleryGrid.appendChild(card);
      });
    }
    
    // Initial Render
    renderCatalogItems(items);
    
    // Filtering Logic
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        activeFilter = btn.getAttribute('data-filter');
        const filtered = activeFilter === 'all' ? items : items.filter(item => item.category === activeFilter);
        renderCatalogItems(filtered);
      });
    });
  }

  // --- 6. Dynamic Product Detail Page Logic ---
  function initProductDetailPage(items) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      showProductError('Идентификатор товара не указан.');
      return;
    }
    
    // Find matching item
    const item = items.find(i => i.id === productId);
    
    if (!item) {
      showProductError('Извините, запрашиваемое изделие не найдено в каталоге.');
      return;
    }
    
    // Update Page Title
    document.title = `${item.title} | Вязаные изделия Натальи Праотцевой`;
    
    // Prepare prices, categories, materials, and colors
    let tagText = 'Вязаная игрушка';
    if (item.category === 'accessories') tagText = 'Сумки и аксессуары';
    if (item.category === 'clothes_shoes') tagText = 'Одежда и обувь';
    
    const priceText = item.price ? `${Number(item.price).toLocaleString('ru-RU')} ₽` : 'Цена по запросу';
    const materialsContent = item.materials || 'Использованы качественные экологичные материалы ручной вязки.';
    
    // Build Color Badges
    const colorsList = item.colors || [];
    let colorsHTML = '';
    if (colorsList.length > 0) {
      colorsHTML = `
        <div class="detail-block">
          <h4 class="detail-block-title">Доступные цвета:</h4>
          <div class="color-badges">
            ${colorsList.map(c => `<span class="color-badge">${c}</span>`).join('')}
          </div>
        </div>
      `;
    }
    
    // Build Secondary Gallery Thumbnails
    const subImages = item.gallery || [];
    let galleryHTML = '';
    if (subImages.length > 0) {
      galleryHTML = `
        <div class="product-gallery-thumbnails">
          <div class="thumbnail active" data-src="${item.src}">
            <img src="${item.src}" alt="${item.title} основной ракурс">
          </div>
          ${subImages.map((img, idx) => `
            <div class="thumbnail" data-src="${img}">
              <img src="${img}" alt="${item.title} ракурс ${idx + 2}">
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Populate the container HTML
    container.innerHTML = `
      <div class="product-grid">
        <!-- Visual/Gallery Column -->
        <div class="product-visual-col">
          <div class="product-main-image">
            <img id="mainProductImg" src="${item.src}" alt="${item.title}">
          </div>
          ${galleryHTML}
        </div>
        
        <!-- Info Column -->
        <div class="product-info-col">
          <span class="product-category-tag">${tagText}</span>
          <h1 class="product-title-heading">${item.title}</h1>
          <div class="product-price-large">${priceText}</div>
          
          <div class="product-desc-block">
            <h3 class="detail-section-title">Описание</h3>
            <p>${item.desc}</p>
          </div>
          
          <div class="detail-block">
            <h4 class="detail-block-title">Материалы:</h4>
            <p class="detail-block-text">${materialsContent}</p>
          </div>
          
          ${colorsHTML}
          
          <!-- Order Form CTA -->
          <div class="product-order-cta">
            <h3 class="order-cta-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Заказать такое же изделие</h3>
            <p class="order-cta-desc">Каждое изделие вяжется вручную под заказ. Вы можете указать индивидуальные пожелания по цвету и размеру в форме ниже.</p>
            
            <form id="productOrderForm" class="product-page-form" name="product-order" method="POST">
              <input type="hidden" name="form-name" value="product-order">
              <div class="form-grid-compact">
                <div class="form-group-compact">
                  <input type="text" id="prodOrderName" name="name" placeholder="Ваше имя" required>
                </div>
                <div class="form-group-compact">
                  <input type="text" id="prodOrderContact" name="contact" placeholder="Телефон или Telegram" required>
                </div>
                <div class="form-group-compact full-width">
                  <textarea id="prodOrderMessage" name="message" rows="3" required>Здравствуйте! Меня заинтересовало изделие "${item.title}" (${priceText}). Хотелось бы обсудить возможность заказа...</textarea>
                </div>
              </div>
              <button type="submit" class="btn-submit">Отправить заявку мастеру</button>
              <div class="form-status" id="prodFormStatus"></div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Thumbnail Clicks Handler & Lightbox integration
    const thumbnails = container.querySelectorAll('.thumbnail');
    const mainImg = container.querySelector('#mainProductImg');
    const productImages = [item.src, ...subImages];
    let currentImgIndex = 0;
    
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const targetSrc = thumb.getAttribute('data-src');
        mainImg.src = targetSrc;
        currentImgIndex = productImages.indexOf(targetSrc);
        if (currentImgIndex === -1) currentImgIndex = 0;
      });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('productLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (mainImg && lightbox && lightboxImg) {
      // Add cursor pointer to indicate it's clickable
      mainImg.style.cursor = 'pointer';
      mainImg.title = 'Нажмите, чтобы увеличить изображение';
      
      mainImg.addEventListener('click', () => {
        lightboxImg.src = productImages[currentImgIndex];
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        lightbox.classList.add('active');
        
        // Hide navigation arrows if there is only 1 image
        if (productImages.length <= 1) {
          if (lightboxPrev) lightboxPrev.style.display = 'none';
          if (lightboxNext) lightboxNext.style.display = 'none';
        } else {
          if (lightboxPrev) lightboxPrev.style.display = 'flex';
          if (lightboxNext) lightboxNext.style.display = 'flex';
        }
      });
    }

    if (lightbox) {
      // Close Lightbox
      const closeProductLightbox = () => {
        lightbox.classList.remove('active');
      };
      
      if (lightboxClose) lightboxClose.addEventListener('click', closeProductLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
          closeProductLightbox();
        }
      });
      
      // Prev/Next Navigation inside Lightbox
      const showImage = (idx) => {
        currentImgIndex = (idx + productImages.length) % productImages.length;
        const currentSrc = productImages[currentImgIndex];
        lightboxImg.src = currentSrc;
        
        // Synch active thumbnail indicator
        if (thumbnails.length > 0) {
          thumbnails.forEach(t => t.classList.remove('active'));
          const activeThumb = Array.from(thumbnails).find(t => t.getAttribute('data-src') === currentSrc);
          if (activeThumb) activeThumb.classList.add('active');
          if (mainImg) mainImg.src = currentSrc;
        }
      };

      if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          showImage(currentImgIndex - 1);
        });
      }
      
      if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
          e.stopPropagation();
          showImage(currentImgIndex + 1);
        });
      }
      
      // Keyboard Navigation
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeProductLightbox();
        if (productImages.length > 1) {
          if (e.key === 'ArrowLeft') showImage(currentImgIndex - 1);
          if (e.key === 'ArrowRight') showImage(currentImgIndex + 1);
        }
      });
    }
    
    // Product Page Form Submit Handler
    const form = container.querySelector('#productOrderForm');
    const formStatus = container.querySelector('#prodFormStatus');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка заявки...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        if (!formData.has('form-name')) {
          formData.append('form-name', 'product-order');
        }

        fetch(window.location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        })
        .then(response => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (response.ok) {
            form.reset();
            if (formStatus) {
              formStatus.textContent = 'Спасибо! Ваша заявка успешно отправлена. Наталья свяжется с вами для обсуждения деталей.';
              formStatus.className = 'form-status success';
              formStatus.style.display = 'block';
            }
          } else {
            if (formStatus) {
              formStatus.textContent = 'Ошибка отправки (статус: ' + response.status + '). Пожалуйста, попробуйте еще раз.';
              formStatus.className = 'form-status error';
              formStatus.style.display = 'block';
            }
          }
        })
        .catch(err => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (formStatus) {
            formStatus.textContent = 'Ошибка сети. Проверьте интернет-соединение.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
          }
        });
      });
    }
  }
  
  function showProductError(message) {
    const container = document.getElementById('productDetailContainer');
    if (container) {
      container.innerHTML = `
        <div class="product-error-box">
          <i class="fa-solid fa-circle-exclamation"></i>
          <h3>Товар не найден</h3>
          <p>${message}</p>
          <a href="gallery.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Вернуться в каталог</a>
        </div>
      `;
    }
  }
  
  // 7. Interactive Contact Form on Main Page (only if exists)
  const contactForm = document.getElementById('orderForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const contact = document.getElementById('formContact').value.trim();
      
      if (!name || !contact) {
        showFormStatus('Пожалуйста, заполните имя и контактные данные.', 'error');
        return;
      }
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;
      
      const formData = new FormData(contactForm);
      if (!formData.has('form-name')) {
        formData.append('form-name', 'contact-homepage');
      }

      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (response.ok) {
          contactForm.reset();
          showFormStatus('Спасибо за ваш запрос! Наталья свяжется с вами в ближайшее время.', 'success');
        } else {
          showFormStatus('Произошла ошибка при отправке (статус: ' + response.status + '). Пожалуйста, попробуйте еще раз.', 'error');
        }
      })
      .catch(err => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showFormStatus('Произошла ошибка сети. Проверьте интернет-соединение.', 'error');
      });
    });
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 8000);
    }
  }

  // 8. Scroll Animation triggers using Intersection Observer
  const animatedElements = document.querySelectorAll('.category-card, .about-content, .about-visual, .contact-container');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
