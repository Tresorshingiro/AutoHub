const deleteCar = async (vehicles, setVehicles, getLoc, user) => {
  if (!user) {
    return
  }
    if (window.confirm(`Are you sure you want to delete the ${vehicles.brand} of ${vehicles.owner.names}`)) {
      try {
        const deleteResponse = await fetch(getLoc + vehicles._id, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        const json = await deleteResponse.json();
        
        if (deleteResponse.status === 200) {
          alert(`Deleted ${vehicles.brand} of ${vehicles.owner.names}`);
          // Remove the vehicle from the state
          setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== vehicles._id));
        } else {
          // Errors occurring in the deletion process
          console.error(json.error); // Log error message
          alert(`Failed to delete the vehicle due to ${json.error}`);
        }
      } catch (error) {
        // For network errors or other exceptions
        console.error('An error occurred: ', error);
        alert('An error occurred while deleting the vehicle');
      }
    }
  };

export default deleteCar;