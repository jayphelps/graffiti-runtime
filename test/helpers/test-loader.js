export default function () {
  let entries = Object.keys(requirejs.entries);
  entries.forEach(function (dep) {
    if (dep.endsWith('.spec')) {
      require(dep);
    }
  });
}
