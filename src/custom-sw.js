// My fuction to share files
const handleFileshare = (e) => {
    e.respondWith(Response.redirect('/'));

    // // Eg, if it's cross-origin.
    // if (!e.clientId) return;

    e.waitUntil(
        (async function () {
            const data = await e.request.formData();
            const client = await self.clients.get(e.resultingClientId);

            // e.clients.matchAll().then(function (clients) {
            //     clients.forEach(function (client) {
            //         const file = data.get('file')

            //         client.postMessage({ file })
            //     });
            // })

            const file = data.get('file');
            client.postMessage({ file });
        })(),
    );
};

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    if (
        url.origin === location.origin &&
        url.pathname === '/share-target' &&
        e.request.method === 'POST'
    ) {
        handleFileshare(e);
    }
});