const fetchCord = async (city = "pune") => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
  );
  const data = await res.json();
  return { lat: data[0].lat, lon: data[0].lon };
};

module.exports = {fetchCord}