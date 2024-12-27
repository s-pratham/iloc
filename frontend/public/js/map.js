const superstoreData = {
    floors: [
      {
        floor: 1,
        rows: [
          { row: 1, shelves: ["", "Shoes", "Washing Powder", "Fruits", "Cookies"] },
          { row: 2, shelves: ["Rice", "Tomato Sauce", "Milk", "Toothpaste", "Cheese"] },
          { row: 3, shelves: ["Soda", "Bread", "Chips", "soap", "Spices"] },
          { row: 4, shelves: ["Eggs", "Cereal", "Juice", "Shampoo", "Yogurt"] }
        ]
      },
      {
        floor: 2,
        rows: [
          { row: 1, shelves: ["", "Shirts", "Pants", "Towels", "Gloves"] },
          { row: 2, shelves: ["Detergent", "Toilet Paper", "Maggie", "Deodorant", "Tea"] },
          { row: 3, shelves: ["Apple", "Bananas", "Oranges", "Butter", "Grapes"] },
          { row: 4, shelves: ["Coffee", "Chocolate", "Sugar", "Flour", "Pasta"] }
        ]
      }
    ]
  };

  const mapContainer = document.getElementById('map-container');
  const popup = document.getElementById('popup');
  const searchShelfInput = document.getElementById('search-box');

  // Render Floors
  superstoreData.floors.forEach(floor => {
    const floorDiv = document.createElement('div');
    floorDiv.classList.add('floor');
    floorDiv.innerHTML = `<div class="floor-title">Floor ${floor.floor}</div>`;

    // Render Rows
    floor.rows.forEach((row, rowIndex) => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');

      // Render Shelves
      row.shelves.forEach((shelf, index) => {
        const shelfDiv = document.createElement('div');
        shelfDiv.classList.add('shelf');
        shelfDiv.innerText = `${shelf}`;
        shelfDiv.dataset.item = shelf;

        // Add entry point to the first shelf of the first row only
        if (rowIndex === 0 && index === 0) {
          const entryPointDiv = document.createElement('div');
          entryPointDiv.classList.add('entry-point');
          entryPointDiv.innerText = 'Entry Point';
          shelfDiv.appendChild(entryPointDiv);
        }

        // Add interaction
        shelfDiv.addEventListener('mouseenter', (e) => {
          const rect = e.target.getBoundingClientRect();
          popup.style.left = `${rect.left + window.scrollX + 50}px`;
          popup.style.top = `${rect.top + window.scrollY - 90}px`;
          popup.style.display = 'block';
          popup.innerHTML = `
            <h2>${shelf}</h2>
            <p>Floor: ${floor.floor}, Row: ${row.row}, Shelf: ${index + 1}</p>
          `;
        });

        shelfDiv.addEventListener('mouseleave', () => {
          popup.style.display = 'none';
        });

        rowDiv.appendChild(shelfDiv);
      });

      floorDiv.appendChild(rowDiv);
    });

    mapContainer.appendChild(floorDiv);
  });

function navigate(list){
    // Search functionality
  // console.log(list);
  // searchShelfInput.addEventListener('input', function() {

    const searchQuery = list;
    console.log(searchQuery);
    const shelves = document.querySelectorAll('.shelf');
  
    // If search box is empty, remove the 'highlighted' class from all shelves
    if (searchQuery === "") {
      shelves.forEach(shelfDiv => {
        shelfDiv.classList.remove('highlighted');
      });
      return;
    }
  
    // Split search query into individual terms by space
    const searchTerms = list;
    const matchedShelves = []; // Array to store matched shelf elements
  
    shelves.forEach(shelfDiv => {

      const shelfText = shelfDiv.dataset.item.toLowerCase();
      const matches = searchTerms.some(term => shelfText.includes(term));
  
      
      if (matches) {
        matchedShelves.push(shelfDiv); 
      }
    });
  
    // Highlight only the matched shelves
    shelves.forEach(shelfDiv => {
      if (matchedShelves.includes(shelfDiv)) {
        shelfDiv.classList.add('highlighted'); // Highlight matched shelf
      } else {
        shelfDiv.classList.remove('highlighted'); // Remove highlight from non-matched shelves
      }
    });
  // });
}
  
  