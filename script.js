document.addEventListener('DOMContentLoaded', () => {
            
    // 1. 스크롤 애니메이션
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    scrollElements.forEach(el => observer.observe(el));

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 50;
        header.classList.toggle('shadow-lg', isScrolled);
        header.style.backgroundColor = isScrolled ? 'rgba(255, 251, 247, 0.95)' : 'rgba(255, 251, 247, 0.8)';
    });

    // 2. 히어로 텍스트 타이핑 (빠른 속도: 50ms)
    const heroTextElement = document.getElementById('hero-text');
    const heroSection = document.getElementById('hero-section');
    const textToType = "귀여운 발자국을 남기는\n사랑스러운 우리의 친구";

    function typeWriter() {
        let i = 0;
        heroTextElement.innerHTML = ""; 
        heroTextElement.classList.remove('typing-done');

        function typeLoop() {
            if (i < textToType.length) {
                const char = textToType.charAt(i);
                if (char === '\n') {
                    heroTextElement.innerHTML += '<br>';
                } else {
                    heroTextElement.innerHTML += char;
                }
                i++;
                setTimeout(typeLoop, 50); 
            } else {
                heroTextElement.classList.add('typing-done'); 
            }
        }
        typeLoop();
    }

    const typeWriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && heroTextElement) {
                typeWriter();
            }
        });
    }, { threshold: 0.5 }); 
    if (heroSection && heroTextElement) {
        typeWriterObserver.observe(heroSection);
    }

    // 3. 히어로 스크롤 효과
    const heroContent = document.getElementById('hero-content');
    if (heroSection && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            let progress = scrollY / 500;
            progress = Math.min(1, Math.max(0, progress));
            const scale = 1 - progress * 0.15;
            const borderRadius = progress * 24;
            heroContent.style.transform = `scale(${scale})`;
            heroContent.style.borderRadius = `${borderRadius}px`;
        });
    }
    
    // 4. 채팅 메시지
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        const messages = chatContainer.querySelectorAll('.chat-bubble');
        let chatIndex = 0;
        let chatTimer = null; 
        const showMessagesSequentially = () => {
            if (chatIndex < messages.length) {
                messages[chatIndex].classList.add('visible'); 
                chatIndex++;
                chatTimer = setTimeout(showMessagesSequentially, 400); 
            }
        };
        const chatObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                if (chatIndex === 0) showMessagesSequentially();
            } else {
                clearTimeout(chatTimer);
                messages.forEach(msg => msg.classList.remove('visible'));
                chatIndex = 0;
            }
        }, { threshold: 0.3 }); 
        chatObserver.observe(chatContainer);
    }

    // 5. 브랜드 소개글
    const introTextWrapper = document.getElementById('brand-intro-text-wrapper');
    const introLines = document.querySelectorAll('#brand-intro-text .intro-line');
    if (introTextWrapper && introLines.length > 0) {
        let lineIndex = 0;
        let introTimer = null; 
        const showLinesSequentially = () => {
            if (lineIndex < introLines.length) {
                introLines[lineIndex].classList.add('visible');
                lineIndex++;
                introTimer = setTimeout(showLinesSequentially, 200); 
            }
        };
        const introObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (lineIndex === 0) showLinesSequentially();
            } else {
                clearTimeout(introTimer);
                introLines.forEach(line => line.classList.remove('visible'));
                lineIndex = 0;
            }
        }, { threshold: 0.1 });
        introObserver.observe(introTextWrapper);
    }

    // 7. 인터랙티브 티셔츠
    const mainTshirtImage = document.getElementById('main-tshirt-image');
    const expressionGrid = document.getElementById('expression-grid');
    const imageData = {
        rudy: {
            default: 'images/티셔츠 목업_메인.png', 
            expressions: [
                'images/루디_티셔츠1_목업.png',
                'images/루나_티셔츠1_목업.png'
            ],
            thumbs: [
                'images/루디_티셔츠1.png',
                'images/루나_티셔츠1.png'
            ]
        }
    };
    function loadExpressions() {
        if (!expressionGrid || !mainTshirtImage) return;
        expressionGrid.innerHTML = '';
        const charData = imageData.rudy; 
        charData.thumbs.forEach((thumbSrc, index) => {
            const img = document.createElement('img');
            img.src = thumbSrc;
            img.alt = `rudy expression ${index + 1}`;
            img.className = 'expression-thumb cursor-pointer rounded-2xl w-full bg-white p-2 shadow-md border-2 border-transparent hover:border-brand-emphasis transition-all';
            img.dataset.tshirtSrc = charData.expressions[index];
            img.addEventListener('mouseover', () => { mainTshirtImage.src = img.dataset.tshirtSrc; });
            expressionGrid.appendChild(img);
        });
    }
    loadExpressions(); 

    // 8. 투표 기능
    const pollSection = document.getElementById('poll-section');
    if (pollSection) {
        const pollOptions = pollSection.querySelectorAll('.poll-option');
        let votes = JSON.parse(localStorage.getItem('pawpu_votes')) || { char1: 0, char2: 0 };
        function updatePollResults(show) {
            const totalVotes = Object.values(votes).reduce((s, c) => s + c, 0);
            pollOptions.forEach(option => {
                const charId = option.dataset.character;
                const resultEl = option.querySelector('.poll-result');
                const charVotes = votes[charId] || 0;
                const percentage = totalVotes === 0 ? 0 : ((charVotes / totalVotes) * 100).toFixed(1);
                resultEl.querySelector('span:first-child').textContent = `${percentage}%`;
                resultEl.querySelector('span:last-child').textContent = `${charVotes} votes`;
                if(show) {
                    resultEl.classList.remove('hidden');
                    resultEl.classList.add('flex'); 
                }
            });
        }
        pollOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (pollSection.classList.contains('voted')) return;
                pollSection.classList.add('voted');
                option.classList.add('selected');
                const charId = option.dataset.character;
                if(votes.hasOwnProperty(charId)) votes[charId]++;
                else votes[charId] = 1;
                localStorage.setItem('pawpu_votes', JSON.stringify(votes));
                pollOptions.forEach(opt => opt.classList.add('voted'));
                updatePollResults(true);
            });
        });
    }

    // 9. 내비게이션
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 10. 상단 이동 버튼
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const handleScroll = () => {
        if (!scrollToTopBtn) return;
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto'; 
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none'; 
        }
    };
    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    if (scrollToTopBtn) {
        window.addEventListener('scroll', handleScroll);
        scrollToTopBtn.addEventListener('click', scrollToTop);
        handleScroll();
    }
});