document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  const toyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById('toy-collection');
  let addToy = false;

  addBtn.addEventListener('click', () => {
      addToy = !addToy;
      if (addToy) {
          toyFormContainer.style.display = 'block';
      } else {
          toyFormContainer.style.display = 'none';
      }
  });

  //  display toys
  fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => {
              const toyCard = createToyCard(toy);
              toyCollection.appendChild(toyCard);
          });
      });

  //  new toy
  toyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = event.target.name.value;
      const image = event.target.image.value;

      fetch('http://localhost:3000/toys', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ name, image, likes: 0 })
      })
      .then(response => response.json())
      .then(toy => {
          const toyCard = createToyCard(toy);
          toyCollection.appendChild(toyCard);
          toyForm.reset();
      });
  });
});

function createToyCard(toy) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const h2 = document.createElement('h2');
  h2.innerText = toy.name;
  
  const img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';
  
  const p = document.createElement('p');
  p.innerText = `${toy.likes} Likes`;
  
  const button = document.createElement('button');
  button.className = 'like-btn';
  button.id = toy.id;
  button.innerText = 'Like ❤️';
  button.addEventListener('click', () => increaseLikes(toy, p));

  div.append(h2, img, p, button);
  return div;
}

function increaseLikes(toy, likesElement) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
      likesElement.innerText = `${updatedToy.likes} Likes`;
  });
}
