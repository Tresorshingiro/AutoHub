const deleteSupplier = async (supplier, setSuppliers, getLoc, user) => {
    if (!user) {
      return
    }
    if (window.confirm(`Are you sure you want to delete ${supplier.company_name} from suppliers`)) {
        try {
            const deleteResponse = await fetch(getLoc + supplier._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
          
        const json = await deleteResponse.json();
          
        if (deleteResponse.status === 200) {
            alert(`Deleted ${supplier.company_name} from Suppliers`);
            // Remove the supplier from the state
            setSuppliers(prevSuppliers => prevSuppliers.filter(v => v._id !== supplier._id));
        } else {
            // Errors occurring in the deletion process
            console.error(json.error); // Log error message
            alert(`Failed to delete the supplier due to ${json.error}`);
        }
        } catch (error) {
            // For network errors or other exceptions
            console.error('An error occurred: ', error);
            alert('An error occurred while deleting the supplier');
        }
      }
    };
  
  export default deleteSupplier;