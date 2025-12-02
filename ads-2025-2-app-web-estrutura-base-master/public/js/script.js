// ===========================================================================
// ARQUIVO: scripts-unificados.js
// DESCRIÇÃO: Scripts JavaScript completos do Sistema de Postos de Combustível
// COMBINA: main.hbs scripts + home.js
// ===========================================================================

// ===========================================================================
// 1. INICIALIZAÇÃO E CONFIGURAÇÕES
// ===========================================================================

/**
 * Inicializa todas as funcionalidades quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema PostoFácil inicializado');
    
    // Inicializar todas as funcionalidades
    initAutoFocus();
    initAnimations();
    initTooltips();
    initButtonEffects();
    initPhoneFormatting();
    initPriceValidation();
    initAutoCloseAlerts();
    initSmoothScroll();
    initTypingEffect();
    initDarkMode();
    initFormHelpers();
});

// ===========================================================================
// 2. FUNÇÕES DE INICIALIZAÇÃO
// ===========================================================================

/**
 * Configura auto-foco nos campos apropriados
 */
function initAutoFocus() {
    // Prioridade 1: Campo de busca na página inicial
    const searchInput = document.querySelector('input[name="busca"]');
    if (searchInput) {
        searchInput.focus();
        console.log('Auto-foco ativado no campo de busca');
    } 
    // Prioridade 2: Primeiro campo de formulário
    else {
        const firstInput = document.querySelector('form input:not([type="hidden"])');
        if (firstInput) {
            firstInput.focus();
            console.log('Auto-foco ativado no primeiro campo do formulário');
        }
    }
}

/**
 * Configura animações com Intersection Observer
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Parar de observar após animação
            }
        });
    }, observerOptions);
    
    // Observar cards de posto
    document.querySelectorAll('.posto-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Observar cards de estatísticas
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    console.log(`Animação ativada para ${document.querySelectorAll('.fade-in').length} elementos`);
}

/**
 * Inicializa tooltips do Bootstrap
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    
    if (tooltipTriggerList.length > 0) {
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
        console.log(`${tooltipList.length} tooltips inicializados`);
    }
}

/**
 * Adiciona efeitos hover aos botões
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn:not(.no-hover)');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Efeito de clique
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
    });
    
    console.log(`Efeitos hover ativados para ${buttons.length} botões`);
}

// ===========================================================================
// 3. FORMATAÇÃO E VALIDAÇÃO DE FORMULÁRIOS
// ===========================================================================

/**
 * Configura formatação automática de telefone
 */
function initPhoneFormatting() {
    const telefoneInput = document.querySelector('input[name="telefone"]');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            formatarTelefone(e);
        });
        
        // Formatar valor inicial se existir
        if (telefoneInput.value) {
            telefoneInput.value = PostoFacil.formatPhone(telefoneInput.value);
        }
        
        console.log('Formatação de telefone ativada');
    }
}

/**
 * Formata número de telefone em tempo real
 * @param {Event} e - Evento de input
 */
function formatarTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (máximo para celular brasileiro)
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Aplicar máscara baseada no comprimento
    if (value.length > 10) {
        // Celular: (99) 99999-9999
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
        // Telefone fixo: (99) 9999-9999
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        // Início: (99) 9999
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
        // Apenos parênteses: (99
        value = value.replace(/^(\d*)/, '($1');
    }
    
    e.target.value = value;
}

/**
 * Configura validação para campos de preço
 */
function initPriceValidation() {
    const priceInputs = document.querySelectorAll('input[type="number"], input[name*="preco"]');
    
    priceInputs.forEach(input => {
        // Validação em tempo real
        input.addEventListener('input', function() {
            validarCampoPreco(this);
        });
        
        // Formatação ao perder o foco
        input.addEventListener('blur', function() {
            formatarCampoPreco(this);
        });
        
        // Validar valor inicial
        if (input.value) {
            validarCampoPreco(input);
        }
    });
    
    console.log(`Validação de preço ativada para ${priceInputs.length} campos`);
}

/**
 * Valida campo de preço
 * @param {HTMLInputElement} input - Campo de entrada
 */
function validarCampoPreco(input) {
    // Garantir que não seja negativo
    if (input.value < 0) {
        input.value = 0;
    }
    
    // Limitar casas decimais
    if (input.value.includes('.')) {
        const parts = input.value.split('.');
        if (parts[1].length > 3) {
            input.value = parts[0] + '.' + parts[1].substring(0, 3);
        }
    }
}

/**
 * Formata campo de preço ao perder o foco
 * @param {HTMLInputElement} input - Campo de entrada
 */
function formatarCampoPreco(input) {
    if (input.value.includes(',')) {
        input.value = input.value.replace(',', '.');
    }
    
    // Adicionar zeros decimais se necessário
    if (input.value && !isNaN(input.value)) {
        const num = parseFloat(input.value);
        input.value = num.toFixed(3).replace('.', ',');
    }
}

/**
 * Formata valor de preço enquanto digita (para campos de texto)
 * @param {HTMLInputElement} input - Campo de entrada
 */
function formatPrice(input) {
    let value = input.value.replace(/[^\d,]/g, '');
    
    if (value.includes(',')) {
        let parts = value.split(',');
        parts[0] = parts[0].replace(/\D/g, '');
        if (parts.length > 1) {
            parts[1] = parts[1].replace(/\D/g, '').substring(0, 3);
        }
        input.value = parts.join(',');
    } else {
        input.value = value;
    }
}

// ===========================================================================
// 4. FUNÇÕES DE UI E INTERATIVIDADE
// ===========================================================================

/**
 * Configura fechamento automático de alertas
 */
function initAutoCloseAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                const closeButton = alert.querySelector('.btn-close');
                if (closeButton) {
                    closeButton.click();
                } else {
                    alert.style.opacity = '0';
                    alert.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.remove();
                        }
                    }, 500);
                }
            }
        }, 5000); // 5 segundos
    });
    
    console.log(`Auto-fechamento configurado para ${alerts.length} alertas`);
}

/**
 * Configura smooth scroll para links internos
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    window.scrollTo({
                        top: target.offsetTop - 80, // Ajuste para header fixo
                        behavior: 'smooth'
                    });
                    
                    // Adicionar classe ativa ao link
                    document.querySelectorAll('a[href^="#"]').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    console.log('Smooth scroll ativado para links internos');
}

/**
 * Efeito de digitação no título (apenas página inicial)
 */
function initTypingEffect() {
    const title = document.querySelector('.search-section h2');
    
    if (title && !sessionStorage.getItem('typingEffectShown')) {
        const originalText = title.textContent;
        let index = 0;
        
        title.textContent = '';
        title.style.minHeight = '60px'; // Evitar saltos no layout
        
        const typeWriter = () => {
            if (index < originalText.length) {
                title.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 50); // Velocidade de digitação
            } else {
                sessionStorage.setItem('typingEffectShown', 'true');
            }
        };
        
        // Iniciar efeito após 1 segundo
        setTimeout(typeWriter, 1000);
        
        console.log('Efeito de digitação ativado');
    }
}

/**
 * Configura sistema de modo escuro/claro
 */
function initDarkMode() {
    // Criar botão de toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'btn btn-outline-secondary btn-sm dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    darkModeToggle.title = 'Alternar modo escuro';
    darkModeToggle.setAttribute('aria-label', 'Alternar modo escuro');
    
    // Estilos do botão
    Object.assign(darkModeToggle.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1000',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    });
    
    // Evento de clique
    darkModeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            this.innerHTML = '<i class="bi bi-sun"></i>';
            this.title = 'Alternar para modo claro';
            localStorage.setItem('darkMode', 'enabled');
            console.log('Modo escuro ativado');
        } else {
            this.innerHTML = '<i class="bi bi-moon"></i>';
            this.title = 'Alternar para modo escuro';
            localStorage.setItem('darkMode', 'disabled');
            console.log('Modo claro ativado');
        }
        
        // Disparar evento customizado
        document.dispatchEvent(new CustomEvent('darkModeChanged', {
            detail: { isDarkMode }
        }));
    });
    
    // Verificar preferência salva
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        darkModeToggle.title = 'Alternar para modo claro';
    }
    
    // Adicionar botão ao DOM
    document.body.appendChild(darkModeToggle);
    
    // Adicionar estilos para modo escuro
    addDarkModeStyles();
    
    console.log('Sistema de modo escuro inicializado');
}

/**
 * Adiciona estilos CSS para modo escuro
 */
function addDarkModeStyles() {
    const darkModeStyles = `
        /* Modo Escuro */
        body.dark-mode {
            background-color: #121212;
            color: #e0e0e0;
        }
        
        body.dark-mode .header {
            background: linear-gradient(135deg, #0d1b2a, #1b263b);
        }
        
        body.dark-mode .posto-card,
        body.dark-mode .stat-card,
        body.dark-mode .card,
        body.dark-mode .table {
            background-color: #1e1e1e;
            border-color: #333;
            color: #e0e0e0;
        }
        
        body.dark-mode .table th {
            background-color: #2d3748;
            color: #e0e0e0;
        }
        
        body.dark-mode .table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        body.dark-mode .combustiveis {
            background-color: #2d2d2d;
        }
        
        body.dark-mode .footer {
            background-color: #0d0d0d;
        }
        
        body.dark-mode .search-section {
            background: linear-gradient(rgba(13, 27, 42, 0.9), rgba(27, 38, 59, 0.8)), 
                        url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
        }
        
        body.dark-mode .form-control {
            background-color: #2d2d2d;
            border-color: #444;
            color: #e0e0e0;
        }
        
        body.dark-mode .form-control:focus {
            background-color: #333;
            border-color: #3498db;
            color: #e0e0e0;
        }
        
        body.dark-mode .btn-outline-light {
            border-color: #e0e0e0;
            color: #e0e0e0;
        }
        
        body.dark-mode .btn-outline-light:hover {
            background-color: #e0e0e0;
            color: #121212;
        }
        
        body.dark-mode .dark-mode-toggle {
            background-color: #2d3748;
            border-color: #4a5568;
            color: #e0e0e0;
        }
        
        /* Ajustes para texto em modo escuro */
        body.dark-mode .text-muted {
            color: #a0aec0 !important;
        }
        
        body.dark-mode h1,
        body.dark-mode h2,
        body.dark-mode h3,
        body.dark-mode h4,
        body.dark-mode h5,
        body.dark-mode h6 {
            color: #e0e0e0;
        }
    `;
    
    // Evitar duplicação de estilos
    if (!document.querySelector('#dark-mode-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dark-mode-styles';
        styleSheet.textContent = darkModeStyles;
        document.head.appendChild(styleSheet);
    }
}

// ===========================================================================
// 5. FUNÇÕES AUXILIARES DE FORMULÁRIO
// ===========================================================================

/**
 * Inicializa helpers de formulário
 */
function initFormHelpers() {
    // Validação de números positivos para todos os campos number
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // Máscara para CPF/CNPJ (se houver)
    const cpfCnpjInput = document.querySelector('input[name*="cpf"], input[name*="cnpj"]');
    if (cpfCnpjInput) {
        cpfCnpjInput.addEventListener('input', function(e) {
            formatarCpfCnpj(e);
        });
    }
    
    // Validação de email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarEmail(this);
        });
    });
}

/**
 * Formata CPF ou CNPJ
 * @param {Event} e - Evento de input
 */
function formatarCpfCnpj(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // Formatar como CPF: 000.000.000-00
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
        }
    } else {
        // Formatar como CNPJ: 00.000.000/0000-00
        if (value.length > 12) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        } else if (value.length > 8) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
        }
    }
    
    e.target.value = value;
}

/**
 * Valida formato de email
 * @param {HTMLInputElement} input - Campo de email
 */
function validarEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.value && !emailRegex.test(input.value)) {
        input.classList.add('is-invalid');
        
        // Adicionar mensagem de erro
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'Por favor, insira um email válido.';
            input.parentNode.appendChild(feedback);
        }
    } else {
        input.classList.remove('is-invalid');
        
        // Remover mensagem de erro
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    }
}

// ===========================================================================
// 6. FUNÇÕES UTILITÁRIAS GLOBAIS
// ===========================================================================

/**
 * Namespace global para funções utilitárias do sistema
 */
window.PostoFacil = {
    /**
     * Formatar número para moeda brasileira
     * @param {number|string} value - Valor a ser formatado
     * @param {number} decimals - Número de casas decimais
     * @returns {string} Valor formatado em Real brasileiro
     */
    formatCurrency: function(value, decimals = 2) {
        const num = parseFloat(value);
        if (isNaN(num)) return 'R$ 0,00';
        
        return num.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    /**
     * Formatar número de telefone
     * @param {string} phone - Número de telefone
     * @returns {string} Telefone formatado
     */
    formatPhone: function(phone) {
        if (!phone) return '';
        
        const cleaned = ('' + phone).replace(/\D/g, '');
        
        if (cleaned.length === 11) {
            // Celular: (99) 99999-9999
            const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3];
            }
        } else if (cleaned.length === 10) {
            // Telefone fixo: (99) 9999-9999
            const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3];
            }
        }
        
        return phone;
    },
    
    /**
     * Calcular porcentagem de economia
     * @param {number} currentPrice - Preço atual
     * @param {number} averagePrice - Preço médio
     * @returns {string} Porcentagem de economia formatada
     */
    calculateSavings: function(currentPrice, averagePrice) {
        if (!currentPrice || !averagePrice || averagePrice === 0) return '0.0';
        
        const savings = ((averagePrice - currentPrice) / averagePrice) * 100;
        return Math.max(savings, 0).toFixed(1); // Não mostrar valores negativos
    },
    
    /**
     * Mostrar notificação flutuante
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo de notificação (success, danger, warning, info)
     * @param {number} duration - Duração em milissegundos
     */
    showNotification: function(message, type = 'info', duration = 5000) {
        // Criar elemento da notificação
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        
        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            minWidth: '300px',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease'
        });
        
        // Conteúdo da notificação
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${this.getNotificationIcon(type)} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Adicionar animação de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Configurar auto-remoção
        const removeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        };
        
        // Fechar automaticamente
        const autoClose = setTimeout(removeNotification, duration);
        
        // Fechar ao clicar no botão
        notification.querySelector('.btn-close').addEventListener('click', function(e) {
            e.preventDefault();
            clearTimeout(autoClose);
            removeNotification();
        });
        
        // Adicionar estilo de animação se não existir
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = `
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
            `;
            document.head.appendChild(styleSheet);
        }
        
        return notification;
    },
    
    /**
     * Obter ícone apropriado para tipo de notificação
     * @param {string} type - Tipo de notificação
     * @returns {string} Classe do ícone
     */
    getNotificationIcon: function(type) {
        const icons = {
            'success': 'bi-check-circle-fill',
            'danger': 'bi-exclamation-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        
        return icons[type] || 'bi-info-circle-fill';
    },
    
    /**
     * Validar formulário antes de enviar
     * @param {HTMLFormElement} form - Formulário a ser validado
     * @returns {boolean} True se válido, False se inválido
     */
    validateForm: function(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
                
                // Adicionar mensagem de erro
                let feedback = field.nextElementSibling;
                if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                    feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Este campo é obrigatório.';
                    field.parentNode.appendChild(feedback);
                }
            } else {
                field.classList.remove('is-invalid');
                
                // Remover mensagem de erro
                const feedback = field.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            }
        });
        
        return isValid;
    },
    
    /**
     * Formatar data para exibição brasileira
     * @param {Date|string} date - Data a ser formatada
     * @returns {string} Data formatada
     */
    formatDate: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Carregar dados via AJAX
     * @param {string} url - URL para requisição
     * @param {Object} options - Opções da requisição
     * @returns {Promise} Promise com os dados
     */
    loadData: async function(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : null
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showNotification('Erro ao carregar dados. Tente novamente.', 'danger');
            throw error;
        }
    }
};

// ===========================================================================
// 7. EXPORTAR FUNÇÕES PARA USO GLOBAL (se necessário)
// ===========================================================================

// Torna algumas funções disponíveis globalmente
window.formatPrice = formatPrice;
window.formatarTelefone = formatarTelefone;
window.formatarCpfCnpj = formatarCpfCnpj;

// ===========================================================================
// 8. DEPURAÇÃO E LOG
// ===========================================================================

// Log de inicialização bem-sucedida
console.log('PostoFácil - Sistema inicializado com sucesso!');
console.log(`Versão: ${document.documentElement.getAttribute('data-app-version') || '1.0.0'}`);

// Expor estado global para depuração
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugMode = true;
    console.log('Modo de depuração ativado');
}

// Tratamento de erros globais
window.addEventListener('error', function(event) {
    console.error('Erro não tratado:', event.error);
    
    // Mostrar notificação amigável em produção
    if (!window.debugMode) {
        PostoFacil.showNotification(
            'Ocorreu um erro inesperado. Por favor, recarregue a página.',
            'danger',
            10000
        );
    }
    
    // Prevenir comportamento padrão se necessário
    event.preventDefault();
});

// Log quando o usuário sai da página
window.addEventListener('beforeunload', function() {
    console.log('Usuário saindo do sistema PostoFácil');
});