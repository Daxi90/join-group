document.addEventListener('DOMContentLoaded', function() {
    let container = document.querySelector('.step-guide-container');
    
    if (container) {
        let containerContent = container.innerHTML;
        const regex = /(\bJoin\b)/g;
        containerContent = containerContent.replace(regex, '<span class="highlight-join">$1</span>');
        container.innerHTML = containerContent;
    }
});