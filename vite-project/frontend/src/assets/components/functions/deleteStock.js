const deleteStock = async (stock, setStock, getLoc, user) => {
    if (!user) {
      return
    }
    if (window.confirm(`Are you sure you want to delete ${stock.item_id.itemName} from stocks? If so, all the stock of this item will be deleted!`)) {
        try {
            const deleteResponse = await fetch(getLoc + stock._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
          
        const json = await deleteResponse.json();
          
        if (deleteResponse.status === 200) {
            alert(`Deleted ${stock.item_id.itemName} from stocks`);
            // Remove the stock from the state
            setStock(prevStocks => prevStocks.filter(v => v._id !== stock._id));
        } else {
            // Errors occurring in the deletion process
            console.error(json.error); // Log error message
            alert(`Failed to delete the stock due to ${json.error}`);
        }
        } catch (error) {
            // For network errors or other exceptions
            console.error('An error occurred: ', error);
            alert('An error occurred while deleting the stock');
        }
      }
    };
  
  export default deleteStock;