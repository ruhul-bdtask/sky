function getImgUrl(name) {
  return new URL(`@/public/images/${name}`, import.meta.url).href;
}

export { getImgUrl };
