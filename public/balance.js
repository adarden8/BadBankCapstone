function Balance(){
  const loggedInUser = localStorage.getItem('loggedInUser');
  return (
    <Card>
      backgroundColor="primary"
      header="Balance"
      status=""
      cardWidth='20vw'
      body={JSON.parse(loggedInUser).email === '' ? (
        <>
        <h3>LOGIN TO USE FEATURE</h3> 
        </>
      ):(
        <>
        <h4>Available Balance</h4><br/>
        <h4>$Number(Json.parse(loggedInUser.balance.toFixed(2))</h4>
        </>
      )}
      </Card>
  )
}
  