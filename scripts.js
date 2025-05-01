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

    /* Hero Character Selection */
    const allFilter = document.getElementById('all-filter'); 
    const strengthFilter = document.getElementById('strength-filter'); 
    const intelligenceFilter = document.getElementById('intelligence-filter'); 
    const agilityFilter = document.getElementById('agility-filter'); 
    const universalFilter = document.getElementById('universal-filter'); 
    const searchBar = document.getElementById('search-bar')
    const gallery = document.getElementById('hero-gallery');
    const home = document.getElementById('logo-container');
    const heroShow = document.getElementById('hero-selected');
    
    /* Hero Content Section*/
    const closeButton = document.getElementById('close-button');
    const heroName = document.getElementById('hero-name');
    const imgAttr = document.getElementById('primary-attr-image');
    const heroAttr = document.getElementById('hero-primary-attr');
    const imgAtkType = document.getElementById('attack-type-image');
    const heroAtkType = document.getElementById('hero-attack-type');
    const heroRoles = document.getElementById('hero-roles');
    const heroImg = document.getElementById('hero-image');
    console.log(heroImg);
      
    function playHoverSound() {
        var audioArr = document.getElementsByTagName('audio');
        audioArr[0].cloneNode().play()
        
    }

    activeToggle = false;
    currentHero = null;
    function toggleContent() {
        if (activeToggle) {
            currentHero = null;
            heroShow.style.display = 'none';
            gallery.style.paddingRight = '3em';
        } else {
            heroShow.style.display = 'block';
            gallery.style.paddingRight = '25em';
        }               
        activeToggle = !activeToggle;
    }

    function display_elements(heroList = allHeroes) {
        gallery.innerText = "";   
        for (let hero of heroList) {
            const newTab = document.createElement('figure');
            newTab.setAttribute('style', `background-image: url("https://cdn.akamai.steamstatic.com${hero.img}"); background-size: cover;`);
            newTab.innerHTML = `\
                <h4>${hero.localized_name}</h4>\
                <img src='https://cdn.akamai.steamstatic.com${hero.icon}'> 
            `; 

            newTab.addEventListener('click', e => {
                if (currentHero == null || currentHero === hero.id) {
                    currentHero = hero.id;
                    toggleContent();
                }
                currentHero = hero.id;
                displayContent(hero.id);
                
            });
            newTab.addEventListener('mouseenter', () => {
                playHoverSound() 
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
            newTab.innerHTML = `\
                <h4>${hero.localized_name}</h4>\
                <img src='https://cdn.akamai.steamstatic.com${hero.icon}'> 
            `; 

            newTab.addEventListener('click', e => {
                if (currentHero == null || currentHero === hero.id) {
                    currentHero = hero.id;
                    toggleContent();
                }
                currentHero = hero.id;
                displayContent(hero.id);
                
            });
            newTab.addEventListener('mouseenter', () => {
                playHoverSound() 
            });
            gallery.append(newTab);
        }
    });
    
    let currentActive = allFilter;
    function setActiveFilter(filter) {
        currentActive.classList.remove("selected");
        currentActive = filter;
        currentActive.classList.add("selected");
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
    
    closeButton.addEventListener('click', e => {
        toggleContent();  
    })

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
                imgAttr.setAttribute('src', 'images/strength.webp');
                heroAttr.innerText = "Strength";
                heroAttr.style.color ='rgb(211, 53, 1)';

                break;
            case "int": 
                imgAttr.setAttribute('src', 'images/intelligence.webp');
                heroAttr.innerText = "Intelligence";
                heroAttr.style.color ='rgb(1, 154, 165)';

                break;
            case "agi":
                imgAttr.setAttribute('src', 'images/agility.webp');
                heroAttr.innerText = "Agility";
                heroAttr.style.color ='rgb(46, 207, 51)';

                break;
            case "all":
                imgAttr.setAttribute('src', 'images/universal.webp');
                heroAttr.innerText = "Universal";
                heroAttr.style.color ='rgb(254, 255, 207)';

                break;    
            default:
                break;
        }
        
        switch (displayedHero.attack_type) {
            case "Melee":
                console.log(displayedHero.attack_type);
                imgAtkType.setAttribute('src', 'images/melee.png');
                break;
            case "Ranged":
                console.log(displayedHero.attack_type);
                imgAtkType.setAttribute('src', 'images/ranged.png');
                break; 
            default:
                break;
        }
        heroAtkType.innerText = displayedHero.attack_type;
        heroImg.setAttribute('style', `background-image: url("https://cdn.akamai.steamstatic.com${displayedHero.img}"); background-size: cover;`);

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