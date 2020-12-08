export function replaceAll(str: string, search: string, replacements: string): string {
  return str.includes(search) ? replaceAll(str.replace(search, replacements), search, replacements) : str;
}

export function getFile(url: string, isBlob?: boolean) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = isBlob ? 'blob' : '';
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        const urlArr = xhr.responseURL.split('/');
        resolve({data: xhr.response, url: urlArr[urlArr.length - 1]});
      }
      reject(new Error(xhr.statusText));
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

/* eslint-disable no-bitwise */
export function hex2rgb(hex: string, a?: number) {
  if (!hex.startsWith('#')) return hex;
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return a ? `rgba(${r},${g},${b},${a})` : `rgba(${r},${g},${b})`;
}
