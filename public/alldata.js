function AllData(){
  const loggedInUser = localStorage.getItem('loggedInUser');
  const [data, setData] = React.useState('');

  React.useEffect(() => {
    // fetch all accounts from API
    fetch(`/account/all/${JSON.parse(loggedInUser).email}/${JSON.parse(loggedInUser).password}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data);
      });
  }, []); 

  return (
    <>
    <h5>All Data in Store</h5>
    {data}
    </>);
}
