export async function getShippingOverview() {

  const res = await fetch(`https://shdigital-api.herokuapp.com/shippingoverview`, {

    headers: {

        
        
    }
  }

    )
  const data = await res.json()

  return data
}