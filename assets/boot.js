/* Runs in <head>: enables scroll animations only when the browser supports them. */
if ('IntersectionObserver' in window) document.documentElement.classList.add('js');
