async function fetchHeroStats() {
    try {
        const response = await fetch("https://api.opendota.com/api/heroStats");
        if (!response.ok) {
            throw new Error("Resource cannot be fetched.");
        } 
        const jsonData = await response.json();
        return jsonData;
    } 
    catch(error) {
        console.error(error);
    } 
}

async function main() {
    /* | FIELDS */
    /* Hero Lists*/
    const allHeroes = await fetchHeroStats();
    const strengthHeroes = allHeroes.filter(hero => hero.primary_attr == 'str');
    const agilityHeroes = allHeroes.filter(hero => hero.primary_attr == 'agi');
    const intelligenceHeroes = allHeroes.filter(hero => hero.primary_attr == 'int');
    const universalHeroes = allHeroes.filter(hero => hero.primary_attr == 'all');

    /* Sections */
    const heroSelectSection = document.getElementById('choose-hero-section');
    const heroContentSection = document.getElementById('content-section');

    /* Hero Character Selection */
    const allFilter = document.getElementById('all-filter'); 
    const strengthFilter = document.getElementById('strength-filter'); 
    const intelligenceFilter = document.getElementById('intelligence-filter'); 
    const agilityFilter = document.getElementById('agility-filter'); 
    const universalFilter = document.getElementById('universal-filter'); 
    const searchBar = document.getElementById('search-bar')
    const gallery = document.getElementById('hero-gallery');
    const home = document.getElementById('logo-container');

    /* Hero Content Section*/
    const heroName = document.getElementById('hero-name');
    const heroAttr = document.getElementById('hero-primary-attr');
    const heroAtkType = document.getElementById('hero-attack-type');
    const heroRoles = document.getElementById('hero-roles');
    const heroImg = document.getElementById('hero-image');
    console.log(heroImg);
    
    /* | FUNCTIONS */
    function setActiveSection(section) {
        if (section === heroContentSection) {
            heroSelectSection.style.display = 
                searchBar.style.display = 'none';            
        } else {
            heroContentSection.style.display = 'none'; 
        }
        section.style.display = 'block'; 
    }    
    function display_elements(heroList = allHeroes) {
        gallery.innerText = "";   

        for (let hero of heroList) {
            const newTab = document.createElement('figure');
            newTab.setAttribute('style', `background-image: url("https://cdn.akamai.steamstatic.com${hero.img}"); background-size: cover;`);
            newTab.innerText = hero.localized_name;
            newTab.addEventListener('click', e => {
                setActiveSection(heroContentSection);
                displayContent(hero.id);
            });
            gallery.append(newTab);
        }
    }
    
    home.addEventListener('click', e => {
        setActiveSection(heroSelectSection);   
    });

    searchBar.addEventListener("input", e => {
        const query = searchBar.value.toLowerCase();    
        let results = []; 
        switch(currentActive) {
            case allFilter:
                results = allHeroes.filter(candidate => candidate.localized_name.toLowerCase().includes(query));
                break;
            case strengthFilter:
                results = strengthHeroes.filter(candidate => candidate.localized_name.toLowerCase().includes(query));
                break;
            case intelligenceFilter:
                results = intelligenceHeroes.filter(candidate => candidate.localized_name.toLowerCase().includes(query));
                break;
            case agilityFilter:
                results = agilityHeroes.filter(candidate => candidate.localized_name.toLowerCase().includes(query));
                break;
            case universalFilter:
                results = universalHeroes.filter(candidate => candidate.localized_name.toLowerCase().includes(query));                
                break;
        }
        gallery.innerText = "";
        for (let hero of results) {
            const newTab = document.createElement('figure');
            newTab.setAttribute('style', `background-image: url("https://cdn.akamai.steamstatic.com${hero.img}"); background-size: cover;`);
            newTab.innerText = hero.localized_name;
            gallery.append(newTab);
        }
    });
    
    let currentActive = allFilter;
    function setActiveFilter(filter) {
        currentActive.classList.remove("selected");
        currentActive = filter;
        currentActive.classList.add("selected");
        gallery.style.animation = none;
        gallery.style.animation = "smooth-fade 1.7s ease 1;";
        searchBar.value = '';
    }
    allFilter.addEventListener("click", e => {
        display_elements();
        setActiveFilter(allFilter);    
    }); 
    strengthFilter.addEventListener("click", e => {
        display_elements(strengthHeroes);
        setActiveFilter(strengthFilter);    
    }); 
    intelligenceFilter.addEventListener("click", e => {
        display_elements(intelligenceHeroes);
        setActiveFilter(intelligenceFilter);    
    }); 
    agilityFilter.addEventListener("click", e => {
        display_elements(agilityHeroes); 
        setActiveFilter(agilityFilter);    
    }); 
    universalFilter.addEventListener("click", e => {
        display_elements(universalHeroes);
        setActiveFilter(universalFilter);    
    });
    
    function displayContent(id) {
        let displayedHero = null;
        for (hero of allHeroes) {
            if (hero.id === id) {
                displayedHero = hero;
                break;
            }
        }
        heroName.innerText = displayedHero.localized_name.toUpperCase();
        switch (displayedHero.primary_attr) {
            case "str":
                heroAttr.innerText = "Strength";
                break;
            case "int":
                heroAttr.innerText = "Intelligence";
                break;
            case "agi":
                heroAttr.innerText = "Agility";
                break;
            case "all":
                heroAttr.innerText = "Universal";
                break;    
            default:
                break;
        }
        heroAtkType.innerText = displayedHero.attack_type;
        
        // Change this line
        // From: heroImg.setAttribute('style', `background-image: url("https://cdn.akamai.steamstatic.com${displayedHero.img}"); background-size: cover;`);
        // To:
        heroImg.src = `https://cdn.akamai.steamstatic.com${displayedHero.img}`;
        heroImg.alt = displayedHero.localized_name;
        
        heroRoles.innerText = "";
        let text = ""; 
        for (role of displayedHero.roles) {
            const roleDisplay = document.createElement("h4");
            roleDisplay.innerText = role;
            heroRoles.append(roleDisplay); 
        }
    }

    /* | START */
    display_elements();
}

main();