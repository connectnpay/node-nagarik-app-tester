const fetch = require('node-fetch');
const crypto = require('crypto');
const randomString = require("randomstring");

const BASE_URL = "https://dev-webservice.nagarikapp.gov.np/api";

async function fetchAccessToken() {
  const response = await fetch(
    BASE_URL + '/clientauth/token',
    {
      method: 'GET',
      headers: {
        'client-code': 'RESTBNK',
        'client-secret': 'hNcKFwvlm9pa00oWunKNRmLeh84MSI2s'
      }
    })
  const data = await response.json();
  return data.token;
}

async function fetchRedirectionCode(token) {
  const body = [8078500, 8078650, 8076950];
  const response = await fetch(
    BASE_URL + '/clients/native/redirection-consent',
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'client-code': 'RESTBNK',
        'Authorization': 'Bearer ' + token
      }
    });

  const data = await response.json();
  return data.redirection_code;
}

async function challengeHashToGenerateQRCode(redirectionCode, challengeHash) {

  const params = new URLSearchParams();
  params.append('challenge_hash', challengeHash);
  params.append('redirection_code', redirectionCode);

  const response = await fetch(
    BASE_URL + '/web0auth/check',
    {
      method: 'POST',
      body: params,
      headers: {
      }
    });
  const data = await response.json();
  return data;
}

async function fetchCitizenshipDetails(token, authorizationCode) {
  const response = await fetch(
    BASE_URL + '/clients/cims/details-consent',
    {
      method: 'GET',
      headers: {
        'client-code': 'RESTBNK',
        'Authorization': 'Bearer ' + token,
        'authorization-code': authorizationCode
      }
    })
  const data = await response.json();
  return data;
}


(async () => {
  const token = await fetchAccessToken();
  console.log(`Access Token:  ${token}`);
  const redirectionCode = await fetchRedirectionCode(token);
  console.log(`Redirection Code : ${redirectionCode}`);
  const challengeHash = generateChallengeHash();
  const challengeHashToGenerateQRCodeResponse = await challengeHashToGenerateQRCode(redirectionCode, challengeHash);
  console.log(`challengeHashToGenerateQRCodeResponse : ${JSON.stringify(challengeHashToGenerateQRCodeResponse)}`);

  /*
  const citizenshipDetails = await fetchCitizenshipDetails(token, "");
  */
})();

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








