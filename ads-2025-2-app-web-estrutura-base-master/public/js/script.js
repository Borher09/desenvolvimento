// src/public/js/home.js

// Auto-foco no campo de busca
document.addEventListener('DOMContentLoaded', function() {
    // Foco no campo de busca
    const searchInput = document.querySelector('input[name="busca"]');
    if (searchInput) {
        searchInput.focus();
    }
    
    // Configurar Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar cards de posto para animação
    document.querySelectorAll('.posto-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Observar cards de estatísticas
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Inicializar tooltips do Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length > 0) {
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }
    
    // Adicionar efeitos hover aos botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Formatar telefone em tempo real
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length > 10) {
                // Formato: (11) 99999-9999
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                // Formato: (11) 9999-9999
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                // Formato: (11) 9999
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                // Formato: (11
                value = value.replace(/^(\d*)/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // Validação de números nos campos de preço
    const priceInputs = document.querySelectorAll('input[type="number"]');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
            
            // Limitar casas decimais
            if (this.value.includes('.')) {
                const parts = this.value.split('.');
                if (parts[1].length > 3) {
                    this.value = parts[0] + '.' + parts[1].substring(0, 3);
                }
            }
        });
        
        // Converter vírgula para ponto
        input.addEventListener('blur', function() {
            if (this.value.includes(',')) {
                this.value = this.value.replace(',', '.');
            }
        });
    });
    
    // Fechar alertas automaticamente após 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert) {
                const closeButton = alert.querySelector('.btn-close');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }, 5000);
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Efeito de digitação no título (opcional)
    const typingEffect = () => {
        const title = document.querySelector('.search-section h2');
        if (!title) return;
        
        const originalText = title.textContent;
        let index = 0;
        
        title.textContent = '';
        
        const typeWriter = () => {
            if (index < originalText.length) {
                title.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Iniciar efeito após 1 segundo
        setTimeout(typeWriter, 1000);
    };
    
    // Ativar efeito de digitação apenas na primeira visita
    if (!sessionStorage.getItem('typingEffectShown')) {
        typingEffect();
        sessionStorage.setItem('typingEffectShown', 'true');
    }
    
    // Alternar modo escuro (opcional)
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'btn btn-outline-secondary btn-sm';
    darkModeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.bottom = '20px';
    darkModeToggle.style.right = '20px';
    darkModeToggle.style.zIndex = '1000';
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = '<i class="bi bi-sun"></i>';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            this.innerHTML = '<i class="bi bi-moon"></i>';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Verificar preferência de modo escuro salva
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun"></i>';
    }
    
    document.body.appendChild(darkModeToggle);
    
    // Adicionar estilos para modo escuro
    const darkModeStyles = `
        body.dark-mode {
            background-color: #121212;
            color: #e0e0e0;
        }
        
        body.dark-mode .posto-card,
        body.dark-mode .stat-card {
            background-color: #1e1e1e;
            border-color: #333;
        }
        
        body.dark-mode .combustiveis {
            background-color: #2d2d2d;
        }
        
        body.dark-mode .footer {
            background-color: #0d0d0d;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = darkModeStyles;
    document.head.appendChild(styleSheet);
});

// Funções utilitárias globais
window.PostoFacil = {
    // Formatar número para moeda brasileira
    formatCurrency: function(value, decimals = 2) {
        return parseFloat(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Formatar telefone
    formatPhone: function(phone) {
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },
    
    // Calcular economia
    calculateSavings: function(currentPrice, averagePrice) {
        if (!currentPrice || !averagePrice || averagePrice === 0) return 0;
        const savings = ((averagePrice - currentPrice) / averagePrice) * 100;
        return savings.toFixed(1);
    },
    
    // Mostrar notificação
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
};