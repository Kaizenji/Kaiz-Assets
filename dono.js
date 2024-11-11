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

    // Group APIs by category
    const categories = apis.reduce((acc, api) => {
        if (!acc[api.category]) {
            acc[api.category] = [];
        }
        acc[api.category].push(api);
        return acc;
    }, {});

    // Determine icon based on keywords in category name
    function getIconForCategory(category) {
        if (category.includes("Tools")) return "fas fa-wrench";
        if (category.includes("Ai")) return "fas fa-brain";
        if (category.includes("Search")) return "fas fa-search";
        if (category.includes("Canvas")) return "fas fa-paint-brush";
        if (category.includes("Image")) return "fas fa-image";
        if (category.includes("Anime")) return "fas fa-dragon";
        return "fas fa-ellipsis-h"; // Default icon for other categories
    }

    // Create sidebar items for each category
    Object.keys(categories).forEach((category, index) => {
        const categoryId = `collapse${index}`;
        const categoryItem = document.createElement('li');
        categoryItem.className = 'nav-item';

        // Assign icon based on category name
        const iconClass = getIconForCategory(category);

        categoryItem.innerHTML = `
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#${categoryId}" aria-expanded="true" aria-controls="${categoryId}">
                <i class="${iconClass}"></i>
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
