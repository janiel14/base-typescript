# base-typescript
project base typescript

## how to use
- npm install
- npm start
- npm run build
- npm run lint
- npm test

## PM2 Support
- npm run build
- pm2 start pm2.json
- pm2 save


## Prject structure folders

```javascript
- __tests__ -> tests
- dist -> copiled files after build
- node_modules -> npm dependencies
- src -> source code project in typescript
    - app -> source code backend api
        - controllers -> source code for controllers class
        - routes -> source code for routes class
    - lib -> source code libs utils using in project
      - types -> source code types for typescript
        - utils -> source types utils from the project
      

```
