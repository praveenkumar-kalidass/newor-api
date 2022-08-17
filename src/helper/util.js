const { encode: btoa } = require('base-64');

const getImageUri = (buffer, fileName) => {
  const [extension] = fileName.match(/\.[0-9a-z]+$/i);
  const mimetype = {
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
  };
  const uri = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return `data:${mimetype[extension]};base64,${uri}`;
};

module.exports = { getImageUri };
