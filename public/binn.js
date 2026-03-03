let foodsAvailable = [
  { foodName: "Biriyani", price: 100, rating: 4.5, imgUrl: "https://drive.google.com/file/d/1LYjsl6nOzK95-M_h9R1X029ibJPaZGyS/view?usp=drive_link", id: "09TpqcgoNymzwxv8sPAJ" },
  { foodName: "Chicken rice", price: 100, rating: 5, imgUrl: "https://drive.google.com/file/d/1LYjsl6nOzK95-M_h9R1X029ibJPaZGyS/view?usp=drive_link" }
]

function onUserhomePageOpen() {
  // list all food in a div of id = foodsAvailable

}

function hideAddItemPanel() {
  document.getElementById('addItemPanel').style.display = 'none';
}

function openMenu() {
  document.getElementById("orders").style.display = "none";
  document.getElementById("menu").style.display = "block";
  getFoods();


}
function openOrders() {
  document.getElementById("orders").style.display = "block";
  document.getElementById("menu").style.display = "none";
}



function randomRating() {
  const options = [4, 5, 4.5, 3, 3.5];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function renderTable() {
  const tableBody = document.getElementById("foodList");
  tableBody.innerHTML = `
  
  <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                
                `;

  foodsAvailable.forEach((food, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${food.foodName}</td>
      <td>${food.price} Rs</td>
      <td>Rating: ${food.rating}</td>

      <td>
        <button onclick="editFood('${food.id}')">Edit</button>
        <button onclick="deleteFoodDb('${food.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}


async function addFood() {
  const foodName = document.getElementById("foodName").value;
  const price = document.getElementById("price").value;
  const imgUrl = document.getElementById("imgUrl").value;

  try {
    const response = await fetch("/add-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        foodName: foodName,
        price: price,
        rating: randomRating(),
        imgUrl: imgUrl
      })

    });

    const data = await response.json();
    if (data.message == "Foodadded") {
      getFoods();
      hideAddItemPanel();
    }
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

function deleteFood() {
  const ind = document.getElementById("id").value;
  console.log(ind, foodsAvailable);
  deleteFoodDb(foodsAvailable[ind].id);

}


async function deleteFoodDb(id) {
  try {
    const response = await fetch("/deleteFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id })
    });

    const data = await response.json();
    getFoods();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function getFoods() {
  try {
    const response = await fetch("/getFoods");
    const foods = await response.json();
    foodsAvailable = foods;
    console.log(foodsAvailable);
    console.log(foods);
    renderTable();


  } catch (error) {
    console.error("Error:", error);
  }
}


