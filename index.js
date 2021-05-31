const scrape = require("./scrape");
const fs = require("fs");
const fastcsv = require("fast-csv");

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const alphatest = ["y"];

const ws = fs.createWriteStream("out.csv");

const data = [];

const write = () => {
  fastcsv.write(data, { headers: true }).pipe(ws);
}

const wait = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const main = async cb => {
  for (letter of alphabet) {
    const page = await scrape(`https://dentons.net/list/categories/${letter}?location=national-united-kingdom`);
    console.log(`Grabbed Main Category Page: ${letter}`);
    const categories = page.window.document.querySelectorAll(".list-unstyled li a");
    for (cat of categories) {
      await wait(500);
      const subPage = await scrape(cat.href);
      console.log(`Grabbed Sub Category Page: ${cat}`);
      const subCategories = subPage.window.document.querySelectorAll("#related-categories li a");
      for (sub of subCategories) {
        data.push({ cat: cat.title, subcat: sub.title });
      }
    }
  }
  cb();
}

// const getPage = (async () => {
//   const page = await scrape("https://dentons.net/list/categories/a?location=national-united-kingdom");
//   const categories = page.window.document.querySelectorAll(".list-unstyled li a");
//   categories.forEach(title => {
//     console.log(title.title);
//   })
// })();

// const getPage = (async () => {
//   const page = await scrape("https://dentons.net/results/aids-advice-and-support/national-united-kingdom");
//   const categories = page.window.document.querySelectorAll("#related-categories li a");
//   categories.forEach(title => {
//     console.log(title.title);
//   })
// })();

main(write);


