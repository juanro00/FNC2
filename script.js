// Funcionalidad para el modal de inscripción
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal-inscripcion');
    const transferenciaExpandida = document.getElementById('transferencia-expandida');
    const paymentOptions = document.querySelector('.payment-options');
    const closeBtn = document.querySelector('.close');

    // Función global para abrir modal principal
    window.abrirModalInscripcion = function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        // Asegurar que solo se muestren las opciones de pago
        paymentOptions.style.display = 'flex';
        transferenciaExpandida.style.display = 'none';
    };

    // Cerrar modal principal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });

    // Mostrar sección de transferencia
    window.mostrarTransferencia = function() {
        paymentOptions.style.display = 'none';
        transferenciaExpandida.style.display = 'block';
    };

    // Ocultar sección de transferencia y volver a opciones
    window.ocultarTransferencia = function() {
        paymentOptions.style.display = 'flex';
        transferenciaExpandida.style.display = 'none';
    };

    // Cerrar modal al hacer click fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Función para copiar el alias al portapapeles
    window.copiarAlias = function() {
        const alias = 'fiestacubo';
        navigator.clipboard.writeText(alias).then(function() {
            // Cambiar temporalmente el texto del botón
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '¡Copiado!';
            copyBtn.style.background = '#28a745';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#007bff';
            }, 2000);
        }).catch(function(err) {
            console.error('Error al copiar: ', err);
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = alias;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '¡Copiado!';
            copyBtn.style.background = '#28a745';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#007bff';
            }, 2000);
        });
    };
});

// Funcionalidad existente del header (scroll effect)
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Funcionalidad del cubo 3D (si existe)
const cube = document.getElementById('cube');
if (cube) {
    let isMouseDown = false;
    let startX, startY;
    let rotationX = 0;
    let rotationY = 0;

    cube.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;
        
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mouseup', function() {
        isMouseDown = false;
    });

    // Auto-rotación cuando no hay interacción
    let autoRotate = true;
    let autoRotateInterval;

    function startAutoRotate() {
        autoRotateInterval = setInterval(function() {
            if (autoRotate) {
                rotationY += 0.5;
                cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            }
        }, 50);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    cube.addEventListener('mouseenter', stopAutoRotate);
    cube.addEventListener('mouseleave', startAutoRotate);

    startAutoRotate();
}

// #region SLIDER
class InfiniteSlider {
    constructor(container) {
        this.container = container;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.slides = container.querySelectorAll('.slide');
        this.slideWidth = 500; // Ancho fijo de cada slide
        this.totalSlides = this.slides.length / 2; // 8 slides únicos (duplicados)
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.container.addEventListener('mousedown', this.dragStart.bind(this));
        document.addEventListener('mousemove', this.dragMove.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));
        
        // Touch events
        this.container.addEventListener('touchstart', this.dragStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.dragMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.dragEnd.bind(this));
        
        // Prevent context menu and drag
        this.container.addEventListener('contextmenu', e => e.preventDefault());
        this.container.addEventListener('dragstart', e => e.preventDefault());
        
        // Ajustar el ancho de slides en móvil
        this.adjustSlideWidth();
        window.addEventListener('resize', this.adjustSlideWidth.bind(this));
    }
    
    adjustSlideWidth() {
        const isMobile = window.innerWidth <= 768;
        this.slideWidth = isMobile ? 350 : 500;
        
        this.slides.forEach(slide => {
            slide.style.minWidth = this.slideWidth + 'px';
        });
    }
    
    dragStart(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.container.style.cursor = 'grabbing';
        this.container.style.transition = 'none';
    }
    
    dragMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentPosition = this.getPositionX(e);
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;
        
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    dragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        this.container.style.transition = 'transform 0.3s ease-out';
        
        // Implementar loop infinito
        this.checkInfiniteLoop();
        this.prevTranslate = this.currentTranslate;
    }
    
    checkInfiniteLoop() {
        const totalWidth = this.slideWidth * this.totalSlides;
        
        // Si se movió demasiado hacia la derecha, saltar al final
        if (this.currentTranslate > 0) {
            this.currentTranslate = -totalWidth + (this.currentTranslate % this.slideWidth);
        }
        // Si se movió demasiado hacia la izquierda, saltar al inicio
        else if (this.currentTranslate < -totalWidth) {
            this.currentTranslate = this.currentTranslate % (-totalWidth);
        }
        
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
}

// Initialize slider
const sliderContainer = document.getElementById('sliderContainer');
if (sliderContainer) {
    new InfiniteSlider(sliderContainer);
}
// #endregion