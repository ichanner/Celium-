export default (body) =>{

	var a = "http://a.com http://a.com"

let positions = []
let starting_index = 0;
let index = a.indexOf('http://');

while(a.substr(starting_index + 1).includes("http://")){

  index =  a.substr(starting_index).indexOf('http://'); 
  closing_index = a.substr(index + 1).indexOf("\r")
  
  positions.push({index, closing_index});

  starting_index = index + 1
}
console.log(positions)
}