const ws = new WebSocket("ws://localhost:8080/ws");

const movingContainer = document.querySelector("#moving-container");

ws.onopen = () => {
    console.log("Connection opened");
}

ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data["type"] === "init")
    {
        sessionStorage.setItem("id", data["id"]);
        sessionStorage.setItem("color", data["color"]);

        let div = document.createElement("div");
        div.id = "square" + data.id;
        div.style.position = "absolute";
        div.style.width = "50px";
        div.style.height = "50px";
        div.style.backgroundColor = data.color;
        movingContainer.appendChild(div);
        return;
    }

    let square = document.querySelector("#square" + data.id);
    if (!square && data.type !== "delete") {
        square = document.createElement("div");
        square.id = "square" + data.id;
        square.style.width = "50px";
        square.style.height = "50px";
        movingContainer.appendChild(square);
    }

    if (data.type === "delete") {
        if (square) movingContainer.removeChild(square);
        return;
    }

    square.style.position = "absolute";
    square.style.left = data.left + "px";
    square.style.top = data.top + "px";
    square.style.backgroundColor = data.color;
}

document.addEventListener("keydown", (e) => {
    let id = sessionStorage.getItem("id");
    let square = document.querySelector("#square" + id);

    let leftPosition = square.style.left;
    let topPosition = square.style.top;
    let left = parseInt(leftPosition.slice(0, leftPosition.length-2));
    let top = parseInt(topPosition.slice(0, topPosition.length-2));

    let positions = {
        "left": left,
        "top": top,
        "id": parseInt(id),
        "color": square.style.backgroundColor
    };

    switch (e.key) {
        case "ArrowRight":
            left = parseInt(square.style.left) || 0;
            if (left + 20 >= 350)
                break;

            square.style.left = (left + 20) + "px";
            positions["left"] = left + 20;
            break;
        case "ArrowLeft":
            left = parseInt(square.style.left) || 0;
            if (left - 20 <= 0)
                break;

            square.style.left = (left - 20) + "px";
            positions["left"] = left - 20;
            break;
        case "ArrowUp":
            top = parseInt(square.style.top) || 0;
            if (top - 20 <= 0)
                break;

            square.style.top = (top - 20) + "px";
            positions["top"] = top - 20;
            break;
        case "ArrowDown":
            top = parseInt(square.style.top) || 0;
            if (top + 20 >= 350)
                break;

            square.style.top = (top + 20) + "px";
            positions["top"] = top + 20;
            break;
    }

    ws.send(JSON.stringify(positions));
})

