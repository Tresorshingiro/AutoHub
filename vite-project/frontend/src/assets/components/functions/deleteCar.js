const deleteCar = async (vehicle, setVehicles, getLoc) => {
    if (window.confirm(`Are you sure you want to delete the ${vehicle.brand} of ${vehicle.owner}`)) {
      try {
        const deleteResponse = await fetch(getLoc + vehicle._id, {
          method: 'DELETE'
        });
        
        const json = await deleteResponse.json();
        
        if (deleteResponse.status === 200) {
          alert(`Deleted ${vehicle.brand} of ${vehicle.owner}`);
          // Remove the vehicle from the state
          setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== vehicle._id));
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