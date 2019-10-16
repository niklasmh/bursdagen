# Bursdagen

## Local (with VLC player)

First install

```bash
yarn
```

Now add videoes to the `./videoes` folder (then reference them in the cloud)

Then you need the backend

```bash
yarn server
```

Then you need to run the frontend

```bash
yarn start
```

## Cloud

First install

```bash
yarn
```

Now add info about the videoes to the `./videoes/videoes.js` file (you need to create the file) using this format:

```javascript
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
yarn server cloud
```

Then you need to run the frontend

```bash
yarn start
```
