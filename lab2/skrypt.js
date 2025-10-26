class Todo {
    constructor() {
        this.tasks = [];
        this.listContainer = document.getElementById("dol");
        this.inputText = document.getElementById("wpisanie");
        this.inputDate = document.getElementById("data");
        this.searchInput = document.getElementById("szukanie");
        this.btnAdd = document.getElementById("dodaj");

        this.load();
        this.draw();

        this.btnAdd.addEventListener("click", () => this.add());
        this.inputText.addEventListener("keydown", e => {
            if (e.key === "Enter") this.add();
        });
        this.searchInput.addEventListener("input", () => this.search());
    }

    save() {
        localStorage.setItem("zadania", this.tasks.map(t => `${t.text}|${t.data}`).join(";"));
    }

    load() {
        const saved = localStorage.getItem("zadania");
        if (saved) {
            this.tasks = saved.split(";").map(s => {
                const [text, data] = s.split("|");
                return { text, data };
            });
        }
    }

    add() {
        const text = this.inputText.value.trim();
        const data = this.inputDate.value;
        if (!text || !data) {
            alert("Wpisz zadanie i wybierz datę!");
            return;
        }
        this.tasks.push({ text, data });
        this.save();
        this.draw();
        this.inputText.value = "";
        this.inputDate.value = "";
    }

    remove(index) {
        this.tasks.splice(index, 1);
        this.save();
        this.draw();
    }

    edit(index, field, element) {
        const input = document.createElement("input");
        input.type = field === "data" ? "date" : "text";
        input.value = this.tasks[index][field];
        element.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            this.tasks[index][field] = input.value.trim() || this.tasks[index][field];
            this.save();
            this.draw();
        };
        input.addEventListener("blur", saveEdit);
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") input.blur();
        });
    }

    draw(fraza = "") {
        this.listContainer.innerHTML = "";

        this.tasks.forEach((t, i) => {
            const lower = t.text.toLowerCase();
            const idx = lower.indexOf(fraza.toLowerCase());
            if (fraza.length < 2 || idx !== -1) {
                const div = document.createElement("div");
                div.classList.add("zadanie");

                const spanText = document.createElement("span");
                spanText.classList.add("zadanie-text");
                if (fraza && idx !== -1 && fraza.length >= 2) {
                    const przed = t.text.slice(0, idx);
                    const traf = t.text.slice(idx, idx + fraza.length);
                    const po = t.text.slice(idx + fraza.length);
                    spanText.innerHTML = `${przed}<mark>${traf}</mark>${po}`;
                } else {
                    spanText.textContent = t.text;
                }

                const spanData = document.createElement("span");
                spanData.classList.add("zadanie-data");
                spanData.textContent = t.data;

                const btn = document.createElement("button");
                btn.textContent = "Usuń";
                btn.onclick = () => this.remove(i);

                spanText.addEventListener("click", () => this.edit(i, "text", spanText));
                spanData.addEventListener("click", () => this.edit(i, "data", spanData));

                div.append(spanText, spanData, btn);
                this.listContainer.appendChild(div);
            }
        });
    }

    search() {
        const fraza = this.searchInput.value.trim().toLowerCase();
        this.draw(fraza);
    }
}

const todo = new Todo();
