fetch("../data/emoji-data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    document.write(data.map((element) => element.emoji));
  });
