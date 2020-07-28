/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

/* Selector Strings */
const pageButtonStr = '.pageBtn';
const menuContentStr = '#menu-content';
const menuTitleStr = '#menu-title';
const pageStr = '#page-content section';
const pageContentStr = '#page-content';
const menuHeaderStr = '#menu-header';
const favoritesContainerStr = '#section-favorites div';
const menuCheckboxStr = '[type="checkbox"]';
const overlayStr = '#overlay';

const getPageNodeStr = (id) => `#section-${id}`;
const getPageButtonStr = (id) => `#btn-${id}`;
const getFavoriteNodeStr = (index) => `#section-favorites [data-number="${index}"]`;
const getMenuFavBoxStr = (index) => `[data-number="${index}"]`;

/* Selectors */
const menuContent = document.querySelector(menuContentStr);
const menuHeader = document.querySelector(menuHeaderStr);
const pageContent = document.querySelector(pageContentStr);
const pageButtons = document.querySelectorAll(pageButtonStr);
const pages = document.querySelectorAll(pageStr);
const menuTitle = document.querySelector(menuTitleStr);
const favorites = document.querySelector(favoritesContainerStr);
const menuCheckboxes = document.querySelectorAll(menuCheckboxStr);
const firstPageButton = menuContent.querySelector(pageButtonStr);
const overlay = document.querySelector(overlayStr);

const getPageNode = (id) => document.querySelector(getPageNodeStr(id));
const getPageButton = (id) => document.querySelector(getPageButtonStr(id));
const getMenuItemForFavorite = (checkboxNode) => checkboxNode.parentNode.parentNode.parentNode;
const getFavoriteNode = (index) => document.querySelector(getFavoriteNodeStr(index))
      .parentNode
      .parentNode
      .parentNode;
const getMenuFavBox = (index) => document.querySelector(getMenuFavBoxStr(index));

/* State */
const drawerOpen = () => menuContent.style.height != "0px" && menuContent.style.height != "";
let page = null;

/* Utilities */
const extractCoreId = (el) => el.id.split('-').pop();

/* Actions */
const openDrawer = () => {
  const newHeight = `${menuContent.scrollHeight}px`;
  menuContent.style.height = newHeight;
  if (!history.state.drawer) {
    history.pushState({drawer: true}, null)
  }
};

const closeDrawer = () => {
  menuContent.style.height = "0px";
};

const toggleDrawer = () => {
  if (drawerOpen()) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

const switchPage = (id, user) => {
  page = id;
  closeDrawer();
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.style.display = 'none';
    pages.forEach(el => el.style.display = 'none');
    const title = getPageButton(id).text;
    getPageNode(id).style.display = 'block';
    window.scrollTo(0, 0);
    menuTitle.innerHTML = title;
    if (user) {
      if (history.state.drawer) {
        history.replaceState({id: id}, null)
      } else {
        history.pushState({id: id}, null)
      }
    }
  }, 300);
};

const switchFontSize = (sz) => {
  document.body.style.fontSize = sz === null ? null : `${sz}px`;
  if (drawerOpen()) {
    menuContent.style.transition = 'none';
    menuContent.style.height = "0px";
    menuContent.style.height = `${menuContent.scrollHeight}px`;
    setTimeout(() => {
      menuContent.style.transition = 'height 0.2s';
    }, 100);
  }
  localStorage.setItem("textsize", sz);
}

const toggleFont = () => {
  let fontSize = null;
  switch (document.body.style.fontSize) {
    case "18px":
      fontSize = "24"
      break;
    case "24px":
      // Leave it null
      break;
    default:
      fontSize = "18";
      break;
  }
  switchFontSize(fontSize);
};

const updateFavorites = (ev) => {
  const favorite = getMenuItemForFavorite(ev.target);
  if (ev.target.checked) {
    playAnimation(ev.target.parentNode, 'heartBeat');
    const copy = favorite.cloneNode(true);
    copy.onchange = updateFavorites;
    favorites.appendChild(copy);
  } else {
    const index = ev.target.dataset.number;
    favorites.removeChild(getFavoriteNode(index));
    getMenuFavBox(index).checked = false;
  }
};

const playAnimation = (node, animationName, callback) => {
  node.classList.add('animated', animationName)
  function handleAnimationEnd() {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)

    if (typeof callback === 'function') callback()
  }
  node.addEventListener('animationend', handleAnimationEnd)
}

/* Page Initialization */

// Menu control
menuHeader.onclick = toggleDrawer;
pageContent.onclick = () => {
  if (drawerOpen()) {
    closeDrawer();
  }
}

// Menu event handlers
pageButtons.forEach((el) => el.onclick = (e => switchPage(extractCoreId(e.target), true)));

// Menu/Page State
menuTitle.innerHTML = firstPageButton.text;
history.replaceState({id: extractCoreId(firstPageButton)}, null);
const pageId = extractCoreId(firstPageButton);
getPageNode(pageId).style.display = 'block';

// History management
history.scrollRestoration = 'manual';
window.onpopstate = function(event) {
  if (event.state && event.state.id && event.state.id != page) {
    switchPage(event.state.id);
  }
  if (drawerOpen()) {
    closeDrawer();
  }
}

// Favorites initialization
menuCheckboxes.forEach((el, i) => {
  el.checked = false;
  el.dataset.number = i;
  el.onchange = updateFavorites;
});

// Initialize from local storage
const initsize = localStorage.getItem("textsize");
if (initsize != null && initsize != "") {
  switchFontSize(initsize);
}
