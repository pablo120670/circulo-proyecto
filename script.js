document.addEventListener('DOMContentLoaded', function() {
    function createCircularText(element) {
        const text = element.getAttribute('data-text') || 'TEXTO CIRCULAR';
        const size = parseInt(element.getAttribute('data-size')) || 200;
        const color = element.getAttribute('data-color') || '#ffffff';
        const speed = parseFloat(element.getAttribute('data-speed')) || 25;
        const fontSize = parseInt(element.getAttribute('data-font-size')) || 12;
        const separator = element.getAttribute('data-separator') || '✦';
        const spacing = parseFloat(element.getAttribute('data-spacing')) || 1.2;
        const separatorMode = element.getAttribute('data-separator-mode') || 'auto';
        const manualText = element.getAttribute('data-manual-text') || text;
        
        let spacedText;
        let repeatedText;
        
        if (separatorMode === 'manual') {
            // Modo manual: usar el texto con guiones y reemplazar por el separador elegido
            spacedText = manualText.replace(/-/g, ` ${separator} `);
            repeatedText = `${spacedText} ${separator} ${spacedText}`;
        } else {
            // Modo automático: dividir el texto en palabras y agregar separadores
            const words = text.split(' ').filter(word => word.trim() !== '');
            spacedText = words.join(` ${separator} `);
            repeatedText = `${spacedText} ${separator} ${spacedText}`;
        }
        
        // Crear un elemento temporal para medir el texto con espaciado
        const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tempText.setAttribute('font-size', fontSize);
        tempText.setAttribute('font-family', 'Poppins, sans-serif');
        tempText.setAttribute('letter-spacing', `${spacing * 0.1}em`);
        tempText.textContent = spacedText;
        tempText.style.visibility = 'hidden';
        tempText.style.position = 'absolute';
        tempText.style.top = '-9999px';
        
        document.body.appendChild(tempText);
        const textLength = tempText.getComputedTextLength();
        document.body.removeChild(tempText);
        
        // Calcular el radio basado en la longitud del texto con espaciado
        const circumference = textLength * 1.2; // 20% de margen para separadores
        const radius = circumference / (2 * Math.PI);
        const finalRadius = Math.max(radius, size / 4); // Radio mínimo
        
        // Crear el SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        
        // Crear el path circular
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathId = 'circlePath-' + Math.random().toString(36).substr(2, 9);
        path.setAttribute('id', pathId);
        path.setAttribute('d', `M${size/2},${size/2} m-${finalRadius},0 a${finalRadius},${finalRadius} 0 1,1 ${finalRadius*2},0 a${finalRadius},${finalRadius} 0 1,1 -${finalRadius*2},0`);
        
        // Crear el texto
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('font-family', 'Poppins, sans-serif');
        textElement.setAttribute('fill', color);
        textElement.setAttribute('letter-spacing', `${spacing * 0.1}em`);
        textElement.style.animation = `rotateText ${speed}s linear infinite`;
        textElement.style.transformOrigin = 'center';
        
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        textPath.setAttribute('href', '#' + pathId);
        textPath.textContent = repeatedText;
        
        textElement.appendChild(textPath);
        
        // Crear el defs
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(path);
        
        svg.appendChild(defs);
        svg.appendChild(textElement);
        
        element.appendChild(svg);
    }
    
    // Aplicar a todos los elementos con clase circular-text
    document.querySelectorAll('.circular-text').forEach(createCircularText);
    
    // Función para recalcular en caso de redimensionamiento
    window.addEventListener('resize', function() {
        document.querySelectorAll('.circular-text').forEach(function(element) {
            element.innerHTML = '';
            createCircularText(element);
        });
    });
    
    // Controles interactivos
    const customText = document.getElementById('customText');
    const customSize = document.getElementById('customSize');
    const customColor = document.getElementById('customColor');
    const customSpeed = document.getElementById('customSpeed');
    const customSeparator = document.getElementById('customSeparator');
    const createCustomBtn = document.getElementById('createCustom');
    const customArea = document.getElementById('customArea');
    const sizeValue = document.getElementById('sizeValue');
    const speedValue = document.getElementById('speedValue');
    
    // Actualizar valores en tiempo real
    customSize.addEventListener('input', function() {
        sizeValue.textContent = this.value + 'px';
    });
    
    customSpeed.addEventListener('input', function() {
        speedValue.textContent = this.value + 's';
    });
    
    // Crear texto personalizado
    createCustomBtn.addEventListener('click', function() {
        const text = customText.value.trim();
        if (!text) {
            showNotification('Por favor, escribe algún texto');
            return;
        }
        
        // Limpiar área personalizada
        customArea.innerHTML = '';
        
        // Crear nuevo elemento circular
        const newCircularText = document.createElement('div');
        newCircularText.className = 'circular-text';
        newCircularText.setAttribute('data-text', text);
        newCircularText.setAttribute('data-size', customSize.value);
        newCircularText.setAttribute('data-color', customColor.value);
        newCircularText.setAttribute('data-speed', customSpeed.value);
        newCircularText.setAttribute('data-font-size', '14');
        newCircularText.setAttribute('data-separator', customSeparator.value);
        newCircularText.setAttribute('data-spacing', '1.2');
        
        customArea.appendChild(newCircularText);
        
        // Crear el texto circular
        createCircularText(newCircularText);
        
        // Limpiar inputs
        customText.value = '';
        
        showNotification('¡Texto personalizado creado!');
    });
    
    // Permitir crear con Enter
    customText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createCustomBtn.click();
        }
    });
    
    // Función para mostrar notificaciones
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1000;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Efectos de partículas de fondo
    createParticles();
    
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Crear partículas
        for (let i = 0; i < 30; i++) {
            createParticle(particleContainer);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        const symbols = ['✦', '⭐', '✨', '★', '◆', '●'];
        particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `
            position: absolute;
            color: rgba(255, 255, 255, 0.2);
            font-size: ${Math.random() * 15 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 10}s linear infinite;
            pointer-events: none;
        `;
        
        // Agregar animación de flotación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(particle);
        
        // Recrear partícula cuando termine la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle(container);
            }
        }, (Math.random() * 15 + 10) * 1000);
    }
});
