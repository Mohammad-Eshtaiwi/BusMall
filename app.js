/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const allProducts = [];
const renderedOfProdects = [];
let temp = [];
// how many images to dsplay each time
const numberOfProductsToDisplay = 6;
let numberOfRounds = 10;
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
  console.log("from the random", renderedOfProdects);
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
      console.log("removed");
      images[img].classList.remove("pointer");
    }
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
  const names = [];
  const colors = [];
  const borderColors = [];
  allProducts.forEach((product) => {
    numberOfShown.push(product.numberOfShown);
    names.push(product.name);
    //genarate random rgb colors
    let tempColor = [randomNum(256), randomNum(256), randomNum(256)];
    colors.push(`rgba(${tempColor[0]},${tempColor[2]},${tempColor[0]},0.2)`);
    borderColors.push(
      `rgba(${tempColor[0]},${tempColor[2]},${tempColor[0]},1)`
    );
  });
  console.log(colors, borderColors);
  console.log(names, numberOfShown);
  const graphs = document.querySelector(".graphs");
  const barCanvas = document.createElement("canvas");
  const barCanvasCtx = barCanvas.getContext("2d");
  console.log(barCanvasCtx);
  console.log(graphs);
  graphs.appendChild(barCanvas);
  // eslint-disable-next-line no-undef
  const numberOfShownGraph = new Chart(barCanvasCtx, {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          label: "# of Shown",
          data: numberOfShown,
          backgroundColor: colors,
          borderColor: borderColors,
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
  numberOfShownGraph.canvas.parentNode.style.width = "99%";
  numberOfShownGraph.canvas.parentNode.style.height = "600px";
}

//genarate a random number
function randomNum(range = allProducts.length) {
  return Math.floor(Math.random() * range);
}
