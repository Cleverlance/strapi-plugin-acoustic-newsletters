# Strapi plugin page-hierarchy

## installation
```
yarn strapi install page-hierarchy
```

## development 

### setup new custom strapi instance

[official docs](https://strapi.io/documentation/3.0.0-beta.x/installation/cli.html)
```sh
yarn create strapi-app page-hierarchy-plugin-test --quickstart

cd page-hierarchy-plugin-test

# create a sym-link for cloned plugin repo:

yarn dev --watch-admin

```

1. Clone repo

2. Create symlink for custom `strapi-plugin-page-hierarchy`

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
