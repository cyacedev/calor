const main = document.querySelector('main');
const components = [
    { name: "circle", create: createCircle, html: "", path: "./../lib/components/circle.html" },
    { name: "history", create: createHistory, html: "", path: "./../lib/components/history.html" },
    { name: "container", create: createContainer, html: "", path: "./../lib/components/container.html" },
];
const globals = {
    "temperature_unit": "C",
    "time_format": "24h",
    "thresholds": [
        {
            "min": "0",
            "max": "30",
            "color": "blue"
        },
        {
            "min": "30",
            "max": "60",
            "color": "orange"
        },
        {
            "min": "60",
            "max": "100",
            "color": "red"
        }
    ]
}
const dashboard = []
onPageLoad();

function loadComponentsFromRemoteHTML() {
    components.forEach(component => {
        fetch(component.path)
            .then(response => response.text())
            .then(data => {
                component.html = data;
            });
    });
}

function loadGlobals(newGlobals) {
    Object.keys(globals).forEach(key => {
        if (newGlobals[key] !== undefined) {
            globals[key] = newGlobals[key];
        }
    });
}

function loadDashboard(newDashboard) {
    newDashboard.forEach(element => {
        let component = components.find(c => c.name === element.type);
        if (component) {
            let newComponent = component.create(element);
            main.appendChild(newComponent);
            dashboard.push(newComponent);
        }
    });
}

function loadConfig() {
    fetch("./../lib/config.json")
        .then(response => response.json())
        .then(data => {
            console.log(data); //DEBUG
            if ('globals' in data) {
                loadGlobals(data.globals);
            }
            if ('dashboard' in data) {
                loadDashboard(data.dashboard);
            }
        });
}

function onPageLoad() {
    loadComponentsFromRemoteHTML();
    loadConfig()
}

function createCircle() {
    let element = document.createElement("div");
    element.outerHTML = components.find(c => c.name === "circle").html;
}

function createHistory() {
    let element = document.createElement("div");
    element.outerHTML = components.find(c => c.name === "history").html;
}

function createContainer() {
    let element = document.createElement("div");
    element.outerHTML = components.find(c => c.name === "container").html;
}