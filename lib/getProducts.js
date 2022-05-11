export async function getProducts() {

  const res = await fetch(`https://shdigital-api.herokuapp.com/products`, {

    headers: {

        
        
    }
  }

    )
  const data = await res.json()

  return data
}