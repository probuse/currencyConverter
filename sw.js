self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('currency-converter-cache').then(cache => {
            return cache.addAll([
                '/index.html',
                'css/style.css',
                'js/index.js',
                'images/moneyConverter.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin){
        if(requestUrl.pathname === '/'){
            event.respondWith(
                caches.match(event.request).then((response) => {
                    return response || fetch(event.request);
                })
            ); 
        }
    }
    
});