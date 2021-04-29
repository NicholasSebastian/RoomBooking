function postData (url: string, data: object) {
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

export default postData;