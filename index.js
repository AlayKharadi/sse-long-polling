const app = require("express")();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.send("Hello");
});

app.get("/stream", (req, res) => {
	res.setHeader("Content-Type",  "text/event-stream");
	sent(res, 0);
});

function sent(res, i) {
	res.write("data: " + `${i}\n\n`);
	setTimeout(() => sent(res, i + 1), 1000);
}

let connections = [];

app.get("/long-polling", (req, res) => {
	res.setHeader("Content-type", "text/html; charset=utf-8");
	res.setHeader("Transfer-Encoding", "chunked");

	connections.push(res);
})

let tick = 0;

function run() {
	if (++tick > (PORT/100)){
		connections.map(res => {
			res.write("END\n");
			res.end();
		})
		connections = [];
		tick = 0;
	}
	connections.map((res, index) => {
		 res.write(`Hello ${index}! Tick: ${tick} \n`);
	})

}

setInterval(run, (PORT/40));

app.listen(PORT, () => console.log(`[listen] server is running on port ${PORT}`));
