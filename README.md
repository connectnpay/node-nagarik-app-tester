# Nagarik App Tester

> How we generated Challenge Hash

```javascript
  function computeSHA256(data) {
    const hash = crypto.createHash('sha256').update(data).digest('base64');
    return hash;
  }

 function generateChallengeHash() {
    return computeSHA256(randomString.generate({
        length: 40,
        charset: 'alphanumeric'
    }));
 }
```