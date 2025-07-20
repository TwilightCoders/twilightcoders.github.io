class InfiniteCarousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.cards = Array.from(this.carousel.querySelectorAll('.project-card'));
        this.totalCards = this.cards.length;
        this.rotation = Math.random() * 360; // Random starting rotation
        this.isAnimating = false;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50; // Minimum drag distance to trigger navigation
        this.isStacked = true; // Start in stacked state
        
        // Oval parameters
        this.radiusX = 400; // Horizontal radius
        this.radiusZ = 200; // Depth radius
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCardClickListeners();
        this.updateCarousel();
        
        // Fan out after 1.5 seconds
        setTimeout(() => {
            this.fanOut();
        }, 1500);
    }
    
    setupEventListeners() {
        const container = this.carousel.parentElement; // carousel-container
        
        // Mouse events on container and cards
        container.addEventListener('mousedown', this.handleStart.bind(this));
        this.carousel.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));
        
        // Touch events on container and cards
        container.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        this.carousel.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Prevent default drag behavior
        container.addEventListener('dragstart', e => e.preventDefault());
        this.carousel.addEventListener('dragstart', e => e.preventDefault());
        
        // Add drag listeners to individual cards too
        this.cards.forEach(card => {
            card.addEventListener('mousedown', this.handleStart.bind(this));
            card.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
            card.addEventListener('dragstart', e => e.preventDefault());
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    setupCardClickListeners() {
        this.cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Only handle clicks if we haven't dragged and not stacked
                if (this.hasDragged || this.isStacked || this.isAnimating) return;
                
                // Prevent default link behavior for now
                e.preventDefault();
                e.stopPropagation();
                
                // Simply bring any clicked card to center
                this.goToSlide(index);
            });
        });
    }
    
    handleStart(e) {
        if (this.isAnimating) return;
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        this.startX = clientX;
        this.currentX = clientX;
        this.hasDragged = false; // Reset drag flag
        this.isDragging = false; // Reset dragging state
        
        // Don't immediately set dragging - wait for actual movement
    }
    
    handleMove(e) {
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        this.currentX = clientX;
        
        const deltaX = this.currentX - this.startX;
        
        // Start dragging if we've moved enough
        if (!this.isDragging && Math.abs(deltaX) > 5) {
            this.isDragging = true;
            this.hasDragged = true;
            this.carousel.classList.add('dragging');
        }
        
        if (!this.isDragging) return;
        
        e.preventDefault();
        // Don't apply transforms during drag - wait for end
    }
    
    handleEnd(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.carousel.classList.remove('dragging');
            
            const deltaX = this.currentX - this.startX;
            const rotationDelta = (deltaX / window.innerWidth) * 180;
            
            // Update rotation based on drag
            this.rotation += rotationDelta;
            
            // Optionally snap to show cards clearly
            if (Math.abs(deltaX) > this.threshold) {
                const snapAngle = 360 / this.totalCards;
                const snapTarget = Math.round(this.rotation / snapAngle) * snapAngle;
                this.rotation = snapTarget;
            }
            
            this.updateCarousel();
        }
        
        // Reset drag tracking
        this.hasDragged = false;
    }
    
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        }
    }
    
    next() {
        if (this.isAnimating) return;
        this.rotation -= 360 / this.totalCards;
        this.updateCarousel();
    }
    
    prev() {
        if (this.isAnimating) return;
        this.rotation += 360 / this.totalCards;
        this.updateCarousel();
    }
    
    updateCarousel() {
        this.isAnimating = true;
        this.applyTransforms(this.rotation);
        
        // Clear animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    applyTransforms(currentRotation) {
        this.cards.forEach((card, index) => {
            if (this.isStacked) {
                // Stack all cards on top of each other in center
                card.style.transform = `translate3d(0px, 0, ${index * 2}px) scale(1)`;
                card.style.opacity = index === this.totalCards - 1 ? 1 : 0.8; // Top card fully visible
                card.style.zIndex = index;
                card.classList.remove('active', 'side', 'hidden');
                card.classList.add('active');
            } else {
                // Calculate angle for this card in the oval
                const angleStep = 360 / this.totalCards;
                const angle = (index * angleStep + currentRotation) * Math.PI / 180;
                
                // Calculate oval position
                const x = Math.sin(angle) * this.radiusX;
                const z = Math.cos(angle) * this.radiusZ;
                
                // Calculate scale based on z-position (depth)
                const normalizedZ = (z + this.radiusZ) / (this.radiusZ * 2); // 0 to 1
                const scale = 0.6 + (normalizedZ * 0.4); // Scale from 0.6 to 1.0
                const opacity = 0.4 + (normalizedZ * 0.6); // Opacity from 0.4 to 1.0
                
                // Calculate z-index (closer objects in front)
                const zIndex = Math.round(50 + normalizedZ * 50);
                
                // Apply 3D transform
                card.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;
                
                // Update card states for styling
                this.updateCardState(card, normalizedZ);
            }
        });
    }
    
    updateCardState(card, normalizedZ) {
        // Remove all state classes
        card.classList.remove('active', 'side', 'hidden');
        
        // Determine state based on depth (z-position)
        if (normalizedZ > 0.7) {
            card.classList.add('active'); // Front cards
        } else if (normalizedZ > 0.3) {
            card.classList.add('side'); // Side cards
        } else {
            card.classList.add('hidden'); // Back cards
            // Completely remove from rendering to prevent artifacts
            card.style.display = 'none';
            return;
        }
        
        // Make sure visible cards are shown
        card.style.display = 'flex';
        card.style.visibility = 'visible';
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        const angleStep = 360 / this.totalCards;
        this.rotation = -index * angleStep;
        this.updateCarousel();
    }
    
    fanOut() {
        this.isStacked = false;
        this.updateCarousel();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.getElementById('carousel');
    if (carouselElement) {
        new InfiniteCarousel(carouselElement);
    }
});