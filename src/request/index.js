import { Body, fetch } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api/tauri";

const webApiBaseUrl = "http://localhost:3000";

async function request({
  params = {},
  data = {},
  headers = {},
  method = "GET",
  url,
}) {
  // TAURI
  if (window.__TAURI__) {
    return tauriRequest({ params, data, headers, method, url });
  }

  // 浏览器
  const formatParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    formatParams.append(key, params[key]);
  });
  const comUrl = `${webApiBaseUrl}${url}?${formatParams.toString()}`;
  return window
    .fetch(comUrl, {
      credentials: "include",
      mode: "cors",
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(!["GET", "HEAD"].includes(method) && { body: JSON.stringify(data) }),
    })
    .then((response) => response.json());
}

async function tauriRequest({
  params = {},
  data = {},
  headers = {},
  method = "GET",
  url,
}) {
  // Rust 组装请求参数
  const result = await invoke("get_params", {
    options: {
      method,
      url,
      params: tauriFormatParams(params),
      cookie: "",
    },
  });
  const options = {
    method: result.method,
    headers: result.headers.reduce((total, [key, value]) => {
      total[key] = value;
      return total;
    }, {}),
    body: Body.text(result.body),
  };
  // 直接调API无跨域，无需部署后端服务
  return fetch(result.url, options)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function tauriFormatParams(params) {
  return Object.keys(params).reduce((total, key) => {
    total.push([key, params[key]]);
    return total;
  }, []);
}

export default request;
