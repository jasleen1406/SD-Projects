document.addEventListener('DOMContentLoaded', () => {
  const authButton = document.querySelector('#auth-button');

  if (!authButton) {
    return;
  }
  fetch('/api/me')
    .then(response => response.json())
    .then(data => {
      if (data.authenticated) {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') {
          window.location.href = '/join';
          return;
        }

        authButton.textContent = `Logout (${data.username})`;
        authButton.href = '/logout';
        authButton.classList.remove('button--login');
        authButton.classList.add('button--logout');
      } else {
        authButton.textContent = 'Login';
        authButton.href = '/login';
        authButton.classList.remove('button--logout');
        authButton.classList.add('button--login');
      }
    })
    .catch(() => {
      authButton.textContent = 'Login';
      authButton.href = '/login';
      authButton.classList.remove('button--logout');
      authButton.classList.add('button--login');
    });
});

// Insert a clickable app brand in the top-right that routes to /join or /login
document.addEventListener('DOMContentLoaded', function () {
  try {
    var href = (window.location.pathname && window.location.pathname.toLowerCase().includes('login')) ? '/login' : '/join';
    var variantClass = href === '/login' ? 'brand--dark' : 'brand--light';

    // Prefer making the existing top-left brand clickable
    var headerBrand = document.querySelector('.page-header__brand');
    if (headerBrand) {
      if (headerBrand.tagName && headerBrand.tagName.toLowerCase() === 'a') {
        headerBrand.href = href;
        headerBrand.classList.add(variantClass);
      } else {
        var aEl = document.createElement('a');
        aEl.className = headerBrand.className + ' ' + variantClass;
        aEl.id = 'app-brand';
        aEl.href = href;
        aEl.setAttribute('aria-label', 'Go to chat or login');
        aEl.innerHTML = headerBrand.innerHTML;
        headerBrand.parentNode.replaceChild(aEl, headerBrand);
      }
      return;
    }

    // Fallback: create a small fixed brand on the top-right (used if no header brand exists)
    var existing = document.getElementById('app-brand');
    if (existing) return;

    var a = document.createElement('a');
    a.id = 'app-brand';
    a.className = 'app-brand ' + variantClass;
    a.textContent = 'Chat App';
    a.href = href;
    a.setAttribute('aria-label', 'Go to chat or login');

    var header = document.querySelector('header') || document.body;
    header.appendChild(a);
  } catch (e) {
    console.error('app-brand init error', e);
  }
});
