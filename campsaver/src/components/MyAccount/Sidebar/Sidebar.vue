<template>
  <div class="sidebar">
      <h4>Account Info</h4>
      <ul>
        <li>
          <router-link to="/about-me"><span>About Me</span></router-link>
        </li>
        <li>
          <router-link to="/account-settings"><span>Account Settings</span></router-link>
        </li>
        <li>
          <router-link to="/address-book"><span>Address Book</span></router-link>
        </li>
        <li>
          <router-link to="/communication-preferences"><span>Communication Preferences</span></router-link>
        </li>
      </ul>
  </div>
</template>

<style scoped>
  .sidebar {
    width: 240px;
    float: left;
  }

  h4 {
    font: normal 18px/21px Arial, sans-serif;
    color: #222;
    border-bottom: none;
    background-color: #efefef;
    padding: 15px 10px;
    border-radius: 3px;
    margin: 0 0 10px 0;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  a {
    line-height: 25px;
    color: #3a8e00;
    text-decoration: none;
    font-size: 14px;
  }
  a:hover {
    color: #da3700;
  }

  a.router-link-active {
    color: #000;
    font-weight: bold;
  }

</style>
