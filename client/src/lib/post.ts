const BASEURL = 'http://localhost:8080';

function getData (endpoint: string) {
  const url = BASEURL + endpoint;
  return new Promise<any>((resolve, reject) => {
    fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(resolve)
    .catch(reject);
  });
}

function postData (endpoint: string, data: object) {
  const url = BASEURL + endpoint;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(data)
  };
  return new Promise<any>((resolve, reject) => {
    fetch(url, options)
    .then(response => response.json())
    .then(resolve)
    .catch(reject);
  })
}

export { getData };
export default postData;