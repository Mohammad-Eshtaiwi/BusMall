/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const allProducts = [];
const renderedOfProdects = [];
let temp = [];
// how many images to dsplay each time
const numberOfProductsToDisplay = 3;
let numberOfRounds = 25;
function Product(name, extention = "jpg") {
  this.name = name;
  this.path = `./img/${name}.${extention}`;
  this.numberOfShown = 0;
  this.votes = 0;
  this.unique = true;
}
let images = [
  "bag",
  "banana",
  "boots",
  "breakfast",
  "bubblegum",
  "chair",
  "cthulhu",
  "dog-duck",
  "dragon",
  "pen",
  "pet-sweep",
  "scissors",
  "shark",
  { name: "sweep", extention: "png" },
  "tauntaun",
  "unicorn",
  { name: "usb", extention: "gif" },
  "water-can",
  "wine-glass",
];
// itarate over the imgs to create products
images.forEach((img) => {
  if (typeof img === "string") allProducts.push(new Product(img));
  else allProducts.push(new Product(img.name, img.extention));
});

function generateRandomProduct() {
  let count = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // get random number
    let randomIndex = randomNum();
    // if the product is not unique then repeat
    if (!allProducts[randomIndex].unique) continue;
    if (renderedOfProdects.includes(allProducts[randomIndex])) continue;
    // if all okay then add a product
    allProducts[randomIndex].unique = false;
    renderedOfProdects[count] = allProducts[randomIndex];
    // increment the count
    count++;
    // ic count === the number of images that need to be displayed then stop the loop
    if (count === numberOfProductsToDisplay) break;
  }
  temp = renderedOfProdects;
}
function displayImages() {
  generateRandomProduct();

  // add one to every shown image
  allProducts.forEach((product) => {
    for (let index = 0; index < renderedOfProdects.length; index++) {
      if (product === renderedOfProdects[index]) product.numberOfShown++;
    }
  });
  const products = document.querySelector(".products");
  products.innerHTML = "";

  for (let product = 0; product < renderedOfProdects.length; product++) {
    // create a figure and add a class product to it
    let figure = document.createElement("figure");

    figure.setAttribute("class", "product");
    // create an image
    const img = document.createElement("img");
    img.setAttribute("src", renderedOfProdects[product].path);
    img.setAttribute("alt", renderedOfProdects[product].name);
    img.setAttribute("class", "pointer");
    // add event listener to the imgs
    img.addEventListener("click", votedProducts);
    //append the imag to the fig
    figure.appendChild(img);
    // ad the figure to the products section
    products.appendChild(figure);
  }
}
displayImages();

function votedProducts() {
  const name = event.path[0].alt;
  let index = -1;
  for (let product = 0; product < allProducts.length; product++) {
    if (name === allProducts[product]["name"]) index = product;
  }
  allProducts[index].votes++;
  // make a copy of the current displayed products

  displayImages();
  // switch the unique property for the previus products after displaying the new products
  allProducts.forEach((product) => {
    const { name } = product;
    product.unique = true;
    for (let i = 0; i < temp.length; i++) {
      if (name === temp[i]["name"]) product.unique = false;
    }
  });
  numberOfRounds--;
  if (numberOfRounds === 0) {
    let images = document.querySelectorAll("figure img");
    for (let img = 0; img < images.length; img++) {
      images[img].removeEventListener("click", votedProducts);
      images[img].classList.remove("pointer");
    }
    // save the data into the local storage
    saveData();
    updateAllProducts();
    displayResults();
  }
}

function displayResults() {
  let votedProductsHeading = document.querySelector("h2:first-of-type");
  votedProductsHeading.innerHTML = "Voted Products";
  let votedProductsList = document.querySelector("ul:first-of-type");
  let unVotedProductsHeading = document.querySelector("h2:last-of-type");
  unVotedProductsHeading.innerHTML = "Unvoted Products";
  let unVotedProductsList = document.querySelector("ul:last-of-type");

  allProducts.forEach((product) => {
    const { votes, name, numberOfShown } = product;
    const li = document.createElement("li");
    li.innerHTML = `${name} had ${votes} votes and was shown ${numberOfShown} times`;
    if (votes > 0) votedProductsList.appendChild(li);
    else unVotedProductsList.appendChild(li);
  });
  //display the bar graph for the number of showns
  const numberOfShown = [];
  const votes = [];
  const names = [];
  const backgroundColor = [];
  const borderColor = [];
  allProducts.forEach((product) => {
    numberOfShown.push(product.numberOfShown);
    names.push(product.name);
    votes.push(product.votes);
    //genarate random rgb colors
    let tempColor = [randomNum(256), randomNum(256), randomNum(256)];
    backgroundColor.push(
      `rgba(${tempColor[0]},${tempColor[1]},${tempColor[2]},0.2)`
    );
    borderColor.push(`rgba(${tempColor[0]},${tempColor[2]},${tempColor[0]},1)`);
  });

  // render graph for number of shown
  renderGraph(
    `# of shown`,
    names,
    numberOfShown,
    ".graph-for-shown",
    backgroundColor,
    borderColor
  );
  // render graph for number of votes
  renderGraph(
    `# of votes`,
    names,
    votes,
    ".graph-for-votes",
    backgroundColor,
    borderColor
  );
}

//genarate a random number
function randomNum(range = allProducts.length) {
  return Math.floor(Math.random() * range);
}
// function to make a graph

function renderGraph(
  label,
  labels,
  data,
  container,
  backgroundColor,
  borderColor,
  type = "bar"
) {
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");
  container = document.querySelector(container);
  container.appendChild(canvas);
  // eslint-disable-next-line no-undef
  const graph = new Chart(canvasCtx, {
    type,
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
  graph.canvas.parentNode.style.width = "99%";
  graph.canvas.parentNode.style.height = "600px";
}

// saved data to local storage
function saveData() {
  let arrVotes = [];
  let arrShownTimes = [];
  allProducts.forEach((product) => {
    const { votes, numberOfShown, name } = product;
    arrVotes.push({ name, votes });
    arrShownTimes.push({ name, numberOfShown });
  });
  saveDataLogic(arrVotes, "votes");
  saveDataLogic(arrShownTimes, "numberOfShown");
}
function saveDataLogic(currentData, key) {
  // if not exist create new one
  if (!localStorage.getItem(key)) {
    currentData = JSON.stringify(currentData);
    JSON.parse(localStorage.getItem(key));
    localStorage.setItem(`${key}`, currentData);
  }
  // update all products from the storage

  //if exist get it from the storage and add the current data then store it again
  else {
    let storedRecord = JSON.parse(localStorage.getItem(key));
    console.log(storedRecord);
    storedRecord.forEach((stored, index) => {
      console.log(stored);
      stored[key] += currentData[index][key];
    });
    storedRecord = JSON.stringify(storedRecord);
    localStorage.setItem(key, storedRecord);
  }
}
function updateAllProducts() {
  let storedVotes = JSON.parse(localStorage.getItem("votes"));
  let storedNumberOfShown = JSON.parse(localStorage.getItem("numberOfShown"));
  allProducts.forEach((product, index) => {
    console.log(storedVotes[index]);
    product.votes = storedVotes[index].votes;
    product.numberOfShown = storedNumberOfShown[index].numberOfShown;
  });
}
