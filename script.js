if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

let map = L.map('map').setView([53.430127, 14.564802], 17);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("getLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolokalizacja niedostępna");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        document.getElementById("latitude").innerText = lat.toFixed(6);
        document.getElementById("longitude").innerText = lon.toFixed(6);
        map.setView([lat, lon], 17);
    });
});

document.getElementById("saveButton").addEventListener("click", () => {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error(err);
            return;
        }
        const ctx = document.getElementById("rasterMap").getContext("2d");
        ctx.drawImage(canvas, 0, 0, 600, 400);
        console.log("Mapa zapisana!");

        createPuzzle(canvas);
    });
});

document.getElementById("download").addEventListener("click", () => {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error("Błąd przy generowaniu obrazu:", err);
            return;
        }

        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = "mapa.png";
        link.click();

        const ctx = document.getElementById("rasterMap").getContext("2d");
        ctx.drawImage(canvas, 0, 0, 600, 400);

        console.log("Mapa pobrana i zapisana jako obraz PNG!");
    });
});


function createPuzzle(canvas) {
    const board = document.getElementById("puzzle-board");
    const container = document.getElementById("pieces-container");
    board.innerHTML = "";
    container.innerHTML = "";

    const rows = 4, cols = 4;
    const pieceWidth = 600 / cols;
    const pieceHeight = 400 / rows;
    let pieces = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const piece = document.createElement("div");
            piece.classList.add("piece");
            piece.draggable = true;
            piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
            piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
            piece.dataset.correctX = x;
            piece.dataset.correctY = y;
            pieces.push(piece);
        }
    }

    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    pieces.forEach(p => container.appendChild(p));

    enableDragAndDrop(pieces, board, pieceWidth, pieceHeight);
}



function enableDragAndDrop(pieces, board, w, h) {
    let dragged = null;

    pieces.forEach(p => {
        p.addEventListener("dragstart", () => dragged = p);
        p.addEventListener("dragend", () => dragged = null);
    });

    board.querySelectorAll("div").forEach(c => c.remove());
    for (let i = 0; i < 16; i++) {
        const slot = document.createElement("div");
        slot.style.width = w + "px";
        slot.style.height = h + "px";
        slot.style.border = "1px dashed transparent";
        slot.addEventListener("dragover", e => e.preventDefault());
        slot.addEventListener("drop", e => {
            e.preventDefault();
            if (dragged) {
                slot.innerHTML = "";
                slot.appendChild(dragged);
                checkIfSolved(board);
            }
        });
        board.appendChild(slot);
    }
}


function checkIfSolved(board) {
    const slots = board.children;
    let correct = 0;
    for (let i = 0; i < slots.length; i++) {
        const piece = slots[i].querySelector(".piece");
        if (!piece) continue;
        const expectedX = i % 4;
        const expectedY = Math.floor(i / 4);
        if (parseInt(piece.dataset.correctX) === expectedX && parseInt(piece.dataset.correctY) === expectedY) {
            correct++;
        }
    }
    if (correct === 16) {
        console.log("Gratulacje, ulozono puzzle")
        alert("Gratulacje, ulozono cale puzzle");
    }
}

