# Bursdagen

## Local (with VLC player)

First install dependencies

```bash
# shell
yarn
```

Now add videoes to the `./videoes` folder (then reference them in the cloud ([Cloud section below](#Cloud-if-you-want-to-host-it-yourself))):

```bash
./videoes/video1.webm
./videoes/video2.webm
...
```

You will also need to change the environment variables by adding a `.env.local` file:

```bash
# .env.local
CLOUD=http://bursdag.niklasmh.no
LOCAL=http://localhost:8999
REACT_APP_CLOUD=ws://bursdagws.niklasmh.no
REACT_APP_LOCAL=ws://localhost:8999
```

Then you need the backend

```bash
#shell
yarn server
```

Then you need to run the frontend

```bash
# shell
yarn start
```

## Cloud (if you want to host it yourself)

First install dependencies

```bash
# shell
yarn
```

Now add info about the videoes to the `./videoes/videoes.js` file (you need to create the file) using this format:

```javascript
// ./videoes/videoes.js
module.exports = [
  {
    name: 'Video 1',
    desc: 'Dette er video 1',
    file: 'video1.webm',
  },
  {
    name: 'Video 2',
    desc: 'Dette er video 2',
    file: 'video2.webm',
  },
]
```

Then you need the backend

```bash
# shell
yarn server cloud
```

Then you need to run the frontend

```bash
# shell
yarn start
```
