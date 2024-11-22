addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request): Promise<Response> {
	const CF_IP_PREFIX = "2606:4700::";
	const url = new URL(request.url);
	const ipv4Path = url.pathname.slice(1); // 先頭の '/' を除去
	const ipv4Octets = ipv4Path.split('.').map(Number);

	// IPv4アドレスの検証
	if (
		!ipv4Octets ||
			ipv4Octets.length !== 4 ||
			ipv4Octets.some(n => Number.isNaN(n) || n < 0 || n > 255)
	) {
		return new Response('Usage: https://example.com/1.1.1.1', { status: 400 });
	}

	let ipv6 = CF_IP_PREFIX;
	for (let i = 0; i < 4; i++) {
		if (i === 2) {
			ipv6 += ":";
		}
		ipv6 += ipv4Octets[i].toString(16).padStart(2, "0");
	}

	return new Response(ipv6, { status: 200 });
}

