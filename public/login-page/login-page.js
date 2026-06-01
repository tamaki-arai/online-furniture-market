/*
 * Names: Tamaki Arai (tamaki15), Hank O’Brien(hanko2@uw.edu)
 * Date: December 10th 2024
 * Sections:
 * Tamaki: CSE 154 AB; TAs: Elias Belzberg, Peter
 * Hank:   CSE 154 AD; TAs: Ella Joy Crowder, Alison Ho
 *
 * login-page.js changes the views, makes the page functionally work and allows the userto create
 * a new account and log in to the website.
 */

"use strict";
(function() {
  // Module globals
  const MESSAGE_SHOWN_FOR = 3000;

  window.addEventListener("load", init);

  /** Initializes the state of this page. */
  function init() {
    id("go-to-signup").addEventListener("click", (e) => {
      e.preventDefault();
      goToSignup();
    });

    id("go-to-login").addEventListener("click", (e) => {
      e.preventDefault();
      goToLogin(false);
    });

    id("login-form").addEventListener("submit", login);
    id("signup-form").addEventListener("submit", signup);

    let userIcons = qsa(".user-icons");
    userIcons.forEach(element => {
      element.addEventListener("click", () => {
        userIcons.forEach(icon => {
          icon.classList.remove("selected");
        });
        element.classList.add("selected");
      });
    });
  }

  /** Clears the view of "#login-section" and goes to "#signup-section". */
  function goToSignup() {
    id("login-section").classList.add("hidden");
    id("signup-section").classList.remove("hidden");
    id("go-to-login-session").classList.remove("hidden");
    clearLoginForm();
    qs("header").scrollIntoView();
  }

  /** Allows a user to log in as an existing user. */
  function login(e) {
    e.preventDefault();
    console.log("login btn pressed");

    let formData = new FormData();
    formData.append('username', id('login-username').value);
    formData.append('password', id('login-password').value);
    id('login-username').value = '';
    id('login-password').value = '';
    fetch('/login', {method: "POST", body: formData})
      .then(res => statusCheck(res))
      .then(res => res.text())
      .then(res => {
        console.log(res);
        if (res === 'Login successful!') {loginSuccess()}
        else {}
      })

      .catch(error => showError());
  }

  /** Clears all the information input in the login form. */
  function clearLoginForm() {
    id("login-username").value = "";
    id("login-password").value = "";
    qsa(".error-messages").forEach(element => {
      element.classList.add("hidden");
    });
  }

  /**
   * Upon successful login, loginSuccess() shows a message and navigates the user to the
   * main page after a certain time.
   */
  async function loginSuccess() {
    id("login-section").classList.add("hidden");

    id("signup-section").classList.add("hidden");
    id("go-to-login-session").classList.add("hidden");
    clearLoginForm();
    qs("header").scrollIntoView();
    id("login-success-msg").classList.remove("hidden");
    id("back-to-main-page-anchor").classList.add("hidden");

    // Awaits for MESSAGE_SHOWN_FOR milliseconds
    await new Promise(resolve => setTimeout(resolve, MESSAGE_SHOWN_FOR));
    id("login-section").classList.remove("hidden");
    id("login-success-msg").classList.add("hidden");
    id("back-to-main-page-anchor").classList.remove("hidden");
    window.location.href = "/index.html";
    id('you-are-online').classList.remove("hidden");
  }

  /**
   * Shows a message after the user successfully created a new account and navigates the user
   * to the "#login-section".
   * @param {boolean} signupSuccess - Based on this value this function decides to either shows
   *                                  a message or not.
   */
  async function goToLogin(signupSuccess) {
    id("signup-section").classList.add("hidden");
    id("go-to-login-session").classList.add("hidden");
    clearSignupForm();
    qs("header").scrollIntoView();

    // To show a message only when a user has successfully created a new account
    if (signupSuccess) {
      id("signup-success-msg").classList.remove("hidden");
      id("back-to-main-page-anchor").classList.add("hidden");

      // Awaits for MESSAGE_SHOWN_FOR milliseconds
      await new Promise(resolve => setTimeout(resolve, MESSAGE_SHOWN_FOR));
      id("signup-success-msg").classList.add("hidden");
      id("back-to-main-page-anchor").classList.remove("hidden");
    }

    id("login-section").classList.remove("hidden");
  }

  /**
   * Handle the sign-in process when the form is submitted.
   * @param {Event} e - The event object from the form submission.
   */
  function signup(e) {
    e.preventDefault();
    console.log("signup btn pressed");
    let formData = new FormData();
    formData.append('name', id('signup-name').value);
    formData.append('user', id('signup-username').value);
    formData.append('email', id('signup-email').value);
    formData.append('pass', id('signup-password').value);
    formData.append('img', qs('#user-icon-container .selected').src);
    fetch('/adduser', {method: "POST", body: formData})
      .then(res => statusCheck(res))
      .then(res => res.text())
      .then(res => {
        if (parseInt(res) === 1) {loginSuccess()}
      })
      .catch(error => showError());
  }

  /** Clears all the information input in the sign in form. */
  function clearSignupForm() {
    id("signup-email").value = "";
    id("signup-username").value = "";
    id("signup-password").value = "";
    let userIcons = qsa(".user-icons");
    userIcons.forEach(element => {
      element.classList.remove("selected");
    });
    userIcons[0].classList.add("selected");
    qsa(".error-messages").forEach(element => {
      element.classList.add("hidden");
    });
  }

  function handleError() {
    // Hank here. Please fill this in
    console.error("Hank's part");
    id("code-500").classList.remove("hidden");
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
   * Selects all the matching elements and returns a NodeList that contains them.
   * @param {string} selector - A CSS selector string to match elements in the DOM.
   * @returns {NodeList} - A NodeList of all matching elements.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
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