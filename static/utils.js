const fetch = (url, headers, method, body) => {
  if (window.fetch) {
    const headerObject = new Headers();
    Object.keys(headers).forEach((key) => {
      headerObject.append(key, headers[key]);
    });
    const opts = {
      method,
      headers: headerObject,
      body,
    };
    return window.fetch(url, opts);
  }
};

export const GET = (url) => fetch(url, 'get');

export const POST = (url, body) => fetch(url, {
  'content-type': 'application/json',
}, 'POST', JSON.stringify(body));
