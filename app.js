/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const allProducts = [];
var xhttp = new XMLHttpRequest("./");
console.log(xhttp.responseText);
// how many images to dsplay each time
const numberOfProductsToDisplay = 3;
let numberOfRounds = 10;
function Product(name, extention = "jpg") {
  this.name = name;
  this.path = `./img/${name}.${extention}`;
  this.numberOfShown = 0;
  this.votes = 0;
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
console.log(allProducts);

function displayRandomProduct() {
  const arrOfProdects = [];
  let count = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // get random number
    let randomIndex = randomNum();
    // if the product is not unique then repeat
    if (arrOfProdects.includes(allProducts[randomIndex])) continue;
    // if all okay then add a product
    arrOfProdects[count] = allProducts[randomIndex];
    // increment the count
    count++;
    // ic count === the number of images that need to be displayed then stop the loop
    if (count === numberOfProductsToDisplay) break;
  }
  return arrOfProdects;
}
console.table(displayRandomProduct());
function displayImages() {
  const arrOfProdects = displayRandomProduct();
  // add one to every shown image
  allProducts.forEach((product) => {
    for (let index = 0; index < arrOfProdects.length; index++) {
      if (product === arrOfProdects[index]) product.numberOfShown++;
    }
  });
  const products = document.querySelector(".products");
  products.innerHTML = "";

  for (let product = 0; product < arrOfProdects.length; product++) {
    // create a figure and add a class product to it
    let figure = document.createElement("figure");

    figure.setAttribute("class", "product");
    // create an image
    const img = document.createElement("img");
    img.setAttribute("src", arrOfProdects[product].path);
    img.setAttribute("alt", arrOfProdects[product].name);
    // add event listener to the imgs
    img.addEventListener("click", votedProducts);
    //append the imag to the fig
    figure.appendChild(img);
    console.log(img);
    // ad the figure to the products section
    products.appendChild(figure);
  }
}
displayImages();

function votedProducts() {
  const name = event.path[0].alt;
  let index = -1;
  console.log(name);
  for (let product = 0; product < allProducts.length; product++) {
    if (name === allProducts[product]["name"]) index = product;
  }
  console.log(index);
  allProducts[index].votes++;
  console.log(allProducts[index]);
  displayImages();
  numberOfRounds--;
  console.log("numberOfRounds", numberOfRounds);
  if (numberOfRounds === 0) {
    console.table(allProducts);
    let images = document.querySelectorAll("figure img");
    console.log(images.length);
    for (let img = 0; img < images.length; img++) {
      images[img].removeEventListener("click", votedProducts);
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
    console.log(votes, name);
    const li = document.createElement("li");
    li.innerHTML = `${name} had ${votes} votes and was shown ${numberOfShown} times`;
    if (votes > 0) votedProductsList.appendChild(li);
    else unVotedProductsList.appendChild(li);
  });
}

//genarate a random number
function randomNum() {
  return Math.floor(Math.random() * allProducts.length);
}
