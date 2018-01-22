# webpack-multiple-html-boilerplate
webpack boilerplate with multiple HTML page and jQuery vendor

## Add new page 
* add ```example.html``` in ```./src``` directory
* add ```example.js``` in ```./src/scripts``` directory
* add your page and title in ```webpack.config.babel.js```:
```
const pages = {
  index: 'Home',
  about: 'About',
  example: 'title of example'
}
```
