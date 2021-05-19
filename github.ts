const [, code] = window.location.search.split("=")

console.log({ code })

if (code) {
	fetch("http://localhost:3000/api/commits", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			code,
		}),
	})
		.then((r) => r.json())
		.then(console.log)
}
