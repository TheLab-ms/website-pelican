# website-pelican
Pelican static site generator, virtual environment, and theme

## Binaries and environmentals
Install Pelican and its dependencies independently of this repo, binaries and environmentals not included here as they differ from system to system.

Pelican has [Good Documentation](http://docs.getpelican.com/en/3.6.3/install.html) to help you with this.

## What's in this repository
This repo contains all the pelican configuration files and the site theme files

It also has a submodule link to the content repo.  This content is provided here for site generation purposes only not for updating the content.  The preferred method for updating content is to check out that repository independently to avoid much of the complexities of working with submodules.

## Cloning this repository
To clone this repo with the submodule content you must add --recursive like this:

```
git clone --recursive https://github.com/TheLab-ms/website-pelican.git
```

Otherwise the content directory will be empty

## Submodule specifics

By default the submodule is set to a period in time that is was last updated and pushed to this repo regardless if that repo has had changes since.

So make sure you update the submodule content and its link in this repo whenever you are working with code here.  
This can be done with the following commands:

```
git pull
git submodule sync --recursive
git submodule update --init --recursive
```

This should bring the submodule up to date with its most recent version.  However, sometimes this still seems to have issues working.  In this case you can try the following:

```
cd content
git fetch
git checkout master
cd ..
```

Given all the potential problems with detached head state that submodules pose we strongly suggest that you do not edit content in the submodule but rather from a separate git clone of the content repository.

Should you decide against this suggestion and edit content in the submodule you must remember to do a separate git commit and git push within the submodule directory in addition to but immediately before the git commit and git push in the parent directory.

```
cd content
<changes made>
git commit -a -m 'content update'
git push
cd ..
git commit -a -m 'submodule update'
git push --recurse-submodules=on-demand
```

Another thing you might notice is that git status by default only shows the current repo and not submodules.

To change this behavior on your local git environment to have it show submodule status as well you need to change a global setting on your device.  
This can be done with the following command:

```
git config --global status.submoduleSummary true
```

## Template and Content variables
Template files and content files can contain a number of different variables to be parsed by pelican.

While you should not have to directly edit these most times you might have to use the variables for pathing relative to server root.

The configuration file sets what the site url will be which may change based on if it is being published to production or a qa site.  For example production will all be starting at / like /images or http://thelab.ms/images but the qa site might start with /website-content/ line /website-content/images or http://thelab-ms.github.io/website-content/

So in order to make sure internal links work properly you should use the {{ SITEURL }} variable on template pages and the {filename} variable on content pages.

This is most important for content pages.  Do not simply create an internal link to content such as href="/images/abc.gif" and expect it to work!  Use the proper variable format of href="{filename}/images/abc.gif" and it will work fine.

## Output
Pelican will create an output directory if it does not exist.

This is where all the static site generated content is created

This directory will not be saved in this github repo due to the .gitignore settings

## Generating Output and Previewing it locally
Generating the output with Pelican is a one line command which tells Pelican where the content is located and which configuration file to use and which theme to use.  Here is the command you can use to generate the content:

```
pelican content -s pelicanconf.py -t themes/pelican-bootstrap3-thelab
```

This will generate all the static page content into the output directory.  To preview what this looks like you can use python to launch a simple local web server to host this site on your localhost on port 8000.  To launch this type the following commands:

```
cd output
python -m SimpleHTTPServer
```

You can now preview your site by navigating to [http://localhost:8000](http://localhost:8000) in your browser.


## Generating Output for QA and publishing it to the github QA site
Generating the output for QA uses a different configuration file named qaconfig.py which has SITEURL set to http://thelab-ms.github.io/website-content/

```
pelican content -s qaconfig.py -t themes/pelican-bootstrap3-thelab
```

This will generate all the static page content into the output directory formated for the QA site.  The QA site is a secondary branch of the website-content repository names gh-pages

In order to push content to this secondary branch you must use the following git format:

```
git push origin gh-pages
```

Otherwise it works just like any other git repository.

Once you push the QA output to the gh-pages repository you can preview your site by navigating to [http://thelab-ms.github.io/website-content/](http://thelab-ms.github.io/website-content/) in your browser.

