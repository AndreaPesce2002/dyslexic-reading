/**
 * Simulatore di Dislessia - Classe principale
 * Questa classe simula tre difficoltà comuni nella dislessia:
 * 1. Confusione tra lettere simili (a/e)
 * 2. Difficoltà di messa a fuoco su parole lunghe
 * 3. Sostituzione involontaria di parole simili
 */
class DyslexiaSimulator {
    constructor() {
        // Testo originale inserito dall'utente
        this.originalText = '';
        
        // Timer per gli effetti automatici delle tre regole
        this.intervals = {
            rule1: null,  // Timer per sostituzione a->e
            rule2: null,  // Timer per sfocatura graduale
            rule3: null   // Timer per sostituzione parole
        };
        
        // Dizionario delle parole che possono essere confuse (Regola 3)
        // Ogni parola ha una lista di possibili sostituzioni errate
        this.wordSubstitutions = {
            'lettura': ['lettera', 'letture', 'lettore'],
            'competenze': ['competenza', 'componenti', 'competere'],
            'apprendimento': ['apprendere', 'apprendista', 'apprendendo'],
            'comunicazione': ['comunicare', 'comunicato', 'comunicando', 'patenti'],
            'persone': ['persona', 'personale', 'personaggio'],
            'dislessia': ['dislessico', 'dislessica', 'dislessici'],
            'processo': ['processore', 'processare', 'processato'],
            'presentare': ['presente', 'presentato', 'presentando'],
            'sfide': ['sfida', 'sfidare', 'sfidante'],
            'significative': ['significato', 'significare', 'significando'],
            'disturbo': ['disturbare', 'disturbato', 'disturbando'],
            'specifico': ['specifica', 'specificare', 'specificando'],
            'influisce': ['influenza', 'influenzare', 'influenzando'],
            'capacità': ['capace', 'capaci', 'capacitare'],
            'leggere': ['legge', 'leggendo', 'lettore'],
            'precisione': ['preciso', 'precisare', 'precisando'],
            'fluidità': ['fluido', 'fluire', 'fluendo'],
            'difficoltà': ['difficile', 'difficili', 'difficoltoso'],
            'riconoscere': ['riconosciuto', 'riconoscimento', 'riconoscendo'],
            'parole': ['parola', 'parlare', 'parlando'],
            'comprensione': ['comprendere', 'compreso', 'comprendendo'],
            'velocità': ['veloce', 'velocemente', 'velocizzare'],
            'simulatore': ['simulare', 'simulato', 'simulando'],
            'comprendere': ['comprensione', 'compreso', 'comprendendo'],
            'meglio': ['melo', 'migliorare'],
            'attraverso': ['attraversare', 'attraversato', 'attraversando'],
            'esperienza': ['esperto', 'esperire', 'esperendo'],
            'interattiva': ['interazione', 'interagire', 'interagendo'],
            'riproduce': ['riprodurre', 'riprodotto', 'riproducendo'],
            'effetti': ['effetto', 'affetti'],
            'sperimentare': ['sperimento', 'sperimentato', 'sperimentando'],
            'durante': ['durare', 'durata', 'durando'],
            'tuttavia': ['tutti', 'tutto']
        };
        
        // Avvia l'inizializzazione
        this.init();
    }
    
    /**
     * Inizializza il simulatore collegando gli eventi e processando il testo
     */
    init() {
        this.bindEvents();
        this.processText();
    }
    
    /**
     * Collega tutti gli eventi dell'interfaccia utente
     */
    bindEvents() {
        // Ottieni riferimenti agli elementi HTML
        const originalTextArea = document.getElementById('originalText');
        const rule1Checkbox = document.getElementById('rule1');
        const rule2Checkbox = document.getElementById('rule2');
        const rule3Checkbox = document.getElementById('rule3');
        const resetBtn = document.getElementById('resetBtn');
        
        // Quando l'utente scrive nel textarea, aggiorna il testo processato
        originalTextArea.addEventListener('input', () => {
            this.processText();
        });
        
        // Attiva/disattiva la Regola 1 (sostituisci 'a' con 'e')
        rule1Checkbox.addEventListener('change', () => {
            this.toggleRule1(rule1Checkbox.checked);
        });
        
        // Attiva/disattiva la Regola 2 (sfocatura graduale)
        rule2Checkbox.addEventListener('change', () => {
            this.toggleRule2(rule2Checkbox.checked);
        });
        
        // Attiva/disattiva la Regola 3 (sostituzione parole)
        rule3Checkbox.addEventListener('change', () => {
            this.toggleRule3(rule3Checkbox.checked);
        });
        
        // Pulsante per resettare tutto il testo
        resetBtn.addEventListener('click', () => {
            this.resetText();
        });
    }
    
    /**
     * Processa il testo inserito dall'utente e applica le regole attive
     */
    processText() {
        // Leggi il testo dal textarea
        const originalTextArea = document.getElementById('originalText');
        this.originalText = originalTextArea.value;
        
        // Se il testo è vuoto, pulisci l'output
        if (!this.originalText.trim()) {
            document.getElementById('processedText').innerHTML = '';
            return;
        }
        
        // Crea la versione processata del testo
        this.updateProcessedText();
        
        // Riattiva le regole che sono selezionate
        if (document.getElementById('rule1').checked) {
            this.toggleRule1(true);
        }
        if (document.getElementById('rule2').checked) {
            this.toggleRule2(true);
        }
        if (document.getElementById('rule3').checked) {
            this.toggleRule3(true);
        }
    }
    
    /**
     * Converte il testo in HTML con ogni parola racchiusa in un elemento <span>
     * Calcola lo spazio necessario per evitare sovrapposizioni quando le parole cambiano
     */
    updateProcessedText() {
        // Dividi il testo in parole e spazi
        const words = this.originalText.split(/(\s+)/);
        let html = '';
        
        // Crea un elemento invisibile per misurare la larghezza delle parole
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.fontSize = '18px';
        tempElement.style.lineHeight = '1.8';
        tempElement.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        document.body.appendChild(tempElement);
        
        // Processa ogni parola
        words.forEach((word, index) => {
            if (word.trim()) { // Se non è uno spazio vuoto
                // Calcola la larghezza massima tra la parola originale e tutte le sue possibili sostituzioni
                let maxWidth = 0;
                const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                
                // Misura la larghezza della parola originale
                tempElement.textContent = word;
                maxWidth = Math.max(maxWidth, tempElement.offsetWidth);
                
                // Se questa parola può essere sostituita, misura anche le sostituzioni
                if (this.wordSubstitutions[cleanWord]) {
                    this.wordSubstitutions[cleanWord].forEach(substitution => {
                        // Mantieni la capitalizzazione della parola originale
                        let finalSubstitution = substitution;
                        if (word[0] === word[0].toUpperCase()) {
                            finalSubstitution = substitution.charAt(0).toUpperCase() + substitution.slice(1);
                        }
                        
                        // Misura questa sostituzione
                        tempElement.textContent = finalSubstitution;
                        maxWidth = Math.max(maxWidth, tempElement.offsetWidth);
                    });
                }
                
                // Crea l'elemento HTML per questa parola con la larghezza massima
                html += `<span class="word" data-original="${word}" data-index="${index}" style="min-width: ${maxWidth}px; width: ${maxWidth}px;">${word}</span>`;
            } else {
                // Mantieni gli spazi come sono
                html += word;
            }
        });
        
        // Rimuovi l'elemento temporaneo
        document.body.removeChild(tempElement);
        
        // Inserisci l'HTML generato nella pagina
        document.getElementById('processedText').innerHTML = html;
    }
    
    /**
     * Attiva/disattiva la Regola 1: sostituisce tutte le 'a' con 'e'
     */
    toggleRule1(enabled) {
        if (enabled) {
            // Inizializza l'array per i timeout delle lettere se non esiste
            if (!this.letterTimeouts) {
                this.letterTimeouts = [];
            }
            
            // Applica immediatamente la sostituzione
            this.applyRule1();
            
            // Avvia la programmazione continua con frequenza variabile
            this.scheduleNextRule1();
        } else {
            // Cancella il timeout principale
            if (this.intervals && this.intervals.rule1) {
                clearTimeout(this.intervals.rule1);
                this.intervals.rule1 = null;
            }
            
            // Cancella tutti i timeout delle lettere individuali
            if (this.letterTimeouts) {
                this.letterTimeouts.forEach(timeout => clearTimeout(timeout));
                this.letterTimeouts = [];
            }
            
            // Ripristina il testo originale
            this.resetRule1();
        }
    }

    /**
     * Programma il prossimo intervallo per la Regola 1 con frequenza variabile
     */
    scheduleNextRule1() {
        // Frequenza variabile tra 800ms e 3500ms
        const nextInterval = Math.random() * 2700 + 800;
        
        this.intervals.rule1 = setTimeout(() => {
            // Verifica se la regola è ancora attiva
            if (document.getElementById('rule1').checked) {
                this.applyRule1();
                this.scheduleNextRule1(); // Programma il prossimo intervallo
            }
        }, nextInterval);
    }

    /**
     * Ripristina una singola lettera al suo carattere originale
     */
    restoreOriginalLetter(wordElement, letterIndex, originalChar) {
        const currentHTML = wordElement.innerHTML;
        const letters = currentHTML.split('');
        
        if (letterIndex < letters.length) {
            letters[letterIndex] = originalChar;
            wordElement.innerHTML = letters.join('');
        }
    }
    

    
    /**
     * Ripristina tutte le parole al loro stato originale (usato quando si disattivano le regole)
     */
    resetRule1() {
        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const original = word.getAttribute('data-original');
            word.innerHTML = original;
        });
    }
    
    /**
     * Attiva/disattiva la Regola 2: sfocatura graduale per parole >4 caratteri
     */
    toggleRule2(enabled) {
        if (this.intervals.rule2) {
            clearInterval(this.intervals.rule2);
            this.intervals.rule2 = null;
        }
        
        if (enabled) {
            // Applica l'effetto ogni 3 secondi
            this.applyRule2();
            this.intervals.rule2 = setInterval(() => {
                this.applyRule2();
            }, 3000);
        } else {
            // Ferma l'effetto e ripristina il testo normale
            this.resetRule2();
        }
    }
    
    /**
     * Applica la Regola 2: sfocatura graduale per parole con più di 4 caratteri
     */
    applyRule2() {
        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const original = word.getAttribute('data-original');
            
            // Applica solo a parole con più di 4 caratteri
            if (original.length > 4) {
                // Applica al 30% delle parole lunghe
                if (Math.random() < 0.30) {
                    // Avvia l'animazione fluida di sfocatura
                    this.animateBlurEffect(word, original);
                }
            }
        });
    }

    animateBlurEffect(wordElement, originalWord) {
        const letters = originalWord.split('');
        const animationDuration = 4000; // 4 secondi totali per il ciclo completo
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % animationDuration) / animationDuration;
            
            // Calcola l'intensità della sfocatura usando una funzione sinusoidale
            // 0 = completamente visibile, 1 = massima sfocatura
            const blurProgress = Math.sin(progress * Math.PI); // Andamento sinuoso 0→1→0
            
            let html = '';
            letters.forEach((letter, index) => {
                // Prime e ultime lettere sempre nitide
                if (index === 0 || index === letters.length - 1) {
                    html += letter;
                } else {
                    // Calcola l'intensità della sfocatura per le lettere centrali
                    const center = Math.floor(letters.length / 2);
                    const distanceFromCenter = Math.abs(index - center);
                    const maxDistance = Math.max(center - 1, letters.length - center - 2);
                    
                    // Sfocatura graduale: massima al centro, diminuisce verso i bordi
                    const baseBlurIntensity = Math.max(0, 1 - (distanceFromCenter / maxDistance));
                    const currentBlurIntensity = baseBlurIntensity * blurProgress * 3;
                    const currentOpacity = 1 - (blurProgress * 0.4); // Opacità da 1 a 0.6
                    
                    if (currentBlurIntensity > 0.1) {
                        html += `<span style="filter: blur(${currentBlurIntensity}px); opacity: ${currentOpacity}; transition: all 0.1s ease-in-out;">${letter}</span>`;
                    } else {
                        html += letter;
                    }
                }
            });
            
            wordElement.innerHTML = html;
            
            // Continua l'animazione se la regola è ancora attiva
            if (elapsed < animationDuration && document.getElementById('rule2').checked) {
                requestAnimationFrame(animate);
            } else {
                // Ripristina il testo originale alla fine dell'animazione
                wordElement.innerHTML = originalWord;
            }
        };
        
        animate();
    }
    
    applyBlurEffect(wordElement, originalWord) {
        const letters = originalWord.split('');
        let html = '';
        
        letters.forEach((letter, index) => {
            const position = index / (letters.length - 1);
            let blurClass = '';
            
            // Calcola il livello di sfocatura basato sulla posizione
            if (index === 0 || index === letters.length - 1) {
                // Prime e ultime lettere sempre nitide
                blurClass = '';
            } else {
                // Sfocatura graduale verso il centro
                const distanceFromEdge = Math.min(index, letters.length - 1 - index);
                const centerDistance = Math.abs(position - 0.5);
                
                if (centerDistance < 0.1) {
                    blurClass = 'blur-max';
                } else if (centerDistance < 0.2) {
                    blurClass = 'blur-heavy';
                } else if (centerDistance < 0.3) {
                    blurClass = 'blur-medium';
                } else if (distanceFromEdge > 1) {
                    blurClass = 'blur-light';
                }
            }
            
            html += `<span class="letter ${blurClass}">${letter}</span>`;
        });
        
        wordElement.innerHTML = html;
        wordElement.classList.add('blur-word');
        
        // Rimuovi l'effetto gradualmente
        setTimeout(() => {
            this.removeBlurEffect(wordElement, originalWord);
        }, Math.random() * 3000 + 2000);
    }
    
    removeBlurEffect(wordElement, originalWord) {
        const letters = wordElement.querySelectorAll('.letter');
        let delay = 0;
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.className = 'letter';
            }, delay);
            delay += 100;
        });
        
        setTimeout(() => {
            if (!document.getElementById('rule2').checked) {
                wordElement.innerHTML = originalWord;
                wordElement.classList.remove('blur-word');
            }
        }, delay + 500);
    }
    
    resetRule2() {
        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const original = word.getAttribute('data-original');
            word.innerHTML = original;
            word.classList.remove('blur-word');
        });
    }
    
    /**
     * Attiva/disattiva la Regola 3: le parole vengono sostituite temporaneamente
     */
    toggleRule3(enabled) {
        if (this.intervals.rule3) {
            clearInterval(this.intervals.rule3);
            this.intervals.rule3 = null;
        }
        
        if (enabled) {
            // Applica l'effetto ogni 4 secondi (rallentato da 800ms)
            this.applyRule3();
            this.intervals.rule3 = setInterval(() => {
                this.applyRule3();
            }, 4000);
        } else {
            // Ferma l'effetto e ripristina il testo normale
            this.resetRule3();
        }
    }
    
    /**
     * Applica la Regola 3: sostituisce temporaneamente alcune parole con sinonimi
     */
    applyRule3() {
        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const original = word.getAttribute('data-original');
            // Rimuovi la punteggiatura per trovare la parola nel dizionario
            const cleanWord = original.toLowerCase().replace(/[.,!?;:]/g, '');
            
            // Se la parola ha sostituzioni disponibili e con 15% di probabilità (ridotta da 30%)
            if (this.wordSubstitutions[cleanWord] && Math.random() < 0.15) {
                const substitutions = this.wordSubstitutions[cleanWord];
                // Scegli una sostituzione casuale
                const randomSubstitution = substitutions[Math.floor(Math.random() * substitutions.length)];
                
                // Mantieni la capitalizzazione della parola originale
                let finalSubstitution = randomSubstitution;
                if (original[0] === original[0].toUpperCase()) {
                    finalSubstitution = randomSubstitution.charAt(0).toUpperCase() + randomSubstitution.slice(1);
                }
                
                // Applica la sostituzione
                word.innerHTML = finalSubstitution;
                word.style.textAlign = 'left';
                
                // Ripristina la parola originale dopo 4-8 secondi (aumentato da 2-6)
                setTimeout(() => {
                    word.innerHTML = original;
                }, Math.random() * 4000 + 4000);
            }
        });
    }
    
    resetRule3() {
        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const original = word.getAttribute('data-original');
            const originalWidth = word.style.width;
            const originalMinWidth = word.style.minWidth;
            
            word.innerHTML = original;
            
            // Ripristina le dimensioni e l'allineamento originali
            word.style.width = originalWidth;
            word.style.minWidth = originalMinWidth;
            word.style.textAlign = 'left';
            word.style.overflow = 'visible';
        });
    }
    
    
    /**
     * Applica la Regola 1: inverte temporaneamente le lettere 'a' ed 'e' in alcune parole
     */
    applyRule1() {
        const words = document.querySelectorAll('.word');
        words.forEach((word, wordIndex) => {
            const original = word.getAttribute('data-original');
            
            // Applica solo al 25% delle parole che contengono 'a' o 'e'
            if ((original.includes('a') || original.includes('e') || original.includes('A') || original.includes('E')) && Math.random() < 0.25) {
                // Inverte le lettere 'a' ed 'e' (e le loro versioni maiuscole)
                let modifiedText = original
                    .replace(/a/g, '§')  // Placeholder temporaneo per 'a'
                    .replace(/e/g, 'a')  // 'e' diventa 'a'
                    .replace(/§/g, 'e')  // 'a' diventa 'e'
                    .replace(/A/g, '§')  // Placeholder temporaneo per 'A'
                    .replace(/E/g, 'A')  // 'E' diventa 'A'
                    .replace(/§/g, 'E'); // 'A' diventa 'E'
                
                // Applica l'inversione
                word.innerHTML = modifiedText;
                
                // Programma il ripristino con durata variabile (500ms-3000ms)
                const restoreDuration = Math.random() * 2500 + 500;
                const timeout = setTimeout(() => {
                    this.restoreOriginalLetter(word, -1, original); // -1 indica ripristino completo
                    word.innerHTML = original;
                }, restoreDuration);
                
                // Memorizza il timeout per poterlo cancellare se necessario
                if (!this.letterTimeouts) {
                    this.letterTimeouts = [];
                }
                this.letterTimeouts.push(timeout);
            }
        });
    }

    
    resetText() {
        // Ferma tutti gli intervalli
        Object.keys(this.intervals).forEach(key => {
            if (this.intervals[key]) {
                clearInterval(this.intervals[key]);
                this.intervals[key] = null;
            }
        });
        
        // Ripristina il testo originale
        this.updateProcessedText();
        
        // Riavvia le regole attive
        setTimeout(() => {
            if (document.getElementById('rule1').checked) {
                this.toggleRule1(true);
            }
            if (document.getElementById('rule2').checked) {
                this.toggleRule2(true);
            }
            if (document.getElementById('rule3').checked) {
                this.toggleRule3(true);
            }
        }, 100);
    }
}

// Inizializza l'applicazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    new DyslexiaSimulator();
});
