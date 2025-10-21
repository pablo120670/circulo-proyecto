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
        const finalRadius = Math.max(radius, size / 4) + 2; // Radio mínimo + 2 píxeles
        
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
});