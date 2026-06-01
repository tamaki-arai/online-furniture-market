/*
 * Names: Tamaki Arai (tamaki15), Hank O’Brien(hanko2@uw.edu)
 * Date: December 10th 2024
 * Sections:
 * Tamaki: CSE 154 AB; TAs: Elias Belzberg, Peter
 * Hank:   CSE 154 AD; TAs: Ella Joy Crowder, Alison Ho
 *
 * USED DALLE3 to generate the images
 * index.js changes the views, makes the page functionally work and populate all the sections with
 * items.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /** init() initialize the state of the website by calling the functions below. */
  function init() {
    initPageTop();
    initProductDetailsPage();
    initOthers();
  }

  /** Initializes the filters, login button and search bar. */
  function initPageTop() {
    // Hank here
    /* make functions to populate necessary info on the main page (featured picks, ranking, etc.) */

    // Enable dropdowns
    id("dropdown-title").addEventListener("click", primaryDropdown);
    qsa(".secondary-dropdowns").forEach(element => {
      element.addEventListener("click", secondaryDropdown);
    });
    qsa(".tertiary-dropdowns").forEach(element => {
      element.addEventListener("click", tertiaryDropdown);
    });

    // Enable user login/signup page
    id("login").addEventListener("click", userPage);

    // Enable "#apply-search-filters" button
    id("apply-search-filters").addEventListener("click", (e) => {
      e.preventDefault();
      applyFilters();
    });

    // Enable "#clear-search-filters" button
    id("clear-search-filters").addEventListener("click", (e) => {
      e.preventDefault();
      clearFilters();
    });

    // Make a search
    id("search-btn").addEventListener("click", (e) => {
      e.preventDefault();
      search();
    });

  }

  /** Adds click event listeners of toProductDetailsPage() to all item cards. */
  function initProductDetailsPage() {
    fetch('/items')
      .then(res => statusCheck(res))
      .then(res => res.json())
      .then(data => {
        data.items.forEach((element, index) => {
          if(element.featured === 1) createFeaturedCard(element);
          if(index < 3) {createBestSellerCard(element, index + 1)}
          createListItemCard(element);
          createGridItemCard(element);
        });
      })
      .catch(error => {

      })
  }

  /** Initializes the other stuff such as adding event listeners to miscellaneous targets. */
  function initOthers() {
    loginSet();

    // Enable the toggle switch of the search results (#all-items-switch)
    id("all-items-switch").addEventListener("click", toggleSwitch);

    // Enable "back-to-main-page-anchor".
    id("back-to-main-page-anchor").addEventListener("click", toMainPage);

    // Enable "add-to-cart-btn"
    id("cart").addEventListener("click", toCartPage);
    id("add-to-cart-btn").addEventListener("click", toCartPage);

    // Enable ".incart-removes" button
    qsa(".incart-removes").forEach(element => {
      element.addEventListener("click", removeFromCart);
    });

    id("cart-purchase-btn").addEventListener("click", purchase);

    // Add an event listener to "#logout > a"
    qs("#logout > a").addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  function createFeaturedCard(element) {
    let item = qs('.featured-items-frames').cloneNode(true);
    aqs(item, '.featured-item-names span').textContent = element.name;
    let starElements = aqsa(item, '.featured-stars span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewCount;
    aqs(item, '.featured-images').setAttribute('src', element.mainImage);
    aqs(item, '.featured-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.featured-item-info-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    aqs(item, '.featured-item-descriptions span').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 'f';
    item.addEventListener("click", toProductDetailsPage);
    qs('.featured-picks').appendChild(item);
  }

  function createBestSellerCard(element, rank) {
    let item = qs('.best-selling-products').cloneNode(true);
    aqs(item, 'h4').textContent = '#' + rank;
    let elementTitle = aqsa(item, '.best-selling-products-titles span');
    elementTitle[0].textContent = element.name;
    elementTitle[1].textContent = element.rating;
    elementTitle[2].textContent = element.reviewCount;
    aqs(item, '.best-selling-products-images').setAttribute('src', element.mainImage);
    aqs(item, '.best-selling-products-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.best-selling-products-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    aqs(item, '.best-selling-products-descriptions').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 'b';
    item.addEventListener("click", toProductDetailsPage);
    id('best-selling-products-ranking').appendChild(item);
  }

  function createListItemCard(element) {
    let item = qs('.list-all-contents').cloneNode(true);
    aqs(item, '.list-all-contents-names span').textContent = element.name;
    let starElements = aqsa(item, '.list-all-contents-stars span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewCount;
    aqs(item, '.list-all-contents-images').setAttribute('src', element.mainImage);
    aqs(item, '.list-all-contents-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.list-all-contents-info-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    aqs(item, '.list-all-contents-descriptions span').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 'l';
    item.addEventListener("click", toProductDetailsPage);
    id('list-all-container').appendChild(item);
  }

  function createGridItemCard(element) {
    let item = qs('.grid-all-contents').cloneNode(true);
    aqs(item, '.results-contents-names span').textContent = element.name;
    let starElements = aqsa(item, '.results-contents-stars span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewCount;
    aqs(item, '.results-contents-images').setAttribute('src', element.mainImage);
    aqs(item, '.results-contents-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.results-contents-info-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    aqs(item, '.results-contents-descriptions span').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 'g';
    item.addEventListener("click", toProductDetailsPage);
    id('grid-all-container').appendChild(item);
  }

  function createSearchCard(element) {
    let item = qs('.search-results-contents').cloneNode(true);
    aqs(item, '.results-contents-names').textContent = element.name;
    let starElements = aqsa(item, '.results-contents-stars span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewcount;
    aqs(item, '.results-contents-images').setAttribute('src', element.mainImage);
    aqs(item, '.results-contents-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.results-contents-info-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    aqs(item, '.results-contents-descriptions span').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 's';
    item.addEventListener("click", toProductDetailsPage);
    id('search-results-container').appendChild(item);
  }

  function createCartCard(element, quantity) {
    let item = qs('.featured-items-frames').cloneNode(true);
    aqs(item, '.featured-item-names span').textContent = element.name;
    let starElements = aqsa(item, '.featured-stars span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewCount;
    aqs(item, '.featured-images').setAttribute('src', element.mainImage);
    aqs(item, '.featured-images').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '.featured-item-info-right span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.category;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    aqs(item, '.featured-item-descriptions span').textContent = element.description;
    item.classList.remove('hidden');
    item.id = element.id + 'c';
    item.addEventListener("click", toProductDetailsPage);
    qs('.featured-picks').appendChild(item);
  }

  function primaryDropdown() {
    let options = this.nextElementSibling;
    let dropdownIcon = this.querySelector(".dropdown-icons");

    /* Use "window.getComputedStyle(options).display" to get the real display value.
       "options.style.display" returns an empty string (not "none") on the first click.
    */
    if (window.getComputedStyle(options).display === "none") { // If the dropdown not displayed yet
      options.style.display = "block";
      dropdownIcon.style.transform = "rotate(90deg)";
    } else {
      options.style.display = "none";
      dropdownIcon.style.transform = "rotate(0deg)";
    }
  }

  /** Adds functionalities to the secondary dropdown. */
  function secondaryDropdown() {
    let options = this.nextElementSibling;
    let dropdownIcon = this.querySelector(".dropdown-icons");

    // Use "window.getComputedStyle(options).display" to get the real display value.
    // "options.style.display" returns an empty string (not "none") on the first click.
    if (window.getComputedStyle(options).display === "none") { // If the dropdown is not displayed yet.
      // Close the other open dropdown.
      closeOpenDropdowns(false, true);

      // Open the dropdown.
      options.style.display = "flex";
      if (!options.querySelector(".sub-dropdowns")) { // For dropdowns that do not contain subdropdowns.
        this.style.borderBottom = "1px black solid";
      } // Does nothing for dropdowns that contain subdropdowns.
      dropdownIcon.style.transform = "rotate(90deg)";
    } else {
      options.style.display = "none";
      this.style.borderBottom = "";
      dropdownIcon.style.transform = "rotate(0deg)";
    }
  }

  /** Adds functionalities to the tertiary dropdown. */
  function tertiaryDropdown() {
    let options = this.parentElement.nextElementSibling;
    let dropdownIcon = this.querySelector(".dropdown-icons");

    /* Use "window.getComputedStyle(options).display" to get the real display value.
     "options.style.display" returns an empty string (not "none") on the first click.
    */
    if (window.getComputedStyle(options).display === "none") { // If the dropdown not displayed yet
      // Close the other open dropdown.
      closeOpenDropdowns(false, false);

      // Open the dropdown.
      options.style.display = "flex";
      this.parentElement.style.borderBottom = "1px black dotted";
      dropdownIcon.style.transform = "rotate(90deg)";
    } else {
      options.style.display = "none";
      this.parentElement.style.borderBottom = "";
      dropdownIcon.style.transform = "rotate(0deg)";
    }
  }

  function loginSet() {
    fetch('/checklogin')
      .then(res => statusCheck(res))
      .then(res => res.text())
      .then(res => {
        if (parseInt(res) > 0) {id('you-are-online').classList.remove('hidden')}
        else {id('you-are-online').classList.add('hidden')}
      })
      .catch(error => {

      });
    }


  /**
   * Closes open dropdowns besed on the arguments passed in. If forPrimary is true, it closes
   * the primary dropdown. If forSecondary is true, it closes the secondary dropdown.
   * @param {boolean} forPrimary - True to close the primary dropdown.
   * @param {boolean} forSecondary - True to close secondary dropdowns.
   */
  function closeOpenDropdowns(forPrimary, forSecondary) {
    // Closes the primary dropdown if true.
    if (forPrimary) {
      id("dropdown").style.display = "none";
      id("dropdown-title").querySelector(".dropdown-icons").style.transform = "rotate(0deg)";
    }

    // Closes the other open secondary dropdown if true.
    if (forSecondary) {
      qsa(".secondary-dropdowns").forEach(element => {
        // Initialize only the open dropdown.
        if (element.nextElementSibling.style.display === "flex") {
          element.nextElementSibling.style.display = "none";
          element.style.borderBottom = "";
          element.querySelector(".dropdown-icons").style.transform = "rotate(0deg)";
        }
      });
    }

    // Closes the other open tertiary dropdown.
    qsa(".tertiary-dropdowns").forEach(element => {
      // Initialize only the open dropdown.
      if (element.parentElement.nextElementSibling.style.display === "flex") {
        element.parentElement.nextElementSibling.style.display = "none";
        element.parentElement.style.borderBottom = "";
        element.querySelector(".dropdown-icons").style.transform = "rotate(0deg)";
      }
    });
  }

  /** Shows the message that tells the filters are applied and makes a request to "/filter". */
  function applyFilters() {
    let categories = [];
    qsa('#category-options .checked').forEach(element => {
      categories.push(element.parentElement.textContent);
    })
    let colors = [];
    qsa('#color-options .checked').forEach(element => {
      colors.push(element.parentElement.textContent);
    })
    let brands = [];
    qsa('#category-options .checked').forEach(element => {
      brands.push(element.parentElement.textContent);
    })
    let rating = "";
    rating = qs('#category-options .checked').parentElement.textContent.charAt(0);
    let logic = '';
    if (qsa("#search-filters input[type='radio']")[1].checked) {
      logic = 'OR';
    } else {
      logic = 'AND';
    }
    console.log(colors);
    id("filters-applied").classList.remove("hidden");
    fetch('/filter?categories=' + JSON.stringify(categories) + '&colors=' + JSON.stringify(colors) +
      '&brands=' + JSON.stringify(brands) + '&rating=' + rating + '&logic=' + logic)
      .then(res => statusCheck(res))
      .then(res => res.JSON())
      .then(data => data.forEach(element => {
        hideUnselectedItems(data);
      }))
  }

  /** Initializes the filters. */
  function clearFilters() {
    // Clear checkboxes
    qsa("#search-filters input[type='checkbox']").forEach(element => {
      element.checked = false;
    });

    // Initialize the AND/OR radio
    qsa("#search-filters input[type='radio']")[1].checked = true;

    // Fold the filters
    closeOpenDropdowns(true, true);
  }

  function clearPage() {
    closeOpenDropdowns(true, true);
    id("transaction-message").classList.add("hidden");
    id("filters-applied").classList.add("hidden");
    id("search-bar-input").value = "";
  }

  /**
   * Checks if the user is logged in. Returns true if so, else returns false.
   * @return {boolean} - True if the user is logged in, false if not.
   */
  function loginCheck() {
    if (!id("you-are-online").classList.contains("hidden")) { // If the user is logged in
      return true;
    } else { // If the user is not logged in
      window.location.href = "login-page/login-page.html";
      clearPage();
      return false;
    }
  }

  /** Changes the view to "#user-page". */
  function changeViewUserPage() {
    id("main-page").classList.add("hidden");
    id("search-results-page").classList.add("hidden");
    id("product-details-page").classList.add("hidden");
    id("cart-page").classList.add("hidden");
    id("user-page").classList.remove("hidden");

    id("main-page-index").classList.add("hidden");
    id("search-results-page-index").classList.add("hidden");
    id("product-details-page-index").classList.add("hidden");
    id("cart-page-index").classList.add("hidden");
    id("user-page-index").classList.remove("hidden");

    clearPage();

    id("user-page").scrollIntoView();
  }

  /** Changes the view to #user-page and makes a requst to "/user" if the user is logged in. */
  function userPage() {
    if (loginCheck()) {
      // Change view
      changeViewUserPage();

      // Hank here
      fetch('/user')
        .then(res => statusCheck(res))
        .then(res => res.JSON())
        .then(data => {
        })
        .catch(error => {

        });
    }
  }

  /** Logs out a user if the user is logged in. */
  function logout() {
    if (loginCheck()) {
      fetch('/logout').
        catch(error => {

        });
      window.location.reload();
    }
  }

  /**
   * Checks if there is a matching searching results. Returns true if any, else returns false.
   * @return {boolean} - True if the search hits at least one item, false if there is no matching
   *                     searching results.
   */
  function searchResultsCheck() {
    if (id("search-results-container").querySelector(".search-results-contents")) {
      id("search-results-empty").classList.add("hidden");
      return true;
    } else {
      id("search-results-empty").classList.remove("hidden");
      return false;
    }
  }

  /** Changes the view to the "#search-results-page". */
  function changeViewSearch() {
    console.log('called search');
    id("main-page").classList.add("hidden");
    id("search-results-page").classList.remove("hidden");
    id("product-details-page").classList.add("hidden");
    id("cart-page").classList.add("hidden");
    id("user-page").classList.add("hidden");

    id("main-page-index").classList.add("hidden");
    id("search-results-page-index").classList.remove("hidden");
    id("product-details-page-index").classList.add("hidden");
    id("cart-page-index").classList.add("hidden");
    id("user-page-index").classList.add("hidden");
    id("search-results-page").scrollIntoView({behavior: 'smooth'});
  }

  /**
   * Changes the view to "#search-results-page", makes a request to "/items" and displays the
   * search results.
   */
  function search() {
    // Change view
    changeViewSearch();

    // Hank here
      let searchTerms = id("search-bar-input").value.trim().split(/\s+/);
      console.log(id("search-bar-input").value);
      clearPage();
      fetch('/items?search=' + JSON.stringify(searchTerms))
        .then(res => statusCheck(res))
        .then(res => res.json())
        .then(data => {
          data.items.forEach(element => {
            createSearchCard(element);
          })})
        .catch(error => {

          });

      // Upon successful search
      searchResultsCheck();
  }

  /** Toggles the list-grid switch. */
  function toggleSwitch() {
    id("all-items-switch-circle-container").classList.toggle("all-items-switch-toggled");
    id("list-view").classList.toggle("hidden");
    id("grid-view").classList.toggle("hidden");
  }

  /** Changes the view to the "#main-page". */
  function toMainPage() {
    id("main-page").classList.remove("hidden");
    id("search-results-page").classList.add("hidden");
    id("product-details-page").classList.add("hidden");
    id("cart-page").classList.add("hidden");
    id("user-page").classList.add("hidden");

    id("main-page-index").classList.remove("hidden");
    id("search-results-page-index").classList.add("hidden");
    id("product-details-page-index").classList.add("hidden");
    id("cart-page-index").classList.add("hidden");
    id("user-page-index").classList.add("hidden");

    clearPage();
  }

  /**
   * Checks if there is at least one review. Returns true if so, else returns false.
   * @returns {boolean} - Returns true if there is at least one review, false if not.
   */
  function reviewsCheck() {
    if (id("product-details-reviews-container")
      .querySelector(".product-details-reviews-contents")) {
      id("reviews-empty").classList.add("hidden");
      return true;
    } else {
      id("reviews-empty").classList.remove("hidden");
      return false;
    }
  }

  /** Changes the view to "#product-details-page". */
  function changeViewToProductDetailsPage() {
    id("main-page").classList.add("hidden");
    id("search-results-page").classList.add("hidden");
    id("product-details-page").classList.remove("hidden");
    id("cart-page").classList.add("hidden");
    id("user-page").classList.add("hidden");

    id("main-page-index").classList.add("hidden");
    id("search-results-page-index").classList.add("hidden");
    id("product-details-page-index").classList.remove("hidden");
    id("cart-page-index").classList.add("hidden");
    id("user-page-index").classList.add("hidden");

    clearPage();

    id("product-details-page").scrollIntoView();
  }

  /**
   * Changes to view to "#product-details-page", makes a request to "/product" and displays the
   * detailed information of the product.
   */
  async function toProductDetailsPage() {
    // Change view
    changeViewToProductDetailsPage();

    // Hank here

    fetch('/product/' + this.id)
      .then(res => statusCheck(res))
      .then(res => res.json())
      .then(data => {showProductInfo()})
      .catch(error => {
        handleError();
      })
    try {
      let result = await fetch('/product/' + this.id);
      await statusCheck(result);
      let data = await result.json();
      let name = genAdvanced('span', 'product-details-name',
        null, null, id('product-details-contents'));
      let strong = genAdvanced('strong', null, null, data.name, name);
      let img = genAdvanced()
      reviewsCheck();
    } catch (err) {
      handleError();
    }
  }

  function showProductInfo(element) {
    id('product-details-name').textContent = element.name;
    let starElements = aqsa(item, '#product-details-reviews-info span');
    starElements[0].textContent = element.rating;
    starElements[1].textContent = element.reviewcount;
    id('product-details-image').setAttribute('src', element.mainImage);
    id('product-details-image').setAttribute('alt', element.name);
    let infoElements = aqsa(item, '#product-details-list span');
    infoElements[0].textContent = element.price;
    infoElements[1].textContent = element.stocks;
    infoElements[2].textContent = element.categories;
    infoElements[3].textContnet = element.colors;
    infoElements[4].textContent = element.materials;
    infoElements[5].textContent = 'Width: ' + element.width + 'in. Depth: ' + element.depth +
    'in. Height: ' + element.height +'in.';
    infoElements[6].textContent = element.brand;
    id('product-details-description').textContent = element.description;
    id('search-results-container').appendChild(item);
  }

  /**
   * Checks if there is at least one item in the cart. Returns true if so, else returns false.
   * @returns {boolean} - Returns true if there is at least one item in the cart, false if not.
   */
  function cartCheck() {
    if (id("cart-container").querySelector(".cart-items")) {
      id("cart-empty").classList.add("hidden");
      return true;
    } else {
      id("cart-empty").classList.remove("hidden");
      return false;
    }
  }

  /** Changes the view to the "#cart-page". */
  function changeViewToCartPage() {
    id("main-page").classList.add("hidden");
    id("search-results-page").classList.add("hidden");
    id("product-details-page").classList.add("hidden");
    id("cart-page").classList.remove("hidden");
    id("user-page").classList.add("hidden");

    id("main-page-index").classList.add("hidden");
    id("search-results-page-index").classList.add("hidden");
    id("product-details-page-index").classList.add("hidden");
    id("cart-page-index").classList.remove("hidden");
    id("user-page-index").classList.add("hidden");

    clearPage();

    id("cart-page").scrollIntoView();

    cartCheck();
  }

  /**
   * If the user is logged in, it changes the view to the "#cart-page", makes a request
   * and displays the items in the cart.
   */
  function toCartPage() {
    if (loginCheck()) {
      // Change view
      changeViewToCartPage();

      // Hank here
      try {

      } catch (err) {
        handleError();
      }
    }
  }

  /** Removes the clicked item from the cart. */
  function removeFromCart() {
    let parent = this.parentElement;
    while (!parent.classList.contains("cart-items")) {
      parent = parent.parentElement;
    }
    parent.remove();
    cartCheck();
  }

  /**
   * If there is at least one item in the cart and the confirmation checkbox is checked,
   * it allows the user to purchase all the items in the cart.
   */
  function purchase() {
    let Confirmed = qs("#transaction-confirmation > input").checked;

    // Only if the cart is not empty
    if (cartCheck() && Confirmed) {
      try {
        // Hank here



        // Transaction complete
        id("cart-container").querySelectorAll(".cart-items")
        .forEach(items => items.remove()); // Clear cart
        id("transaction-message").classList.remove("hidden"); // Reveal the transaction message
        cartCheck(); // Check that the cart is empty and show the cart-empty message
        id("cart-page").scrollIntoView({behavior: 'smooth'}); // Move to #cart-page smoothly
      } catch (err) {
        handleError();
      }
    }
  }

  function genFeaturedDisplayCard(name, rating, reviews, price, stocks,
    category, colors, materials, size, description, id) {
      let frame = genAdvanced('article', id, 'featured-items-frames', null, null);
      let card = genAdvanced('article', null, 'featured-items', null, frame);
      //let name = genAdvanced('div', null, 'featured-item-names', name, card); // I comment-outed this because this stopped the page from working
      let info = genAdvanced('div', null, 'featured-item-info', null, card);
      let left = genAdvanced('div', null, 'featured-item-info-left', null, info);
      //let rating = genAdvanced('p') // I comment-outed this because this stopped the page from working
  }

  /** Displays an error message in the top right section of the main page. */
  function handleError() {
    console.error("no way");
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Selects and returns the DOM element with the given id.
   * @param {string} id - The id of the DOM element to select.
   * @returns {HTMLElement|null} The DOM element with the id, or null if not found.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Selects and returns the DOM element with the given selector.
   * @param {string} selector - The selector of the DOM element to select.
   * @returns {HTMLElement|null} The DOM element with the selector, or null if not found.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

    /**
   * Selects and returns the child DOM element with the given selector from given parent
   * @param {HTMLElement} parent - The parent object we are selecting from
   * @param {string} selector - The selector of the DOM element to select.
   * @returns {HTMLElement|null} The DOM element with the selector, or null if not found.
   */
    function aqs(parent, selector) {
      return parent.querySelector(selector)
    }

  /**
   * Selects all the matching elements and returns a NodeList that contains them.
   * @param {string} selector - A CSS selector string to match elements in the DOM.
   * @returns {NodeList} - A NodeList of all matching elements.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Selects all the matching child elements of a given parent and returns a
   * NodeList that contains them.
   * @param {HTMLElement} parent The parent object we are selecting from
   * @param {string} selector - A CSS selector string to match elements in the DOM.
   * @returns {NodeList} - A NodeList of all matching elements.
   */
  function aqsa(parent, selector) {
    return parent.querySelectorAll(selector);
  }

  /**
   * Generates and Returns a new DOM element with the tagname to name.
   * @param {string} tagName - The name of tag to name.
   * @returns {HTMLElement} The new DOM element with the tagname.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

    /**
   * Generates a new HTML element based on inputed data
   * @param {string} tagName - the type of HTML tag being generated
   * @param {string} id - the id of the HTML tag being generated
   * @param {string} objClass - the first class of the HTML tag being generated
   * @param {string} text - the textContent of the HTML tag being generated
   * @param {HTMLElement} parent - the parent of the HTML object being generated
   * @returns {HTMLElement} the HTML element that we want
   */
    function genAdvanced(tagName, id, objClass, text, parent) {
      let newElement = document.createElement(tagName);
      if (id != null) {
        newElement.setAttribute('id', id);
      }
      if (objClass != null) {
        newElement.classList.add(objClass);
      }
      if (text != null) {
        newElement.textContent = text;
      }
      if (parent != null) {
        parent.appendChild(newElement);
      }
      return newElement;
    }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text.
   * @param {object} res - Response to check for success/error.
   * @return {object} - Valid response if response was successful, otherwise rejected
   *                    Promise result.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }
})();