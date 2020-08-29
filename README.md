# Strapi plugin acoustic-newsletters

## installation
```
yarn strapi install acoustic-newsletters
```

## configuration
create `/config/acousticNewsletters.js` and setup url for the newsletter backend like:

```javascript
module.exports = ({ env }) => ({
  // TODO: implement env variable
  url: 'https://clevercmssit.creditas.cleverlance.com/capi/newsletter'jj
});

```
these config is served vai HTTP endpoint to the frontend of the plugin

## Strapi issue with creating components in the plugin
issue: https://github.com/strapi/strapi/issues/7640

now you have to go to the `/components_copy_dependency` and move its content into root of your project to the `/components` folder 
for correct database definition



## development 

### setup new custom strapi instance

[official docs](https://strapi.io/documentation/3.0.0-beta.x/installation/cli.html)
```sh
yarn create strapi-app acoustic-newsletters-plugin-test --quickstart

cd acoustic-newsletters-plugin-test

# create a sym-link for cloned plugin repo:

yarn dev --watch-admin

```

1. Clone repo

2. Create symlink for custom `strapi-plugin-acoustic-newsletters`

```sh
# MacOS
ln -s {{ROOT_PATH}}/strapi-plugin-acoustic-newsletters {{ROOT_PATH}}/test-plugins/plugins/acoustic-newsletters

```

```bat
rem Windows
New-Item -ItemType SymbolicLink -Name .\examples\getstarted\plugins\menu -Target .\packages\strapi-plugin-menu\
```

3. Code installation/setup

```sh
# cd {{ROOT_PATH}}/

# cd {{ROOT_PATH}}/examples/getstarted
yarn build
yarn dev # its alias for `yarn develop --watch-admin`

# open URLs:
> http://localhost:8000/admin
> http://127.0.0.1:1337/documentation/v1.0.0
> http://localhost:1337/graphql
```

### windows troubleshooting

set `HOST` env variable for `localhost`

`HOST=127.0.0.0`
