# firebase-queue
Firebase queue node server - this repository is a micro-service configured specifically to work with Reprocess Core.

## Recommended Node version
Node LTS 6.9.4

## Setup

* We recommend you install the packages with [yarn](https://yarnpkg.com/)
```
yarn install
```

* [Add the Firebase Admin SDK to your Server](https://firebase.google.com/docs/admin/setup)

You need to add your generated Firebase Database URL and Firebase Service Account Credentials to your environment as a secret.

If your deploying to Zeit now, you can use these instructions

* Encode your Firebase Service Account Private Key that you generated to base64 -> [you can use this tool](http://www.url-encode-decode.com/base64-encode-decode/)

* Then add the encoded string as a secret with the name firebase_admin_key
```
now secret add firebase_admin_key PASTE YOUR BASE64 ENCODED FIREBASE ADMIN SERVICE PRIVATE KEY STRING HERE
```

* Add your database url that you generated as a secret with the name firebase_database_url
```
now secret add firebase_database_url https://lorem-ipsum-XXXX.firebaseio.com
```

For more information you can [watch this tutorial here](https://egghead.io/lessons/tools-configure-secrets-and-environment-variables-with-zeit-s-now)

## Deployment

For development purposes only - we recommend [Zeit Now](https://zeit.co/now)

Consider watching this [Zeit Now egghead.io course](https://egghead.io/courses/deploy-web-apps-with-zeit-now)

### Deployment Procedure

* First run the tests (wip)
```
yarn test
```
* Then create the build
```
yarn build
```
* Then deploy to Zeit Now
```
yarn now
```
* Then delete any old instances of the firebase queue server
```
now ls
now rm xxxxx
```

* If this is your first time deploying, [create a now alias for your server](https://zeit.co/blog/now-alias)
```
now alias firebase-queue-service https://env-xxxxxxxxxxx.now.sh
```

* If you need to keep your server awake, you can use a service like [uptimerobot.com](http://uptimerobot.com/) pointing at your alias

## Git

This repository uses [git-flow](http://danielkummer.github.io/git-flow-cheatsheet/) using the following branches and prefixes
* master
* develop
* feature/
* hotfix/
* release/
* v -> (for version prefix)

## Code Style
[Airbnb style guide](https://github.com/airbnb/javascript)
