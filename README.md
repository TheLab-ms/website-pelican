# website-pelican
Pelican static site generator, virtual environment, and theme

## Binaries and environmentals
Install Pelican and its dependencies independently of this repo, binaries and environmentals not included here as they differ from system to system.

## What's in this repository
This repo contains all the pelican configuration files and the site theme files

It also has a submodule link to the content repo

## Cloning this repository
To clone this repo with the submodule content you must add --recursive like this:

```
git clone --recursive https://github.com/TheLab-ms/website-pelican.git
```

Otherwise the content directory will be empty

## Submodule specifics

By default the submodule is set to a period in time that is was last updated and pushed to this repo regardless if that repo has had changes since.

So make sure you update the submodule content and its cooresponding link in this repo whenever you are working with code here.

This can be done with the following command:

```
git submodule update --init --recursive
```

Another thing you might notice is that git status by default only shows the current repo and not submodules.

To change this behavior on your local git environment to have it show submodule status as well you need to change a global setting on your device.

This can be done with the following command:

```
git config --global status.submoduleSummary true
```

## Output
Pelican will create an output directory if it does not exist.

This is where all the static site generated content is created

This directory will not be saved in this github repo due to the .gitignore settings


