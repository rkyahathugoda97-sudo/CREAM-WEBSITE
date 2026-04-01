document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            navbar.classList.add('py-4');
        }
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up-scroll').forEach(el => observer.observe(el));

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => mobileMenu.classList.remove('opacity-0'), 10);
                mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                mobileMenu.classList.add('opacity-0');
                setTimeout(() => mobileMenu.classList.add('hidden'), 300);
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // Cart Sidebar Logic
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    function toggleCart() {
        if(cartSidebar.classList.contains('translate-x-full')) {
            cartSidebar.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
            setTimeout(() => cartOverlay.classList.remove('opacity-0'), 10);
        } else {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('opacity-0');
            setTimeout(() => cartOverlay.classList.add('hidden'), 300);
        }
    }

    if(cartBtn) cartBtn.addEventListener('click', toggleCart);
    if(closeCart) closeCart.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to cart mock functionality
    const atcButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalStr = document.getElementById('cart-total');
    
    // Load cart from session if exists
    let cart = JSON.parse(sessionStorage.getItem('dreamCart') || '[]');
    updateCartDOM();

    atcButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const img = e.target.getAttribute('data-img');
            
            cart.push({name, price, img});
            sessionStorage.setItem('dreamCart', JSON.stringify(cart));
            updateCartDOM();
            
            const originalText = e.target.innerText;
            e.target.innerText = 'Added to Bag';
            e.target.classList.add('bg-brand-rose', 'text-white');
            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.classList.remove('bg-brand-rose', 'text-white');
            }, 2000);
            
            setTimeout(toggleCart, 500);
        });
    });
    
    function updateCartDOM() {
        if(!cartCount) return;
        
        if(cart.length > 0) {
            cartCount.classList.remove('hidden');
            cartCount.innerText = cart.length;
            
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price;
                cartItems.innerHTML += `
                    <div class="flex gap-4 items-center fade-in-up">
                        <img src="${item.img}" class="w-20 h-20 object-cover border border-brand-pink p-1 bg-white">
                        <div class="flex-1">
                            <h4 class="font-serif text-sm">${item.name}</h4>
                            <p class="text-brand-rose font-semibold">$${item.price.toFixed(2)}</p>
                        </div>
                        <button onclick="removeItem(${index})" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
            
            cartTotalStr.innerText = '$' + total.toFixed(2);
        } else {
            cartCount.classList.add('hidden');
            cartItems.innerHTML = '<p class="text-gray-400 text-center mt-10 empty-msg font-light">Your bag is currently empty.</p>';
            cartTotalStr.innerText = '$0.00';
        }
    }
    
    window.removeItem = (index) => {
        cart.splice(index, 1);
        sessionStorage.setItem('dreamCart', JSON.stringify(cart));
        updateCartDOM();
    }
});
