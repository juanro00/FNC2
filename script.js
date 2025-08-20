// #region SCROLL HEADER ANIMATION
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// #endregion

// #region CUBE ANIMATION
const cube = document.getElementById('cube');
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

/**
 * Linear interpolation function for smooth animations
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Mouse move event handler for cube rotation
 */
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate rotation based on mouse position relative to center
    targetX = ((e.clientY - centerY) / centerY) * 45;
    targetY = ((e.clientX - centerX) / centerX) * 45;
});

/**
 * Animation loop for smooth cube rotation
 */
function animateCube() {
    const currentTransform = cube.style.transform;
    const rotateXMatch = currentTransform.match(/rotateX\(([-\d.]+)deg\)/);
    const rotateYMatch = currentTransform.match(/rotateY\(([-\d.]+)deg\)/);

    const currentX = rotateXMatch ? parseFloat(rotateXMatch[1]) : 0;
    const currentY = rotateYMatch ? parseFloat(rotateYMatch[1]) : 0;

    // Smooth interpolation to target rotation
    const smoothX = lerp(currentX, targetX, 0.1);
    const smoothY = lerp(currentY, targetY, 0.1);

    cube.style.transform = `rotateX(${smoothX}deg) rotateY(${smoothY}deg)`;
    
    // Continue animation loop
    requestAnimationFrame(animateCube);
}

// Initialize cube animation
animateCube();
// #endregion

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
        new InfiniteSlider(sliderContainer);
// #endregion