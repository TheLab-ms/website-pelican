# website-pelican
Pelican static site generator, virtual environment, and theme

Install Pelican and its dependencies independently of this repo, binaries and environmentals not included here as they differ from system to system.

This repo contains all the pelican configuration files and the site theme files

It also has a submodule link to the content repo

To clone this repo with the submodule content you must add --recursive like this:

```
git clone --recursive https://github.com/TheLab-ms/website-pelican.git
```

Otherwise the content directory will be empty

Pelican will create an output directory if it does not exist.

This directory will not be saved in this github repo due to the .gitignore settings


