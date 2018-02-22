# Baibulo deploy - a deployment utility for Baibulo/Baibulo.NET projects

The Baibulo project family is a set of utilities that allow projects to leverage parallel frontend
deployments on one environment, saving costs and speeding up development process.

## Usage

Assuming your project uses one of the Baibulo backend solutions first install the baibulo-deploy package

```
$ npm install --save baibulo-deploy
```

Next create 2 scripts in your project.json file:

```
  "scripts": {
    "deploy": "baibulo deploy --dir dist --url http://server/assets",
    "release": "baibulo deploy --dir dist --version release --url http://server/assets"
  }
```

### Please note
In the first case the branch name will be used to deploy files to server.
However if the branch name is ```master``` then the ```deploy``` script is equal to ```release```.

## Command line options

The following command-line options are available:

```
usage: baibulo deploy [options]

  --dir dir          Directory with content to upload [./]
  --url context      * Root URL to deploy to (for example http://server/assets)
  --version          Version (defaults to git branch - master==release)

 * - required option
```

## Technical details

The deployment utility uses HTTP ```PUT``` to upload content to server and the ```Version``` header to pass information about the version to upload. It is essentially the same as using cURL but on a tree
of files instead of just one file at a time.
