fetch("/config-name")
.then(response => response.json())
.then(data => {
    document.getElementById("page-title").innerText = data.name;
    document.getElementById("config-name").innerText = data.name;
    document.getElementById("welcome-title").innerText = "Welcome to " + data.name;
    if (data.photo) {
        document.getElementById("profile-photo").src = data.photo;
    }
})
.catch(error => console.error('Error fetching config name and photo:', error));

fetch("/api-list")
.then(response => response.json())
.then(apis => {
    const sidebar = document.getElementById('accordionSidebar');
    const categories = apis.reduce((acc, api) => {
        if (!acc[api.category]) {
            acc[api.category] = [];
        }
        acc[api.category].push(api);
        return acc;
    }, {});

    const categoryIcons = {
        "Tools": "fas fa-wrench",
        "Ai": "fas fa-brain",
        "Search": "fas fa-search",
        "Canvas": "fas fa-paint-brush",
        "Image Generation": "fas fa-image",
        "Anime": "fas fa-dragon",
        "Others": "fas fa-ellipsis-h"
    };

    Object.keys(categories).forEach((category, index) => {
        const categoryId = `collapse${index}`;
        const categoryItem = document.createElement('li');
        categoryItem.className = 'nav-item';

        // Use the specific icon for each category if available
        const iconClass = categoryIcons[category] || "";

        categoryItem.innerHTML = `
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#${categoryId}" aria-expanded="true" aria-controls="${categoryId}">
                ${iconClass ? `<i class="${iconClass}"></i>` : ""}
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </a>
            <div id="${categoryId}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordionSidebar">
                <div class="py-2 collapse-inner rounded">
                    ${categories[category].map(api => `
                        <a class="collapse-item" target="_blank" href="/api/${api.name}?${api.link[0].split('?')[1] || ''}">
                            ${api.name.charAt(0).toUpperCase() + api.name.slice(1)}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        
        sidebar.appendChild(categoryItem);
    });

    document.getElementById('totalApis').textContent = apis.length;
    document.getElementById('apiCategories').textContent = Object.keys(categories).length;
})
.catch(error => console.error('Error fetching API list:', error));
