const isProduction = process.env.NODE_ENV === 'production';
const devServer = 'http://localhost:8080';
const BASEURL = isProduction ? window.location.href.slice(0, -1) : devServer;

async function parse (response: Response) {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data;
  }
  catch (e) {
    return text;
  }
}

async function getData (endpoint: string) {
  const url = BASEURL + endpoint;
  const response = await fetch(url, { method: 'GET' });
  const data = parse(response);

  if (!response.ok) {
    console.log(data);
    throw response.statusText;
  }
  return data;
}

async function postData (endpoint: string, body: object) {
  const url = BASEURL + endpoint;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(body)
  };
  const response = await fetch(url, options);
  const data = parse(response);
  
  if (!response.ok) {
    console.log(data);
    throw response.statusText;
  }
  return data;
}

export { getData };
export default postData;