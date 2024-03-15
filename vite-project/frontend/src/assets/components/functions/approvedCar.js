import axios from "axios";

const approvedCar = async (quotation, setQuotations, getLoc, sendLoc, user) => {
    if (window.confirm(`Your going to approve this quotation of car ${quotation.brand} of ${quotation.owner}`)) {
      try {
        // Add the car to the cleared_vehicles collection
        const clearVehicle = await axios.post(sendLoc, {
          brand: quotation.brand,
          owner: quotation.owner,
          plate: quotation.plate,
          type: quotation.type,
          insurance: quotation.insurance,
          telephone: quotation.telephone,
          email: quotation.email,
          description: quotation.description,
          furniture: quotation.furniture,
          quantity: quotation.quantity,
          unitPrice: quotation.unitPrice,
          vatIncluded: quotation.vatIncluded,
          createdAt: quotation.createdAt
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
  
        if (clearVehicle.status === 200) {
          // If successfully added to cleared_vehicles, delete from quotationlist
          const deleteResponse = await fetch(getLoc + quotation._id, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${user.token}`
            }
          });
          const deleteReception = await fetch('http://localhost:3000/api/vehicles/' + quotation._id, {
            method: 'DELETE'
          });
  
          const json = await deleteResponse.json();
  
          if (deleteResponse.status === 200) {
            alert(`Approved quotation of car ${quotation.brand} of ${quotation.owner}`);
            // Remove the vehicle from the state
            setQuotations(prevQuotations => prevQuotations.filter(v => v._id !== quotation._id));
          } else {
            console.error(json.error); // Log error message
            alert(`Failed to delete the quotation from the quotation list: ${json.error}`);
          }
        } else {
          // Errors in moving the deleted car to cleared vehicles
          alert(`Failed to move ${quotation.brand} of ${quotation.owner} to cleared vehicles`);
        }
      } catch (error) {
      // For network errors or other exceptions
        console.error('An error occurred: ', error);
    alert('An error occurred while approving the quotation');
    }
    }
};

export default approvedCar;